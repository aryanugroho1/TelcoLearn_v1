/**
 * TelcoLearn Message Router & State Machine
 * Menangani routing pesan masuk, slash commands, onboarding, kuis evaluasi,
 * dan deteksi heuristik log telekomunikasi untuk AI Reasoning.
 */

import { jidNormalizedUser, downloadMediaMessage } from '@whiskeysockets/baileys';
import * as db from '../database/db.js';

const {
  getUserByJid,
  createUser,
  updateUserState,
  updateUserPreferences,
  updateUserLanguage,
  updateUserStreak,
  touchUserActivity,
  getTopStreakUsers,
  getUserLeaderboardRank,
  getNextModuleForUser,
  markModuleProgress,
  getNextQuizForUser,
  getQuizById,
  recordQuizLog,
  saveUserNote,
  getUserNotes,
  getDailyTokenMetrics,
  getDb,
  logLlmConversation,
  trackAndAdaptUserLanguage,
  getRecentUserQueries
} = db;

// Safe fallbacks to prevent crash if an older db.js is cached by Docker/volume
const saveUserFeedback = db.saveUserFeedback || (() => null);
const getAllFeedbacks = db.getAllFeedbacks || (() => []);
const getFeedbackMetrics = db.getFeedbackMetrics || (() => ({ total: 0, pending: 0 }));
const updateFeedbackStatus = db.updateFeedbackStatus || (() => null);
const clearLlmConversation = db.clearLlmConversation || (() => false);
const getRecentLlmConversation = db.getRecentLlmConversation || (() => []);
const getRandomTrivia = db.getRandomTrivia || (() => null);

import {
  MESSAGES,
  FOCUS_TRACKS,
  REMINDER_PREFERENCES,
  detectTelcoLogPattern,
  isDriveTestInquiry,
  isObviousNonTelcoQuery,
  getLoopbackFooter,
  getRandomEspressoTip,
  formatLeaderboard,
  formatChallengeMessage,
  detectQueryLanguage
} from '../config/constants.js';
import {
  analyzeTelcoLog,
  answerGeneralTelcoQuestion,
  analyzeTelcoImage,
  analyzeTelcoDocument,
  evaluateConversationContext
} from './geminiService.js';
import { generateTelcoSimulation } from './simulationService.js';
import { sendSafeReply, sentMessageIds, recordSentMessageId } from './antiBanService.js';
import { formatWhatsAppAdminReport, sendDailyEmailReport } from './reportingService.js';
import { getCacheMetrics } from './cacheService.js';

// Cache dua arah LID <-> Phone (diadopsi dari ai-reception-zeroweb)
export const lidMap = new Map();

// Re-export untuk backward compatibility
export { sentMessageIds, recordSentMessageId };

export const LOOPBACK_FOOTER = '\n\n────────────────────────\n☕ Dukung kami: https://saweria.co/TelcoLearn\n💡 _Ketik */simulasi* untuk melihat grafik/diagram topik ini, atau *0* untuk menu utama._';

/**
 * Normalisasi nomor telepon internasional (diadopsi dari ai-reception-zeroweb)
 * Mendukung nomor Jepang (+81 70/80/90), Indonesia (+62), dan internasional lainnya
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  const str = phone.toString().split('@')[0].split(':')[0];
  let clean = str.replace(/\D/g, '');
  if (!clean) return '';

  // Auto-repair accidentally double-prefixed Japanese numbers (62 + 8170/8180/8190 xxxxxxxx)
  if (/^62(81[789]0\d{7,8})$/.test(clean)) {
    return clean.slice(2);
  }

  // If starts with 081 followed by 70/80/90, it is Japanese international entered with leading 0 (0 + 8170...)
  if (/^0(81[789]0\d{7,8})$/.test(clean)) {
    return clean.slice(1);
  }

  // Japanese mobile numbers (+81 70/80/90 xxxx xxxx, 12 digits)
  if (/^81[789]0\d{7,8}$/.test(clean)) {
    return clean;
  }

  // Other Japanese phone numbers (+81 xxxxxxxxx)
  if (/^81\d{9,10}$/.test(clean)) {
    return clean;
  }

  // If starts with 0 (national Indonesian format e.g. 0812...), convert national 0 to 62
  if (clean.startsWith('0')) {
    return '62' + clean.slice(1);
  }

  // Already Indonesian international format (+62...)
  if (clean.startsWith('62')) {
    return clean;
  }

  // If Indonesian mobile shorthand without leading 0 (e.g. 811..., 812..., 857...)
  if (clean.startsWith('8') && !clean.startsWith('8170') && !clean.startsWith('8180') && !clean.startsWith('8190')) {
    return '62' + clean;
  }

  return clean;
}

/**
 * Resolusi identitas pengirim (Phone dan LID) dari pesan Baileys
 * Diadopsi persis dari baileys_manager.js ai-reception-zeroweb
 */
export async function resolveSenderIdentity(msg, sock) {
  const rawJid = msg.key?.remoteJid || '';
  const altJid = msg.key?.remoteJidAlt || msg.key?.participantAlt || '';

  let cleanPhone = '';
  let cleanLid = '';

  if (rawJid.includes('@lid')) {
    cleanLid = rawJid.split('@')[0].split(':')[0].replace(/\D/g, '');
  } else {
    cleanPhone = normalizePhone(rawJid);
  }

  if (altJid && (altJid.includes('@s.whatsapp.net') || !altJid.includes('@lid'))) {
    cleanPhone = normalizePhone(altJid);
  } else if (altJid && altJid.includes('@lid') && !cleanLid) {
    cleanLid = altJid.split('@')[0].split(':')[0].replace(/\D/g, '');
  }

  if (!cleanPhone && cleanLid && sock?.signalRepository?.lidMapping?.getPNForLID) {
    try {
      const pnJid = await sock.signalRepository.lidMapping.getPNForLID(rawJid);
      if (pnJid) {
        cleanPhone = normalizePhone(pnJid);
      }
    } catch (e) {}
  }

  if (!cleanPhone && cleanLid && lidMap.has(cleanLid)) {
    cleanPhone = lidMap.get(cleanLid);
  }

  if (cleanLid && cleanPhone) {
    lidMap.set(cleanLid, cleanPhone);
    lidMap.set(cleanPhone, cleanLid);
  }

  return {
    senderJid: rawJid,
    phone: cleanPhone || cleanLid,
    lid: cleanLid || null,
    resolvedPhone: cleanPhone || null
  };
}

/**
 * Kirim pesan balasan dengan simulasi typing singkat (clean & non-blocking)
 * Mengadopsi strategi pengiriman langsung dari ai-reception-zeroweb
 */
export async function sendReply(sock, jid, content, options = {}) {
  try {
    // Tampilkan typing bubble sebentar agar terasa interaktif
    await sock.sendPresenceUpdate('composing', jid).catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 800));
    await sock.sendPresenceUpdate('paused', jid).catch(() => {});
  } catch (e) {}

  console.log(`📤 [Outbound Send] Mengirim balasan ke ${jid}...`);
  const sent = await sock.sendMessage(jid, content, options);
  if (sent?.key?.id) {
    recordSentMessageId(sent.key.id);
  }
  return sent;
}
/**
 * Ekstraksi teks dari berbagai tipe objek pesan Baileys
 */
export function extractMessageText(message) {
  if (!message) return '';
  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    ''
  ).trim();
}

/**
 * Handler utama untuk setiap pesan masuk (diadopsi dari ai-reception-zeroweb)
 */
export async function handleIncomingMessage(sock, msg) {
  try {
    const senderJid = msg.key?.remoteJid;
    if (!senderJid) return;

    // 0. ANTI-LOOP GUARD (persis ai-reception-zeroweb): Drop pesan yang dikirim oleh bot sendiri
    if (msg.key?.id && sentMessageIds.has(msg.key.id)) return;

    // 1. FILTER BROADCAST, NEWSLETTERS & NON-WHATSAPP FEEDS
    if (senderJid.endsWith('@newsletter') || senderJid.includes('@newsletter')) return;
    if (senderJid === 'status@broadcast' || senderJid.endsWith('@broadcast')) return;

    const isGroup = senderJid.endsWith('@g.us') || senderJid.includes('@g.us');

    const rawText = extractMessageText(msg.message);
    const hasImage = Boolean(msg.message?.imageMessage);
    const documentMsg = msg.message?.documentMessage || msg.message?.documentWithCaptionMessage?.message?.documentMessage;
    const hasDocument = Boolean(documentMsg);

    if (!rawText && !hasImage && !hasDocument) return;

    const myPnRaw = (sock?.user?.id || '').split(':')[0].replace(/\D/g, '');
    const myLidRaw = (sock?.authState?.creds?.me?.lid || '').split(':')[0].replace(/\D/g, '');
    const myPn = myPnRaw ? `${myPnRaw}@s.whatsapp.net` : null;
    const myLid = myLidRaw ? `${myLidRaw}@lid` : null;

    // Resolusi identitas pengirim (LID & Phone mapping persis ai-reception-zeroweb)
    const identity = await resolveSenderIdentity(msg, sock);
    const cleanSenderPhone = identity.resolvedPhone || (senderJid.includes('@lid') ? '' : identity.phone);
    const cleanSenderLid = identity.lid;

    // Deteksi obrolan dengan diri sendiri (Message Yourself)
    const isTargetingSelf = Boolean(
      !isGroup && (
        (myLid && (senderJid === myLid || (cleanSenderLid && cleanSenderLid === myLidRaw))) ||
        (myPn && (senderJid === myPn || (cleanSenderPhone && cleanSenderPhone === myPnRaw)))
      )
    );

    // KRUSIAL ANTI-LOOP: Jika msg.key.fromMe = true TETAPI BUKAN obrolan ke bot sendiri,
    // maka ini adalah pesan keluar yang dikirim ke kontak/user lain.
    // JANGAN PERNAH diproses sebagai pesan masuk agar tidak terjadi feedback loop!
    if (msg.key?.fromMe && !isTargetingSelf) {
      return;
    }

    // 1.1. SAFE GROUP MODE: Deteksi Mention, Quote Bot, atau Command Prefix
    let groupCleanText = rawText.trim();
    if (isGroup) {
      const contextInfo = msg.message?.extendedTextMessage?.contextInfo ||
                          msg.message?.imageMessage?.contextInfo ||
                          msg.message?.documentMessage?.contextInfo;
      const mentionedJids = contextInfo?.mentionedJid || [];
      const isMentioned = Boolean(
        (myPnRaw && mentionedJids.some(j => j.includes(myPnRaw))) ||
        (myLidRaw && mentionedJids.some(j => j.includes(myLidRaw))) ||
        (myPnRaw && rawText.includes(`@${myPnRaw}`))
      );
      const quotedParticipant = contextInfo?.participant || '';
      const isQuotingBot = Boolean(
        (myPnRaw && quotedParticipant.includes(myPnRaw)) ||
        (myLidRaw && quotedParticipant.includes(myLidRaw))
      );
      const groupTriggerRegex = /^[!/](telco|tanya|ask|kuis|quiz|top|leaderboard|espresso|tip|trivia|pmp|help|bantuan|tantang|challenge|belajar|learn)\b/i;
      const hasGroupPrefix = groupTriggerRegex.test(rawText);

      // JIKA DI GRUP DAN TIDAK ADA TRIGGER SAMA SEKALI -> DROP SILENTLY (Anti-Spam & Zero Token Waste)
      if (!isMentioned && !isQuotingBot && !hasGroupPrefix) {
        return;
      }

      // Bersihkan trigger prefix dan mention agar prompt ke AI tetap natural
      groupCleanText = rawText
        .replace(groupTriggerRegex, '')
        .replace(new RegExp(`@${myPnRaw}`, 'g'), '')
        .trim();
    }

    const isSelfChat = isTargetingSelf;

    // Tentukan JID balasan dan identitas database pengguna
    let replyJid;
    let phoneNumber;
    let pushName;
    let userDbKey;

    if (isGroup) {
      replyJid = senderJid;
      const participantJid = msg.key?.participant || msg.participant || senderJid;
      phoneNumber = participantJid.replace(/\D/g, '');
      userDbKey = participantJid.includes('@lid') ? participantJid : `${phoneNumber}@s.whatsapp.net`;
      pushName = msg.pushName || `Engineer ${phoneNumber.slice(-4)}`;
    } else {
      replyJid = isSelfChat ? myPn : senderJid;
      phoneNumber = isSelfChat ? myPn.replace(/\D/g, '') : (cleanSenderPhone || cleanSenderLid || senderJid.replace(/\D/g, ''));
      pushName = msg.pushName || (isSelfChat ? 'Admin TelcoLearn' : 'Pelajar Telco');
      userDbKey = isSelfChat ? myPn : (cleanSenderPhone ? `${cleanSenderPhone}@s.whatsapp.net` : senderJid);
    }

    const mediaLabel = hasImage ? '[GAMBAR]' : (hasDocument ? `[DOKUMEN: ${documentMsg.fileName || 'file'}]` : '');
    console.log(`📩 [Inbound] Pesan dari ${senderJid} (${isGroup ? 'Group' : 'DM'}, Route ke: ${replyJid}): ${mediaLabel} "${rawText}"`);

    const groupFooter = myPnRaw ? `\n\n💬 _Latihan privat, kuis harian & pantau streak:_\n👉 https://wa.me/${myPnRaw}?text=halo` : '';
    const reply = (content) => {
      let finalContent = content;
      if (isGroup && finalContent && typeof finalContent.text === 'string') {
        finalContent = {
          ...finalContent,
          text: `${finalContent.text}${groupFooter}`
        };
      }
      return sendReply(sock, replyJid, finalContent, isGroup ? { quoted: msg } : {});
    };

    // 1. Ambil atau Buat User di SQLite
    let user = getUserByJid(userDbKey) || getUserByJid(senderJid);
    const effectiveText = isGroup ? (groupCleanText || rawText) : rawText;
    let lowerText = effectiveText.toLowerCase().trim();
    if (lowerText.startsWith('!')) {
      lowerText = '/' + lowerText.slice(1);
    }
    const isGreeting = ['halo', 'hi', 'hello', 'hai', 'p', 'tes', 'test', 'start', '/start', 'mulai'].some(g => lowerText === g || lowerText.startsWith(g + ' ') || lowerText.startsWith(g + '!'));
    const isFreeInquiry = effectiveText.trim().length > 3 && !isGreeting && !['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(effectiveText.trim()) && !lowerText.startsWith('/');
    const isMediaInquiry = hasImage || hasDocument;

    if (!user) {
      const firstLang = detectQueryLanguage(effectiveText, 'id');
      user = createUser({
        jid: userDbKey,
        phone_number: phoneNumber,
        display_name: pushName,
        current_state: (isGroup || isSelfChat || isFreeInquiry || isMediaInquiry) ? 'IDLE' : 'ONBOARDING_LANG',
        focus_track: 'protocol_qa',
        preferred_language: firstLang,
        reminder_preference: isGroup ? 'off' : 'all'
      });
      console.log(`👋 [User Baru] Terdaftar: ${userDbKey} (State: ${user.current_state}, Lang: ${firstLang})`);
      if (!isGroup && !isSelfChat && !isFreeInquiry && !isMediaInquiry) {
        await reply({ text: MESSAGES.WELCOME_LANGUAGE });
        return;
      }
    }

    // 1.5. INBOUND IMAGE HANDLER (Gemini Multimodal Vision - Coverage, Drive Test, Spektrum)
    if (hasImage) {
      const imgMsg = msg.message.imageMessage;
      const mimeType = imgMsg.mimetype || 'image/jpeg';
      const caption = rawText || '';
      console.log(`🖼️ [Inbound Image] Menerima gambar (${mimeType}) dari ${senderJid}. Caption: "${caption}"`);
      await reply({
        text: `🔍 *Menganalisis gambar telekomunikasi/coverage...*\nMemproses grafik & parameter radio via AI Multimodal Vision...`
      });

      try {
        const buffer = await downloadMediaMessage(
          msg,
          'buffer',
          {},
          {
            reuploadRequest: sock.updateMediaMessage
          }
        );

        if (!buffer || buffer.length === 0) {
          await reply({ text: `⚠️ Gagal mengunduh gambar WhatsApp. Silakan kirimkan kembali.${getLoopbackFooter(user)}` });
          return;
        }

        touchUserActivity(user.jid);
        const visionAnalysis = await analyzeTelcoImage(buffer, mimeType, caption, user.id);
        await reply({ text: `${visionAnalysis}${getLoopbackFooter(user)}` });
      } catch (mediaErr) {
        console.error('❌ Gagal memproses gambar:', mediaErr);
        await reply({ text: `⚠️ Maaf, terjadi kendala saat mengunduh atau menganalisis gambar. Silakan coba kembali.${getLoopbackFooter(user)}` });
      }
      return;
    }

    // 1.6. INBOUND DOCUMENT HANDLER (Log Dokumen .txt, .csv, .log, atau deteksi .drm)
    if (hasDocument) {
      const fileName = documentMsg.fileName || 'dokumen_log.txt';
      const mimeType = documentMsg.mimetype || 'text/plain';
      const caption = rawText || '';
      console.log(`📄 [Inbound Document] Menerima dokumen "${fileName}" (${mimeType}) dari ${senderJid}. Caption: "${caption}"`);
      await reply({
        text: `📥 *Menerima dokumen log:* \`${fileName}\`\nSedang membaca dan menganalisis struktur data protokol radio...`
      });

      try {
        const buffer = await downloadMediaMessage(
          msg,
          'buffer',
          {},
          {
            reuploadRequest: sock.updateMediaMessage
          }
        );

        if (!buffer || buffer.length === 0) {
          await reply({ text: `⚠️ Gagal mengunduh dokumen WhatsApp. Silakan kirimkan kembali.${getLoopbackFooter(user)}` });
          return;
        }

        touchUserActivity(user.jid);
        const docAnalysis = await analyzeTelcoDocument(buffer, fileName, mimeType, caption, user.id);
        await reply({ text: `${docAnalysis}${getLoopbackFooter(user)}` });
      } catch (mediaErr) {
        console.error('❌ Gagal memproses dokumen:', mediaErr);
        await reply({ text: `⚠️ Maaf, terjadi kendala saat mengunduh atau membaca dokumen log. Silakan coba kembali.${getLoopbackFooter(user)}` });
      }
      return;
    }

    const currentState = user.current_state || 'IDLE';

    // 2. GREETING & MAIN MENU TRIGGER
    if (isGreeting) {
      if (user.current_state === 'ONBOARDING_LANG') {
        await reply({ text: MESSAGES.WELCOME_LANGUAGE });
        return;
      } else if (user.current_state === 'ONBOARDING_TRACK') {
        const isEnglishUser = user.preferred_language === 'en';
        await reply({ text: isEnglishUser ? MESSAGES.WELCOME_TRACK_EN : MESSAGES.WELCOME_TRACK_ID });
        return;
      }
      updateUserState(user.jid, 'IDLE', null);
      await reply({ text: MESSAGES.MAIN_MENU(user) });
      return;
    }

    // Reset command darurat kapan saja
    if (lowerText === '/reset') {
      updateUserState(user.jid, 'ONBOARDING_LANG', null);
      await reply({ text: MESSAGES.WELCOME_LANGUAGE });
      return;
    }

    // 2.5. STATE: ONBOARDING_LANG (Memilih Bahasa: 1 = Bahasa Indonesia, 2 = English)
    if (currentState === 'ONBOARDING_LANG') {
      const choice = rawText.trim().toLowerCase();
      if (['1', 'id', 'indonesia', 'indo', 'bahasa', 'bahasa indonesia'].includes(choice)) {
        updateUserPreferences(user.jid, { preferred_language: 'id' });
        updateUserState(user.jid, 'ONBOARDING_TRACK', null);
        user.preferred_language = 'id';
        await reply({ text: MESSAGES.WELCOME_TRACK_ID });
        return;
      } else if (['2', 'en', 'english', 'inggris'].includes(choice)) {
        updateUserPreferences(user.jid, { preferred_language: 'en' });
        updateUserState(user.jid, 'ONBOARDING_TRACK', null);
        user.preferred_language = 'en';
        await reply({ text: MESSAGES.WELCOME_TRACK_EN });
        return;
      } else if (['0', '/menu', 'menu', 'kembali'].includes(choice)) {
        updateUserState(user.jid, 'IDLE', null);
        await reply({ text: MESSAGES.MAIN_MENU(user) });
        return;
      } else if (choice.length === 1 && ['3', '4', '5', '6', '7', '8', '9'].includes(choice)) {
        await reply({
          text: `🌐 *PILIH BAHASA / CHOOSE LANGUAGE:*
Mohon ketik angka *1* atau *2* / Please reply with *1* or *2*:

1️⃣ *Bahasa Indonesia* 🇮🇩
2️⃣ *English* 🇬🇧

_(Ketik *0* untuk langsung ke menu utama / Type *0* for main menu)_`
        });
        return;
      } else {
        // User langsung mengetik pertanyaan teknis bebas / slash command:
        // Auto-complete onboarding ke IDLE agar tidak memblokir user
        console.log(`⏩ [Auto-Bypass Onboarding Lang] User ${user.jid} mengirim "${rawText}", auto-complete onboarding ke IDLE.`);
        const autoLang = detectQueryLanguage(rawText, user?.preferred_language || 'id');
        updateUserPreferences(user.jid, { focus_track: 'protocol_qa', preferred_language: autoLang, reminder_preference: 'all' });
        updateUserState(user.jid, 'IDLE', null);
        user = getUserByJid(user.jid);
      }
    }

    // 3. STATE: ONBOARDING_TRACK (Memilih 1, 2, 3, atau 4)
    if (currentState === 'ONBOARDING_TRACK') {
      const choice = rawText.trim().toLowerCase();
      const isEnglishUser = user.preferred_language === 'en';

      let selected = null;
      if (['1', '2', '3', '4', '5'].includes(choice)) {
        selected = FOCUS_TRACKS[choice];
      } else if (/^1\b|protocol|4g.*5g|qa/i.test(choice)) {
        selected = FOCUS_TRACKS['1'];
      } else if (/^2\b|drive.*test|field|drivetest/i.test(choice)) {
        selected = FOCUS_TRACKS['2'];
      } else if (/^3\b|ml|machine.*learning|analytics/i.test(choice)) {
        selected = FOCUS_TRACKS['3'];
      } else if (/^4\b|log|troubleshoot/i.test(choice)) {
        selected = FOCUS_TRACKS['4'];
      } else if (/^5\b|pmp|pmbok|project.*management|rollout/i.test(choice)) {
        selected = FOCUS_TRACKS['5'];
      }

      if (selected) {
        updateUserPreferences(user.jid, { focus_track: selected.key });
        updateUserState(user.jid, 'IDLE', null);
        user.focus_track = selected.key;
        const ackMsg = isEnglishUser
          ? `${MESSAGES.ONBOARDING_ACK_EN(selected.label)}${getLoopbackFooter(user)}`
          : `${MESSAGES.ONBOARDING_ACK_ID(selected.label)}${getLoopbackFooter(user)}`;
        await reply({ text: ackMsg });
        return;
      } else if (['0', '/menu', 'menu', 'kembali'].includes(choice)) {
        updateUserState(user.jid, 'IDLE', null);
        await reply({ text: MESSAGES.MAIN_MENU(user) });
        return;
      } else if (choice.length === 1 && ['6', '7', '8', '9'].includes(choice)) {
        const promptMsg = isEnglishUser
          ? `⚠️ Please reply with *1*, *2*, *3*, *4*, or *5* to select your study track:\n\n1️⃣ 4G/5G Protocol QA\n2️⃣ Field & Drive Test\n3️⃣ ML Telco Testing\n4️⃣ Log Analysis\n5️⃣ Telecom Project Management (PMP)\n\n_(Or type *0* to go to the main menu)_`
          : `⚠️ Mohon ketik angka *1*, *2*, *3*, *4*, atau *5* untuk memilih fokus belajar:\n\n1️⃣ 4G/5G Protocol QA\n2️⃣ Field & Drive Test\n3️⃣ ML Telco Testing\n4️⃣ Log Analysis\n5️⃣ Telecom Project Management (PMP)\n\n_(Atau ketik *0* untuk langsung ke menu utama)_`;
        await reply({ text: promptMsg });
        return;
      } else {
        // User langsung mengetik pertanyaan teknis bebas / slash command:
        console.log(`⏩ [Auto-Bypass Onboarding Track] User ${user.jid} mengirim "${rawText}", auto-complete onboarding ke IDLE.`);
        updateUserPreferences(user.jid, { focus_track: 'protocol_qa', reminder_preference: 'all' });
        updateUserState(user.jid, 'IDLE', null);
        user = getUserByJid(user.jid); // Muat ulang objek user
      }
    }

    // 4. STATE: AWAITING_DRIVETEST_CONFIRM (Konfirmasi apakah konteksnya Drivetest)
    if (currentState === 'AWAITING_DRIVETEST_CONFIRM') {
      const isEnglishUser = user.preferred_language === 'en';
      if (['0', '/menu', 'menu', 'kembali', 'home', '/batal', 'batal', '/cancel', 'cancel'].includes(lowerText)) {
        updateUserState(user.jid, 'IDLE', null);
        const cancelMsg = isEnglishUser
          ? `❌ *Confirmation cancelled.* Returning to main menu:\n\n${MESSAGES.MAIN_MENU(user)}`
          : `❌ *Konfirmasi dibatalkan.* Kembali ke menu utama:\n\n${MESSAGES.MAIN_MENU(user)}`;
        await reply({ text: cancelMsg });
        return;
      }

      let pendingQuestion = '';
      try {
        const payload = JSON.parse(user.state_payload || '{}');
        pendingQuestion = payload.pending_question || '';
      } catch (e) {}

      if (!pendingQuestion) {
        updateUserState(user.jid, 'IDLE', null);
        const expireMsg = isEnglishUser
          ? `Confirmation session expired. Please re-submit your question.${getLoopbackFooter(user)}`
          : `Sesi konfirmasi kedaluwarsa. Silakan ajukan pertanyaan Anda kembali.${getLoopbackFooter(user)}`;
        await reply({ text: expireMsg });
        return;
      }

      const yesRegex = /^(ya|yes|y|iya|betul|benar|yup|yo|drivetest|drive test|ok|oke)$/i;
      const noRegex = /^(tidak|no|n|bukan|ga|gak|bkn|ngga|nggak|bukan drivetest)$/i;

      if (yesRegex.test(lowerText)) {
        updateUserState(user.jid, 'IDLE', null);
        const activeLang = trackAndAdaptUserLanguage(user, pendingQuestion);
        const isEnglishActive = activeLang === 'en';
        const ack = isEnglishActive
          ? `👍 *Understood, answering in the context of Field & Drive Test 🚙:*`
          : `👍 *Baik, pertanyaan Anda dijawab dalam konteks Field & Drive Test 🚙:*`;
        await reply({ text: ack });
        const answer = await answerGeneralTelcoQuestion(pendingQuestion, user.id, {
          contextTrack: 'drive_test',
          preferredLanguage: activeLang
        });
        await reply({ text: `${answer}${getLoopbackFooter(user)}` });
        return;
      } else if (noRegex.test(lowerText)) {
        updateUserState(user.jid, 'IDLE', null);
        const activeLang = trackAndAdaptUserLanguage(user, pendingQuestion);
        const isEnglishActive = activeLang === 'en';
        const trackLabel = FOCUS_TRACKS[Object.keys(FOCUS_TRACKS).find(k => FOCUS_TRACKS[k].key === user.focus_track)]?.label || 'Protocol QA';
        const ack = isEnglishActive
          ? `👍 *Understood, answering in the context of ${trackLabel}:*`
          : `👍 *Baik, pertanyaan Anda dijawab dalam konteks ${trackLabel}:*`;
        await reply({ text: ack });
        const answer = await answerGeneralTelcoQuestion(pendingQuestion, user.id, {
          contextTrack: user.focus_track,
          preferredLanguage: activeLang
        });
        await reply({ text: `${answer}${getLoopbackFooter(user)}` });
        return;
      } else {
        if (lowerText.startsWith('/')) {
          updateUserState(user.jid, 'IDLE', null);
          // Lanjut ke handler slash command di bawah
        } else {
          const prompt = isEnglishUser
            ? `⚠️ Please confirm by replying *Yes* or *No*:\n\n*Is this inquiry related to Drive Testing?*\n_"${pendingQuestion}"_\n\n_(Type *0* to return to main menu)_`
            : `⚠️ Mohon konfirmasi dengan menjawab *Ya* atau *Tidak*:\n\n*Apakah ini konteksnya Drivetest?*\n_"${pendingQuestion}"_\n\n_(Ketik *0* untuk kembali ke menu utama)_`;
          await reply({ text: prompt });
          return;
        }
      }
    }

    // 4.05. STATE: AWAITING_TOPIC_CONFIRM (Konfirmasi apakah Topik Baru atau Terkait Topik Lama)
    if (currentState === 'AWAITING_TOPIC_CONFIRM') {
      if (['0', '/menu', 'menu', 'kembali', 'home', '/batal', 'batal'].includes(lowerText)) {
        updateUserState(user.jid, 'IDLE', null);
        await reply({ text: `❌ *Konfirmasi dibatalkan.* Kembali ke menu utama:\n\n${MESSAGES.MAIN_MENU(user)}` });
        return;
      }

      let pendingQuestion = '';
      let lastTopic = '';
      try {
        const payload = JSON.parse(user.state_payload || '{}');
        pendingQuestion = payload.pending_question || '';
        lastTopic = payload.last_topic || '';
      } catch (e) {}

      if (!pendingQuestion) {
        updateUserState(user.jid, 'IDLE', null);
        await reply({ text: `Sesi konfirmasi kedaluwarsa. Silakan ajukan pertanyaan Anda kembali.${getLoopbackFooter(user)}` });
        return;
      }

      const isNewTopicChoice = /^(1|baru|topik baru|new|new topic|bukan|beda|ganti topik|topik lain)$/i.test(lowerText.trim());
      const isRelatedChoice = /^(2|terkait|masih terkait|lanjut|lanjutan|sambung|ya|yes|betul|benar|sama)$/i.test(lowerText.trim());

      const isEnglishUser = user.preferred_language === 'en';
      if (isNewTopicChoice) {
        // Bersihkan memori percakapan lama agar tidak tercampur
        clearLlmConversation(user.id);
        updateUserState(user.jid, 'IDLE', null);
        const activeLang = trackAndAdaptUserLanguage(user, pendingQuestion);
        const isEnglishActive = activeLang === 'en';
        const startMsg = isEnglishActive
          ? `🆕 *Starting New Topic:* Analyzing without previous context...`
          : `🆕 *Memulai Topik Baru:* Menganalisis tanpa riwayat sebelumnya...`;
        await reply({ text: startMsg });
        const answer = await answerGeneralTelcoQuestion(pendingQuestion, user.id, {
          contextTrack: user.focus_track,
          preferredLanguage: activeLang,
          forceNewTopic: true
        });
        await reply({ text: `${answer}${getLoopbackFooter(user)}` });
        return;
      } else if (isRelatedChoice) {
        updateUserState(user.jid, 'IDLE', null);
        const activeLang = trackAndAdaptUserLanguage(user, pendingQuestion);
        const isEnglishActive = activeLang === 'en';
        const contMsg = isEnglishActive
          ? `🔗 *Continuing Discussion:* Connecting with previous context...`
          : `🔗 *Melanjutkan Pembahasan:* Menghubungkan dengan konteks sebelumnya...`;
        await reply({ text: contMsg });
        const answer = await answerGeneralTelcoQuestion(pendingQuestion, user.id, {
          contextTrack: user.focus_track,
          preferredLanguage: activeLang,
          forceFollowUp: true
        });
        await reply({ text: `${answer}${getLoopbackFooter(user)}` });
        return;
      } else {
        if (lowerText.startsWith('/')) {
          updateUserState(user.jid, 'IDLE', null);
          // Lanjut ke handler slash command di bawah
        } else {
          const prompt = isEnglishUser
            ? `⚠️ Please choose option *1* or *2*:\n\n1️⃣ *New Topic* (Start fresh topic)\n2️⃣ *Still Related* (Follow-up to previous discussion)\n\n_(Type *0* to cancel)_`
            : `⚠️ Mohon konfirmasi dengan memilih angka *1* atau *2*:\n\n1️⃣ *Topik Baru* (Mulai pembahasan baru)\n2️⃣ *Masih Terkait* (Lanjutan dari pembahasan tadi)\n\n_(Ketik *0* untuk membatalkan)_`;
          await reply({ text: prompt });
          return;
        }
      }
    }

    // 4. STATE: AWAITING QUIZ ANSWER
    if (currentState === 'AWAITING_QUIZ_ANSWER') {
      let activeQuizId = null;
      try {
        const payload = JSON.parse(user.state_payload || '{}');
        activeQuizId = payload.active_quiz_id;
      } catch (e) {
        console.error('Error parsing state_payload:', e);
      }

      const isEnglishUser = user.preferred_language === 'en';

      if (!activeQuizId) {
        updateUserState(user.jid, 'IDLE', null);
        await reply({
          text: isEnglishUser
            ? `Quiz session expired. Type */quiz* (or *2*) for a new quiz.${getLoopbackFooter(user)}`
            : `Sesi kuis kedaluwarsa. Ketik */quiz* (atau *2*) untuk kuis baru.${getLoopbackFooter(user)}`
        });
        return;
      }

      const quiz = getQuizById(activeQuizId);
      if (!quiz) {
        updateUserState(user.jid, 'IDLE', null);
        await reply({
          text: isEnglishUser
            ? `Quiz not found. Type */quiz* (or *2*) for a new quiz.${getLoopbackFooter(user)}`
            : `Kuis tidak ditemukan. Ketik */quiz* (atau *2*) untuk kuis baru.${getLoopbackFooter(user)}`
        });
        return;
      }

      if (lowerText === '/batal' || lowerText === '/cancel' || lowerText === 'batal' || lowerText === 'cancel' || lowerText === '0' || lowerText === '/menu' || lowerText === 'menu' || lowerText === 'kembali') {
        updateUserState(user.jid, 'IDLE', null);
        await reply({
          text: isEnglishUser
            ? `❌ *Quiz cancelled.* Returning to main menu:\n\n${MESSAGES.MAIN_MENU(user)}`
            : `❌ *Kuis dibatalkan.* Kembali ke menu utama:\n\n${MESSAGES.MAIN_MENU(user)}`
        });
        return;
      }

      // Normalisasi jawaban: konversi 1,2,3,4 ke A,B,C,D jika user mengetik angka
      const numberToLetter = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
      const selectedOption = (numberToLetter[lowerText] || lowerText).toUpperCase();

      if (!['A', 'B', 'C', 'D'].includes(selectedOption)) {
        await reply({
          text: isEnglishUser
            ? `⚠️ Please reply with option *A*, *B*, *C*, or *D*! (or type *0* / */cancel* to return to main menu)`
            : `⚠️ Mohon jawab dengan pilihan huruf *A*, *B*, *C*, atau *D*! (atau ketik *0* / */batal* untuk kembali ke menu utama)`
        });
        return;
      }

      const isCorrect = selectedOption === quiz.correct_option.toUpperCase();
      recordQuizLog(user.id, quiz.id, selectedOption, isCorrect);
      const newStreak = updateUserStreak(user.jid, isCorrect);
      updateUserState(user.jid, 'IDLE', null);
      const explText = (isEnglishUser && quiz.explanation_en) ? quiz.explanation_en : quiz.explanation;

      if (isCorrect) {
        const responseText = isEnglishUser
          ? `🎉 *Spot On! (Answer ${quiz.correct_option})*\n\n📊 *Technical Explanation:*\n${explText}\n\n🏆 *Your streak increased:* *🔥 ${newStreak} Consecutive Days of Learning!*\n\nType */learn* (or *1*) for the next module or */quiz* (or *2*) for another challenge!${getLoopbackFooter(user)}`
          : `🎉 *Tepat Sekali! (Jawaban ${quiz.correct_option})*\n\n📊 *Penjelasan Teknis:*\n${explText}\n\n🏆 *Streak Anda bertambah:* *🔥 ${newStreak} Hari Belajar Berturut-turut!*\n\nKetik */belajar* (atau *1*) untuk materi selanjutnya atau */quiz* (atau *2*) untuk tantangan berikutnya!${getLoopbackFooter(user)}`;
        await reply({ text: responseText });
      } else {
        const responseText = isEnglishUser
          ? `❌ *Not Quite Right!*\nThe correct answer is *${quiz.correct_option}*.\n\n📊 *Technical Explanation:*\n${explText}\n\n💪 Keep going! Your current streak: *🔥 ${user.streak_count || 0} Days*.\nType */quiz* (or *2*) to practice another topic!${getLoopbackFooter(user)}`
          : `❌ *Jawaban Kurang Tepat!*\nJawaban yang benar adalah *${quiz.correct_option}*.\n\n📊 *Penjelasan Teknis:*\n${explText}\n\n💪 Jangan patah semangat! Rekor streak Anda saat ini: *🔥 ${user.streak_count || 0} Hari*.\nKetik */quiz* (atau *2*) untuk melatih topik lain!${getLoopbackFooter(user)}`;
        await reply({ text: responseText });
      }
      return;
    }

    // 5. STATE: AWAITING CUSTOM NOTE
    if (currentState === 'AWAITING_CUSTOM_NOTE') {
      if (lowerText === '/batal' || lowerText === '/cancel' || lowerText === 'batal' || lowerText === 'cancel' || lowerText === '0' || lowerText === '/menu' || lowerText === 'menu' || lowerText === 'kembali') {
        updateUserState(user.jid, 'IDLE', null);
        await reply({ text: `❌ *Pencatatan dibatalkan.* Kembali ke menu utama:\n\n${MESSAGES.MAIN_MENU(user)}` });
        return;
      }
      saveUserNote(user.id, 'Catatan Belajar', rawText, 'note');
      updateUserState(user.jid, 'IDLE', null);
      await reply({
        text: `📝 *Catatan Berhasil Disimpan!*\n\n_"${rawText}"_${getLoopbackFooter(user)}`
      });
      return;
    }

    // 5.5. STATE: AWAITING USER FEEDBACK (/masukan)
    if (currentState === 'AWAITING_USER_FEEDBACK') {
      if (['/batal', '/cancel', 'batal', 'cancel', '0', '/menu', 'menu', 'kembali'].includes(lowerText)) {
        updateUserState(user.jid, 'IDLE', null);
        await reply({ text: `❌ *Pengiriman masukan dibatalkan.* Kembali ke menu utama:\n\n${MESSAGES.MAIN_MENU(user)}` });
        return;
      }

      const fbId = await saveUserFeedback({
        feedbackText: rawText,
        category: 'general'
      });
      updateUserState(user.jid, 'IDLE', null);

      await reply({
        text: `🙏 *Terima Kasih Banyak atas Masukan Anda!*\n\nSaran Anda telah berhasil dicatat ke sistem pengembangan TelcoLearn (Tiket *#${fbId || 'BARU'}*):\n_"${rawText}"_\n\nIde dan masukan Anda sangat berharga untuk penambahan fitur dan kurikulum selanjutnya. Tetap semangat belajar! 🚀${getLoopbackFooter(user)}`
      });
      return;
    }

    // 6. SLASH COMMANDS & SHORTCUTS (State IDLE)
    // 0 / Menu Utama
    if (lowerText === '/menu' || lowerText === 'menu' || lowerText === '0' || lowerText === 'kembali' || lowerText === 'home' || lowerText === 'main menu') {
      await reply({ text: MESSAGES.MAIN_MENU(user) });
      return;
    }

    // Panduan Perintah Grup WA (/telco, /tanya, /ask)
    if (lowerText === '/telco' || lowerText === '/tanya' || lowerText === '/ask') {
      const isEnglish = user.preferred_language === 'en';
      const guideText = isEnglish
        ? `📡 *TelcoLearn WhatsApp Group Assistant*\nHow to use in WhatsApp groups:\n\n• *!telco [question]* — Ask any 4G/5G radio protocol, drive test, or networking question\n• *!top* — View continuous study streak leaderboard 🏆\n• *!quiz* — 60-Second brain teaser challenge 🌙\n• *!espresso* — 30-Second quick field tip ☕\n• *!pmp* — Telecom Project Management bite 📋\n• Or tag/mention *@${myPnRaw}* with your query!`
        : `📡 *TelcoLearn WhatsApp Group Assistant*\nCara menggunakan bot di grup:\n\n• *!telco [pertanyaan]* — Tanya konsep radio 4G/5G, KPI drivetest, atau networking\n• *!top* — Lihat papan peringkat streak komunitas 🏆\n• *!kuis* — Tantangan kuis 60 detik 🌙\n• *!espresso* — Tips teknis lapangan 30 detik ☕\n• *!pmp* — Studi kasus Telecom Project Management 📋\n• Atau mention *@${myPnRaw}* langsung dengan pertanyaan Anda!`;
      await reply({ text: `${guideText}${isGroup ? '' : getLoopbackFooter(user)}` });
      return;
    }

    // Reset Topik Diskusi Manual (/clear, /topikbaru, /newtopic, /cleartopic)
    if (['/clear', '/topikbaru', '/newtopic', '/cleartopic', '/reset-topik', '/topik-baru'].includes(lowerText)) {
      clearLlmConversation(user.id);
      updateUserState(user.jid, 'IDLE', null);
      await reply({
        text: `🧹 *Topik Diskusi Berhasil Direset!*\nRiwayat percakapan sebelumnya telah dibersihkan.\n\nSilakan ajukan pertanyaan atau topik baru Anda!${getLoopbackFooter(user)}`
      });
      return;
    }

    // Deteksi permintaan ganti bahasa alami di tengah percakapan
    const isNaturalEnglishSwitch = /\b(switch\s*to\s*english|change\s*(language\s*)?to\s*english|speak\s*in?\s*english|in\s*english\s*please|use\s*english|english\s*please|can\s*we\s*use\s*english|ganti\s*ke\s*bahasa\s*inggris|pake\s*bahasa\s*inggris)\b/i.test(lowerText);
    const isNaturalIndonesianSwitch = /\b(ganti\s*(bahasa\s*)?ke\s*indonesia|switch\s*to\s*indonesian?|speak\s*in?\s*indonesian?|pakai\s*bahasa\s*indonesia|bahasa\s*indonesia\s*aja|bahasa\s*indonesia\s*dong)\b/i.test(lowerText);

    if (isNaturalEnglishSwitch) {
      updateUserPreferences(user.jid, { preferred_language: 'en' });
      user.preferred_language = 'en';
      await reply({
        text: `🌐 *Language updated to English 🇬🇧.*\nAll future menus, lessons, quizzes, and responses will be delivered in English.\n_(Type */lang id* anytime to switch back to Bahasa Indonesia)_${getLoopbackFooter('en')}`
      });
      return;
    }

    if (isNaturalIndonesianSwitch) {
      updateUserPreferences(user.jid, { preferred_language: 'id' });
      user.preferred_language = 'id';
      await reply({
        text: `🌐 *Bahasa dialihkan ke Bahasa Indonesia 🇮🇩.*\nSeluruh menu, modul belajar, kuis, dan jawaban selanjutnya akan disajikan dalam Bahasa Indonesia.\n_(Ketik */lang en* kapan saja untuk beralih ke Bahasa Inggris)_${getLoopbackFooter('id')}`
      });
      return;
    }

    // Ganti Bahasa Bot (/lang, /bahasa, /language)
    if (lowerText === '/lang' || lowerText.startsWith('/lang ') || lowerText === '/bahasa' || lowerText.startsWith('/bahasa ') || lowerText === '/language' || lowerText.startsWith('/language ')) {
      const arg = lowerText.replace(/^\/(lang|bahasa|language)\s*/i, '').trim();
      if (['en', 'english', 'inggris', '2'].includes(arg)) {
        updateUserPreferences(user.jid, { preferred_language: 'en' });
        user.preferred_language = 'en';
        await reply({
          text: `🌐 *Language updated to English 🇬🇧.*
All future menus, quizzes, and automated reminders will be delivered in English.
_(Type */lang id* anytime to switch back to Bahasa Indonesia)_${getLoopbackFooter(user)}`
        });
        return;
      } else if (['id', 'indonesia', 'indo', 'bahasa', '1'].includes(arg)) {
        updateUserPreferences(user.jid, { preferred_language: 'id' });
        user.preferred_language = 'id';
        await reply({
          text: `🌐 *Bahasa diubah ke Bahasa Indonesia 🇮🇩.*
Menu, materi, dan pengingat harian Anda akan disajikan dalam Bahasa Indonesia.
_(Ketik */lang en* kapan saja untuk beralih ke Bahasa Inggris)_${getLoopbackFooter(user)}`
        });
        return;
      } else {
        await reply({
          text: `🌐 *PENGATURAN BAHASA / LANGUAGE SETTINGS*

Silakan pilih bahasa yang Anda inginkan / Choose your language:
1️⃣ *Bahasa Indonesia* 🇮🇩 (Ketik */lang id*)
2️⃣ *English* 🇬🇧 (Type */lang en*)

Current language: *${user.preferred_language === 'en' ? 'English 🇬🇧' : 'Bahasa Indonesia 🇮🇩'}*${getLoopbackFooter(user)}`
        });
        return;
      }
    }

    if (lowerText === '/track' || lowerText.startsWith('/track ')) {
      const arg = lowerText.replace('/track', '').trim();
      const isEnglishUser = user.preferred_language === 'en';
      if (FOCUS_TRACKS[arg]) {
        const selected = FOCUS_TRACKS[arg];
        updateUserPreferences(user.jid, { focus_track: selected.key });
        user.focus_track = selected.key;
        const ack = isEnglishUser
          ? `✅ *Your study track has been updated to:* ${selected.label}${getLoopbackFooter(user)}`
          : `✅ *Jalur fokus belajar Anda diubah menjadi:* ${selected.label}${getLoopbackFooter(user)}`;
        await reply({ text: ack });
      } else {
        const prompt = isEnglishUser
          ? `🎯 *SELECT STUDY TRACK:*\n\n1️⃣ 4G/5G Protocol QA\n2️⃣ Field & Drive Test\n3️⃣ ML Telco Testing\n4️⃣ Log Analysis\n5️⃣ Telecom Project Management (PMP)\n\n_Type */track 1*, */track 2*, */track 3*, */track 4*, or */track 5*_${getLoopbackFooter(user)}`
          : `🎯 *PILIH JALUR FOKUS BELAJAR:*\n\n1️⃣ 4G/5G Protocol QA\n2️⃣ Field & Drive Test\n3️⃣ ML Telco Testing\n4️⃣ Log Analysis\n5️⃣ Telecom Project Management (PMP)\n\n_Ketik */track 1*, */track 2*, */track 3*, */track 4*, atau */track 5*_${getLoopbackFooter(user)}`;
        await reply({ text: prompt });
      }
      return;
    }

    if (lowerText === '/jadwal' || lowerText.startsWith('/jadwal ') || lowerText === '/schedule' || lowerText.startsWith('/schedule ')) {
      const rawArg = lowerText.replace(/^\/(jadwal|schedule)\s*/i, '').trim();
      const isEnglishUser = user.preferred_language === 'en';
      let arg = rawArg;
      if (['off', 'none', 'stop', 'mati', 'nonaktif'].includes(rawArg)) {
        arg = '4';
      }
      if (REMINDER_PREFERENCES[arg]) {
        const selected = REMINDER_PREFERENCES[arg];
        updateUserPreferences(user.jid, { reminder_preference: selected.key });
        user.reminder_preference = selected.key;
        const ack = isEnglishUser
          ? `✅ *Your daily notification schedule is set to:* ${selected.label}${getLoopbackFooter(user)}`
          : `✅ *Jadwal notifikasi Anda diubah menjadi:* ${selected.label}${getLoopbackFooter(user)}`;
        await reply({ text: ack });
      } else {
        const prompt = isEnglishUser
          ? `⏰ *CHOOSE DAILY REMINDER SCHEDULE:*\n\n1️⃣ Morning (07:30 WIB)\n2️⃣ Afternoon (12:30 WIB)\n3️⃣ All (Morning, Afternoon, Night)\n4️⃣ Turn Off / Unsubscribe 🔕\n\n_Type */schedule 1*, */schedule 2*, */schedule 3*, or */schedule 4*_${getLoopbackFooter(user)}`
          : `⏰ *PILIH JADWAL NOTIFIKASI HARIAN:*\n\n1️⃣ Pagi (07:30 WIB)\n2️⃣ Siang (12:30 WIB)\n3️⃣ Lengkap (Pagi, Siang, Malam)\n4️⃣ Nonaktifkan / Berhenti Berlangganan 🔕\n\n_Ketik */jadwal 1*, */jadwal 2*, */jadwal 3*, atau */jadwal 4*_${getLoopbackFooter(user)}`;
        await reply({ text: prompt });
      }
      return;
    }

    // Command /unsubscribe, /stop, /berhenti
    if (lowerText === '/stop' || lowerText === 'stop' || lowerText === '/unsubscribe' || lowerText === 'unsubscribe' || lowerText === '/berhenti' || lowerText === 'berhenti') {
      updateUserPreferences(user.jid, { reminder_preference: 'off' });
      updateUserState(user.jid, 'IDLE', null);
      user.reminder_preference = 'off';
      const isEnglishUser = user.preferred_language === 'en';
      const ack = isEnglishUser
        ? `🔕 *Automatic Notifications Disabled (Unsubscribed)*\n\nYou will no longer receive scheduled daily module broadcasts or streak reminders.\n\nYou can still access TelcoLearn anytime on-demand:\n• Type */learn* for self-paced modules\n• Type */quiz* for quiz challenges\n• Or ask any telecom question / paste logs directly.\n\n_Type */schedule* anytime to reactivate daily notifications._${getLoopbackFooter(user)}`
        : `🔕 *Notifikasi Otomatis Dinonaktifkan (Berhenti Berlangganan)*\n\nAnda tidak akan menerima broadcast materi harian atau pengingat streak otomatis lagi.\n\nAnda tetap dapat menggunakan TelcoLearn secara mandiri kapan saja:\n• Ketik */belajar* untuk membaca modul\n• Ketik */quiz* untuk kuis interaktif\n• Atau langsung tanyakan konsep telekomunikasi / tempel log sinyal.\n\n_Ketik */jadwal* kapan saja untuk mengaktifkan kembali notifikasi harian._${getLoopbackFooter(user)}`;
      await reply({ text: ack });
      return;
    }

    // Shortcut 1 -> /belajar atau /learn
    if (lowerText === '/belajar' || lowerText === 'belajar' || lowerText === '/learn' || lowerText === 'learn' || lowerText === '1') {
      const isEnglishUser = user.preferred_language === 'en';
      const nextModule = getNextModuleForUser(user.id);
      if (!nextModule) {
        await reply({ text: `${MESSAGES.NO_MORE_MODULES(user)}${getLoopbackFooter(user)}` });
        return;
      }

      markModuleProgress(user.id, nextModule.id, 'SENT');
      touchUserActivity(user.jid);
      updateUserState(user.jid, 'IDLE', { last_module_id: nextModule.id });
      let moduleBody = (isEnglishUser && nextModule.wa_text_body_en) ? nextModule.wa_text_body_en : nextModule.wa_text_body;
      if (nextModule.is_repeat) {
        const reviewNotice = isEnglishUser
          ? `🔄 *[Curriculum Review / Material Loop]*\n_You have completed all modules in your track! Reviewing lessons from the beginning to reinforce your mastery:_\n\n`
          : `🔄 *[Review / Pengulangan Kurikulum]*\n_Anda telah menyelesaikan seluruh modul di track ini! Mengulang pembahasan dari awal untuk memperkuat pemahaman Anda:_\n\n`;
        moduleBody = reviewNotice + moduleBody;
      }
      await reply({ text: `${moduleBody}${getLoopbackFooter(user)}` });
      return;
    }

    // Shortcut 2 -> /quiz
    if (lowerText === '/quiz' || lowerText === 'quiz' || lowerText === '/kuis' || lowerText === 'kuis' || lowerText === '2') {
      let preferredModuleId = null;
      try {
        const payload = JSON.parse(user.state_payload || '{}');
        preferredModuleId = payload.last_module_id || null;
      } catch (e) {}

      const quiz = getNextQuizForUser(user.id, preferredModuleId);
      if (!quiz) {
        await reply({
          text: `Belum ada kuis yang tersedia untuk modul ini. Ketik */belajar* (atau *1*) untuk melanjutkan materi.${getLoopbackFooter(user)}`
        });
        return;
      }

      const isEnglishUser = user.preferred_language === 'en';
      updateUserState(user.jid, 'AWAITING_QUIZ_ANSWER', { active_quiz_id: quiz.id });
      const qText = (isEnglishUser && quiz.question_en) ? quiz.question_en : quiz.question;
      const optA = (isEnglishUser && quiz.option_a_en) ? quiz.option_a_en : quiz.option_a;
      const optB = (isEnglishUser && quiz.option_b_en) ? quiz.option_b_en : quiz.option_b;
      const optC = (isEnglishUser && quiz.option_c_en) ? quiz.option_c_en : quiz.option_c;
      const optD = (isEnglishUser && quiz.option_d_en) ? quiz.option_d_en : quiz.option_d;

      const quizPrompt = isEnglishUser
        ? `🌙 *60-Second Quiz Time! (Your Streak: 🔥 ${user.streak_count || 0} Days)*\n\n❓ *Question:*\n${qText}\n\nA. ${optA}\nB. ${optB}\nC. ${optC}\nD. ${optD}\n\n_(Reply with letter A, B, C, or D. Type *0* or */cancel* to return to main menu)_`
        : `🌙 *Waktunya Kuis 60 Detik! (Streak Anda: 🔥 ${user.streak_count || 0} Hari)*\n\n❓ *Pertanyaan:*\n${qText}\n\nA. ${optA}\nB. ${optB}\nC. ${optC}\nD. ${optD}\n\n_(Balas dengan huruf A, B, C, atau D. Ketik *0* atau */batal* untuk kembali ke menu utama)_`;

      await reply({ text: quizPrompt });
      return;
    }

    // Shortcut 3 -> /streak
    if (lowerText === '/streak' || lowerText === 'streak' || lowerText === '3') {
      const isEnglishUser = user.preferred_language === 'en';
      const db = getDb();
      const completedModules = db.prepare("SELECT COUNT(*) as count FROM user_module_progress WHERE user_id = ? AND status = 'COMPLETED'").get(user.id).count;
      const totalQuizzes = db.prepare('SELECT COUNT(*) as count FROM quiz_logs WHERE user_id = ? AND is_correct = 1').get(user.id).count;

      const streakText = isEnglishUser
        ? `🔥 *STUDY CONSISTENCY & METRICS*\nHello, *${user.display_name}*!\n\n• *Current Streak:* 🔥 *${user.streak_count || 0} Consecutive Days*\n• *Last Active:* ${user.last_active_date || 'Today'}\n• *Quizzes Answered Correctly:* 🎯 ${totalQuizzes} Questions\n• *Modules Completed:* 📚 ${completedModules} Modules\n\nKeep your streak alive by taking daily quizzes! Type */quiz* (or *2*) now. 🚀${getLoopbackFooter(user)}`
        : `🔥 *KONSISTENSI & STATISTIK BELAJAR*\nHalo, *${user.display_name}*!\n\n• *Current Streak:* 🔥 *${user.streak_count || 0} Hari Berturut-turut*\n• *Terakhir Aktif:* ${user.last_active_date || 'Hari ini'}\n• *Kuis Terjawab Benar:* 🎯 ${totalQuizzes} Soal\n• *Modul Diselesaikan:* 📚 ${completedModules} Modul\n\nPertahankan streak Anda dengan menjawab kuis harian! Ketik */quiz* (atau *2*) sekarang. 🚀${getLoopbackFooter(user)}`;
      await reply({ text: streakText });
      return;
    }

    if (lowerText.startsWith('/catat') || lowerText.startsWith('/note')) {
      const noteBody = rawText.replace(/^\/(catat|note)\s*/i, '').trim();
      if (!noteBody) {
        updateUserState(user.jid, 'AWAITING_CUSTOM_NOTE', null);
        await reply({
          text: `📝 *Tuliskan Catatan Anda*\nKirimkan teks rangkuman materi atau catatan log yang ingin Anda simpan sekarang:\n\n_(Ketik *0* atau */batal* untuk batal)_`
        });
        return;
      }
      saveUserNote(user.id, 'Catatan Cepat', noteBody, 'note');
      await reply({
        text: `📝 *Catatan Berhasil Disimpan!*\n\n_"${noteBody}"_${getLoopbackFooter(user)}`
      });
      return;
    }

    if (lowerText === '/notes') {
      const notes = getUserNotes(user.id);
      if (notes.length === 0) {
        await reply({ text: `Belum ada catatan yang tersimpan. Gunakan perintah */catat [isi]* untuk menyimpan catatan.${getLoopbackFooter(user)}` });
        return;
      }
      const noteList = notes.map((n, idx) => `${idx + 1}. *${n.title}* (${n.created_at})\n   "${n.note_body}"`).join('\n\n');
      await reply({ text: `📋 *Daftar Catatan Anda:*\n\n${noteList}${getLoopbackFooter(user)}` });
      return;
    }

    if (lowerText === '/batal' || lowerText === '/cancel' || lowerText === 'batal' || lowerText === 'cancel') {
      updateUserState(user.jid, 'IDLE', null);
      await reply({ text: `❌ *Aktivitas dibatalkan.* Kembali ke menu utama:\n\n${MESSAGES.MAIN_MENU(user)}` });
      return;
    }

    // Shortcut 4 -> /profil atau /profile
    if (lowerText === '/profil' || lowerText === 'profil' || lowerText === '/profile' || lowerText === 'profile' || lowerText === '4') {
      const isEnglishUser = user.preferred_language === 'en';
      const trackName = FOCUS_TRACKS[Object.keys(FOCUS_TRACKS).find(k => FOCUS_TRACKS[k].key === user.focus_track)]?.label || user.focus_track;
      const prefName = REMINDER_PREFERENCES[Object.keys(REMINDER_PREFERENCES).find(k => REMINDER_PREFERENCES[k].key === user.reminder_preference)]?.label || user.reminder_preference;
      const langLabel = user.preferred_language === 'en' ? 'English 🇬🇧' : 'Bahasa Indonesia 🇮🇩';

      const profileText = isEnglishUser
        ? `👤 *USER PROFILE*
• Name: *${user.display_name}*
• Phone: *${user.phone_number}*
• Language: *${langLabel}*
• Focus Track: *${trackName}*
• Notification: *${prefName}*
• Streak: *🔥 ${user.streak_count || 0} Days*

Type */lang id* to switch to Indonesian or */reset* to restart setup from scratch.${getLoopbackFooter(user)}`
        : `👤 *PROFIL PENGGUNA*
• Nama: *${user.display_name}*
• Nomor: *${user.phone_number}*
• Bahasa: *${langLabel}*
• Jalur Fokus: *${trackName}*
• Jadwal Notifikasi: *${prefName}*
• Streak: *🔥 ${user.streak_count || 0} Hari*

Ketik */lang en* untuk beralih ke Bahasa Inggris atau */reset* untuk mengatur ulang preferensi dari awal.${getLoopbackFooter(user)}`;
      await reply({ text: profileText });
      return;
    }

    // Shortcut 5 -> /bantuan atau /help
    if (lowerText === '/bantuan' || lowerText === '/help' || lowerText === 'bantuan' || lowerText === 'help' || lowerText === '5') {
      await reply({ text: `${MESSAGES.HELP(user)}${getLoopbackFooter(user)}` });
      return;
    }

    // Reset Topik Diskusi Percakapan (/clear, /topik_baru, atau 'topik baru')
    const isClearTopicCmd = /^\/?(clear|cleartopic|topik_baru|topik baru|reset_topik|reset topik|new_topic|new topic)$/i.test(lowerText.trim());
    if (isClearTopicCmd) {
      clearLlmConversation(user.id);
      await reply({
        text: `🧹 *Konteks Diskusi Berhasil Direset!*\n\nRiwayat percakapan sebelumnya telah dibersihkan. Anda sekarang dapat menanyakan topik baru secara mandiri tanpa terpengaruh riwayat diskusi sebelumnya.\n\n_Silakan ketik pertanyaan atau topik telekomunikasi yang ingin Anda bahas!_${getLoopbackFooter(user)}`
      });
      return;
    }

    // Shortcut 6 -> /masukan /feedback /saran (mendukung dengan atau tanpa tanda garis miring '/' dan titik dua ':')
    const isFeedbackCmd = (
      lowerText === '6' ||
      /^\/?(masukan|feedback|saran)([\s:]|$)/i.test(lowerText)
    );

    if (isFeedbackCmd) {
      const inlineFeedback = rawText
        .replace(/^\/?(masukan|feedback|saran)[:\s-]*/i, '')
        .trim();

      const isEnglishUser = user.preferred_language === 'en';
      if (!inlineFeedback || lowerText === '6') {
        updateUserState(user.jid, 'AWAITING_USER_FEEDBACK', null);
        const prompt = isEnglishUser
          ? `💡 *FEEDBACK & SUGGESTIONS FORM*\n\nHave ideas for new 3GPP/5G/ML topics, feature suggestions, or encountered an issue with the bot?\n\nPlease *type your feedback message* now and send it to this chat.\n\n_(Type *0* or */cancel* to cancel)_`
          : `💡 *FORM MASUKAN & SARAN PENGEMBANGAN*\n\nPunya usulan topik 3GPP/5G/ML baru, ide fitur tambahan, atau menemukan kendala pada bot?\n\nSilakan *tuliskan pesan masukan Anda* sekarang dan kirimkan ke chat ini.\n\n_(Ketik *0* atau */batal* untuk membatalkan)_`;
        await reply({ text: prompt });
        return;
      }

      const fbId = await saveUserFeedback({
        feedbackText: inlineFeedback,
        category: 'general'
      });

      const ack = isEnglishUser
        ? `🙏 *Thank You for Your Feedback!*\n\nYour suggestion has been recorded in the TelcoLearn development system (Ticket *#${fbId || 'NEW'}*):\n_"${inlineFeedback}"_\n\nYour ideas are invaluable for adding future features and curriculum! 🚀${getLoopbackFooter(user)}`
        : `🙏 *Terima Kasih Banyak atas Masukan Anda!*\n\nSaran Anda telah berhasil dicatat ke sistem pengembangan TelcoLearn (Tiket *#${fbId || 'BARU'}*):\n_"${inlineFeedback}"_\n\nIde dan masukan Anda sangat berharga untuk penambahan fitur dan kurikulum selanjutnya! 🚀${getLoopbackFooter(user)}`;
      await reply({ text: ack });
      return;
    }

    // Shortcut 7 -> /top atau /leaderboard atau /peringkat
    if (lowerText === '/top' || lowerText === 'top' || lowerText === '/leaderboard' || lowerText === 'leaderboard' || lowerText === '/peringkat' || lowerText === 'peringkat' || lowerText === '7') {
      const topUsers = getTopStreakUsers(10);
      const userRank = getUserLeaderboardRank(user.id);
      const leaderboardText = formatLeaderboard(topUsers, userRank, user.preferred_language);
      await reply({ text: `${leaderboardText}${isGroup ? '' : getLoopbackFooter(user)}` });
      return;
    }

    // Shortcut 8 -> /tantang atau /challenge (Viral Challenge Card)
    if (lowerText === '/tantang' || lowerText === 'tantang' || lowerText === '/challenge' || lowerText === 'challenge' || lowerText === '8') {
      const isEnglishUser = user.preferred_language === 'en';
      let preferredModuleId = null;
      try {
        const payload = JSON.parse(user.state_payload || '{}');
        preferredModuleId = payload.last_module_id || null;
      } catch (e) {}

      const quiz = getNextQuizForUser(user.id, preferredModuleId);
      if (!quiz) {
        await reply({
          text: isEnglishUser
            ? `No quiz available to challenge yet.${getLoopbackFooter(user)}`
            : `Belum ada kuis yang tersedia untuk dijadikan tantangan.${getLoopbackFooter(user)}`
        });
        return;
      }

      const challengeCard = formatChallengeMessage(quiz, user, myPnRaw, user.preferred_language);
      await reply({ text: `${challengeCard}${isGroup ? '' : getLoopbackFooter(user)}` });
      return;
    }

    // Shortcut 9 -> /espresso atau /tip (30-detik Field Tip)
    if (lowerText === '/espresso' || lowerText === 'espresso' || lowerText === '/tip' || lowerText === 'tip' || lowerText === '9') {
      const tipText = getRandomEspressoTip(user.preferred_language);
      touchUserActivity(user.jid);
      await reply({ text: `${tipText}${isGroup ? '' : getLoopbackFooter(user)}` });
      return;
    }

    // Shortcut /trivia -> Telco Trivia dari Q&A DB
    if (lowerText === '/trivia' || lowerText === 'trivia' || lowerText === '!trivia') {
      const triviaText = getRandomTrivia(null, user.preferred_language);
      touchUserActivity(user.jid);
      if (triviaText) {
        await reply({ text: `${triviaText}${isGroup ? '' : getLoopbackFooter(user)}` });
      } else {
        const fallback = user.preferred_language === 'en'
          ? "💡 *No trivia available right now.* Type */quiz* to challenge yourself!"
          : "💡 *Trivia belum tersedia saat ini.* Ketik */quiz* untuk kuis interaktif!";
        await reply({ text: `${fallback}${isGroup ? '' : getLoopbackFooter(user)}` });
      }
      return;
    }

    // Shortcut /pmp -> Micro-Learning Telecom Project Management
    if (lowerText === '/pmp' || lowerText === 'pmp') {
      const isEnglishUser = user.preferred_language === 'en';
      const db = getDb();
      const pmpModule = db.prepare(`
        SELECT m.* FROM modules m
        WHERE m.module_code LIKE 'MOD-PMP%'
          AND m.id NOT IN (
            SELECT module_id FROM user_module_progress 
            WHERE user_id = ? AND status = 'COMPLETED'
          )
        ORDER BY m.module_order ASC
        LIMIT 1
      `).get(user.id) || db.prepare("SELECT * FROM modules WHERE module_code LIKE 'MOD-PMP%' ORDER BY module_order ASC LIMIT 1").get();

      if (pmpModule) {
        markModuleProgress(user.id, pmpModule.id, 'SENT');
        touchUserActivity(user.jid);
        updateUserState(user.jid, 'IDLE', { last_module_id: pmpModule.id });
        const body = (isEnglishUser && pmpModule.wa_text_body_en) ? pmpModule.wa_text_body_en : pmpModule.wa_text_body;
        await reply({ text: `${body}${isGroup ? '' : getLoopbackFooter(user)}` });
        return;
      }
    }

    // 6.4. SIMULASI & DIAGRAM VISUAL (/simulasi, /gambar, /visualisasi, atau permintaan teks natural)
    const isSimulationTrigger = (
      /^(\/(simulasi|gambar|visualisasi|diagram|grafik)\b|.*?\b(buat(kan)?|bikin|minta|tampilkan|perlihatkan|generate)\s*(gambar|simulasi|diagram|grafik|kurva|visualisasi)|.*?\b(gambarkan|simulasikan|visualisasikan)\b|.*?\b(ada|bisa)\s*(minta|buat(kan)?|lihat|tampilkan)?\s*(gambar|simulasi|diagram|grafik))/i.test(rawText)
    );

    if (isSimulationTrigger) {
      const customPrompt = rawText
        .replace(/^\/(simulasi|gambar|visualisasi|diagram|grafik)\s*/i, '')
        .replace(/\b(tolong|bisa|coba|dong|ya|kan|kah)?\s*(buat(kan)?|bikin|minta|tampilkan|perlihatkan|generate)?\s*(gambar(nya)?|simulasi(nya)?|visualisasi(nya)?|diagram(nya)?|grafik(nya)?)\s*(dong|ya|kan|ini|kasus ini|dari jawaban tadi|dari pertanyaan tadi)?\b/gi, '')
        .trim();

      await reply({
        text: `🎨 *Merancang simulasi visual...*\nMemproses kalkulasi RF & merender diagram teknis via AI...`
      });

      try {
        const simResult = await generateTelcoSimulation(user.id, customPrompt);
        if (simResult && simResult.image) {
          await reply({
            image: simResult.image,
            caption: `${simResult.caption}${getLoopbackFooter(user)}`
          });
        } else {
          await reply({
            text: `⚠️ Maaf, belum dapat merender gambar simulasi untuk topik ini saat ini.${getLoopbackFooter(user)}`
          });
        }
      } catch (simErr) {
        console.error('❌ Gagal menghasilkan simulasi visual:', simErr);
        await reply({
          text: `⚠️ Terjadi kendala saat merender simulasi: ${simErr.message}${getLoopbackFooter(user)}`
        });
      }
      return;
    }

    // 6.5. ADMIN TOKEN DASHBOARD & REPORT (Khusus Admin Pribadi / Self-Chat)
    const isAdminCommand = (
      lowerText === '/admin' || lowerText.startsWith('/admin') ||
      lowerText === 'admin' || lowerText.startsWith('admin ') ||
      lowerText === '/stats' || lowerText === '/db' || lowerText === '/database' ||
      /^\/?(masukan_list|list_masukan|feedback_list|list_feedback|daftar_masukan|daftar masukan|list masukan)\b/i.test(lowerText)
    );

    if (isAdminCommand) {
      const configuredAdmins = [
        process.env.ADMIN_PHONE_NUMBER,
        process.env.BOT_PHONE_NUMBER,
        '817090934764'
      ].filter(Boolean).flatMap(p => p.split(',')).map(p => p.replace(/\D/g, '').trim()).filter(Boolean);

      const isSenderAdmin = isSelfChat || configuredAdmins.some(adminNum => {
        return (
          phoneNumber === adminNum ||
          cleanSenderPhone === adminNum ||
          user?.phone_number === adminNum ||
          senderJid.startsWith(adminNum) ||
          senderJid.includes(adminNum)
        );
      });

      if (!isSenderAdmin) {
        await reply({ text: '⛔ Perintah ini khusus untuk Administrator TelcoLearn.' });
        return;
      }

      // SUB-COMMAND: Admin Melihat Daftar Masukan Pengguna (/admin feedback, /admin masukan, /masukan_list, list masukan)
      if (
        lowerText.includes('feedback') || lowerText.includes('masukan') || lowerText.includes('saran') ||
        /^\/?(masukan_list|list_masukan|feedback_list|list_feedback|daftar_masukan|daftar masukan|list masukan)\b/i.test(lowerText)
      ) {
        const limitMatch = rawText.match(/\b\d+\b/);
        const limit = limitMatch ? parseInt(limitMatch[0], 10) : 10;
        const feedbacks = await getAllFeedbacks({ limit });
        const fbMetrics = await getFeedbackMetrics();

        if (feedbacks.length === 0) {
          await reply({
            text: `📬 *DAFTAR MASUKAN PENGGUNA (FEEDBACK)*\n\nBelum ada masukan yang tercatat dari pengguna di database.\n\n_💡 Pengguna dapat mengirim saran melalui perintah */masukan [isi]*._\n\nKetik */admin* untuk kembali ke dashboard utama.`
          });
          return;
        }

        const fbListText = feedbacks.map((f, idx) => {
          const dateStr = new Date(f.created_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
          const statusBadge = f.status === 'PENDING' ? '⏳ PENDING' : f.status === 'REVIEWED' ? '👀 REVIEWED' : '✅ SELESAI';
          return `*${idx + 1}. [#${f.id}]* _${dateStr}_\n📝 *Masukan:* "${f.feedback_text}"\n🏷️ *Status:* ${statusBadge}`;
        }).join('\n\n');

        const header = `📬 *DAFTAR MASUKAN PENGGUNA (FEEDBACK)*\nTotal: *${fbMetrics.total} Masukan* (⏳ *${fbMetrics.pending} Pending*)\nMenampilkan ${feedbacks.length} masukan terbaru:\n━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        const footer = `\n\n━━━━━━━━━━━━━━━━━━━━━━━━\n💡 _Ketik */admin* untuk dashboard utama, atau */masukan_list 20* untuk melihat lebih banyak._`;

        await reply({ text: header + fbListText + footer });
        return;
      }

      const metrics = getDailyTokenMetrics();
      const cacheStats = await getCacheMetrics();
      const reportText = formatWhatsAppAdminReport(metrics, cacheStats);

      if (lowerText.includes('email') || lowerText.includes('report') || lowerText.includes('kirim')) {
        await reply({ text: `${reportText}\n\n⏳ Mengirim salinan dashboard HTML ke email *arya.nugroho.works1@gmail.com*...` });
        const emailRes = await sendDailyEmailReport();
        if (emailRes.sentViaEmail) {
          await reply({ text: `✅ *Laporan Berhasil Terkirim ke Email!*\nID: ${emailRes.messageId}` });
        } else {
          await reply({ text: `ℹ️ Laporan HTML tersimpan di server lokal (SMTP belum aktif di .env):\n_${emailRes.localFile}_` });
        }
      } else {
        await reply({ text: `${reportText}\n\n_💡 Ketik */admin report* untuk mengirim salinan dashboard ke email pribadi Anda._` });
      }
      return;
    }

    // 7. HEURISTIC LOG DETECTOR (Gemini 3 Flash Cognitive Engine)
    if (detectTelcoLogPattern(rawText)) {
      const activeLang = trackAndAdaptUserLanguage(user, rawText);
      const isEnglish = activeLang === 'en';
      const triageMsg = isEnglish
        ? `🔍 *Radio protocol log snippet detected.* Analyzing RCA via AI Cognitive Engine...`
        : `🔍 *Terdeteksi potongan log protokol radio.* Menganalisis RCA via AI Cognitive Engine...`;
      await reply({
        text: triageMsg
      });
      touchUserActivity(user.jid);
      const analysis = await analyzeTelcoLog(rawText, user.id, activeLang);
      await reply({ text: `${analysis}${getLoopbackFooter(user)}` });
      return;
    }

    // 8. DETEKSI PERTANYAAN KONTEKS DRIVETEST (Jika fokus pengguna saat ini bukan Drive Test)
    if (isDriveTestInquiry(rawText) && user.focus_track !== 'drive_test') {
      const activeLang = detectQueryLanguage(rawText, user.preferred_language || 'id');
      const isEnglish = activeLang === 'en';
      console.log(`🚙 [Drivetest Detection] Terdeteksi pertanyaan bernuansa drivetest dari user track "${user.focus_track}". Mengirim konfirmasi.`);
      updateUserState(user.jid, 'AWAITING_DRIVETEST_CONFIRM', { pending_question: rawText });
      const dtPrompt = isEnglish
        ? `🤔 Your question indicates field testing or drive testing.\n*Is this related to Drive Testing?*\n\n_(Reply *Yes* or *No*, or type *0* to return to main menu)_`
        : `🤔 Pertanyaan Anda terindikasi seputar pengujian lapangan.\n*Apakah ini konteksnya Drivetest?*\n\n_(Balas *Ya* atau *Tidak*, atau ketik *0* untuk kembali ke menu)_`;
      await reply({
        text: dtPrompt
      });
      return;
    }

    // 8.5. TIER-1 LOCAL PRE-FILTER: TOPIK DI LUAR LINGKUP TELCO & NETWORKING (Hemat Token LLM)
    if (isObviousNonTelcoQuery(rawText)) {
      console.log(`🛡️ [Out-of-Scope Pre-Filter] Menolak pertanyaan non-telco dari user ${user.jid}: "${rawText}"`);
      const isEnglish = user.preferred_language === 'en';
      const refusalMsg = isEnglish ? MESSAGES.OUT_OF_SCOPE_EN : MESSAGES.OUT_OF_SCOPE;
      await reply({ text: `${refusalMsg}${getLoopbackFooter(user)}` });
      return;
    }

    // 8.6. BOT IDENTITY FAST-PATH ("What are you?", "Who are you?", "Kamu itu siapa?", "Perkenalkan anda", dll.)
    const identityRegex = /\b(who\s*(are|r)\s*(you|u)|what\s*(are|r)\s*(you|u)|what\s*is\s*(this\s*bot|telcolearn)|what\s*can\s*you\s*do|tell\s*me\s*about\s*yourself|introduce\s*yourself|who\s*made\s*you|kamu\s*(itu)?\s*siapa|siapa\s*(sih)?\s*(kamu|anda)|anda\s*(itu)?\s*siapa|siapakah\s*(kamu|anda)|perkenal(kan)?(\s*(diri|anda|kamu))?|kenalan(\s*dong)?|bot\s*apa\s*(ini|sih)|ini\s*bot\s*apa|apa\s*ini|apa\s*itu\s*telcolearn|tentang\s*bot|tentang\s*telcolearn|bisa\s*apa\s*aja|fitur\s*bot)\b/i;
    const cleanPrompt = lowerText.replace(/[?!.,]/g, '').trim();
    if (identityRegex.test(cleanPrompt)) {
      const activeLang = trackAndAdaptUserLanguage(user, rawText);
      const isEnglish = activeLang === 'en';
      const identityReply = isEnglish
        ? `👋 *I am TelcoLearn Bot!*
An AI Study Assistant & Technical Diagnostic Mentor specialized in *Telecommunications, 4G/5G Wireless Protocols, and Computer Networking*.

🎯 *What I can do for you:*
1️⃣ *4G/5G Radio Protocol QA*: Explaining RRC, NAS, Call Flow, Handover, and 3GPP Rel-15 to Rel-18.
2️⃣ *Field & Drive Testing*: RF KPIs (RSRP, SINR, BLER), troubleshooting coverage holes & interference.
3️⃣ *Modem Log RCA*: Diagnosing Qualcomm QXDM, Shannon, and Wireshark PCAP logs.
4️⃣ *ML Telco Testing*: Anomaly detection, KPI forecasting, and modem crash triage.

💡 *Quick Navigation:*
• Type *1* (or */belajar*) for daily micro-learning modules.
• Type *2* (or */quiz*) for 60-second quiz challenges.
• Type *0* (or */menu*) to open the main menu.
• Or simply paste your radio logs or ask any technical wireless/networking questions!`
        : `👋 *Saya adalah TelcoLearn Bot!*
Asisten AI & Mentor Diagnostik Teknis spesialis *Telekomunikasi, Protokol Radio 4G/5G, dan Jaringan Komputer (Networking)*.

🎯 *Yang dapat saya bantu:*
1️⃣ *4G/5G Protocol QA*: Menjelaskan call flow, RRC, NAS, Handover, dan konsep 3GPP Rel-15 s/d Rel-18.
2️⃣ *Field & Drive Testing*: Analisis KPI RF (RSRP, SINR, BLER), masalah coverage, dan tilt antena.
3️⃣ *Modem Log RCA*: Mendiagnosis cuplikan log QXDM, Shannon, dan Wireshark PCAP.
4️⃣ *ML Telco Testing*: Deteksi anomali KPI dan pemanfaatan machine learning untuk testing modem.

💡 *Navigasi Cepat:*
• Ketik *1* (atau */belajar*) untuk membaca modul harian.
• Ketik *2* (atau */quiz*) untuk tantangan kuis harian.
• Ketik *0* (atau */menu*) untuk membuka menu utama.
• Atau langsung tanyakan konsep jaringan/telco apa saja ke sini!`;

      if (user.id && Number(user.id) > 0) {
        logLlmConversation(user.id, rawText, identityReply, 50);
      }
      await reply({ text: `${identityReply}${getLoopbackFooter(user)}` });
      return;
    }

    // 9. TANYA JAWAB BEBAS TELEKOMUNIKASI (Gemini AI Assistant & ShareTechNote RAG)
    if (rawText.trim().length >= 3) {
      const activeLang = trackAndAdaptUserLanguage(user, rawText);
      // 9.1 Pengecekan Disjoint Topic Shift & Pertanyaan Balik Interaktif
      const maxHistory = parseInt(process.env.MAX_CONVERSATION_HISTORY || '3', 10);
      const sessionTimeoutMinutes = parseInt(process.env.CONVERSATION_SESSION_TIMEOUT_MINUTES || '20', 10);
      const recentHistory = getRecentLlmConversation(user.id, maxHistory, sessionTimeoutMinutes);

      if (recentHistory && recentHistory.length > 0) {
        const contextEval = evaluateConversationContext(rawText, recentHistory);
        if (contextEval.needsConfirmation) {
          const lastTopic = contextEval.lastTopic || recentHistory[recentHistory.length - 1]?.incoming_query || 'Topik sebelumnya';
          const truncatedLastTopic = lastTopic.length > 70 ? lastTopic.slice(0, 67) + '...' : lastTopic;
          const truncatedCurrent = rawText.length > 70 ? rawText.slice(0, 67) + '...' : rawText;

          updateUserState(user.jid, 'AWAITING_TOPIC_CONFIRM', {
            pending_question: rawText,
            last_topic: lastTopic
          });

          const isEnglishActive = activeLang === 'en';
          const confirmMsg = isEnglishActive
            ? `🤔 *Discussion Topic Confirmation*
Previous discussion was regarding:
👉 _"${truncatedLastTopic}"_

Your current question:
👉 _"${truncatedCurrent}"_

Is this a *New Topic* or *Still Related* to the previous discussion?

1️⃣ *New Topic* (Start fresh without prior history)
2️⃣ *Still Related* (Continue follow-up from prior discussion)

_(Reply *1* for new topic, or *2* if still related)_`
            : `🤔 *Konfirmasi Topik Diskusi*
Pembahasan sebelumnya mengenai:
👉 _"${truncatedLastTopic}"_

Pertanyaan Anda saat ini:
👉 _"${truncatedCurrent}"_

Apakah ini *Topik Baru* atau *Masih Terkait* dengan pembahasan sebelumnya?

1️⃣ *Topik Baru* (Mulai pembahasan baru tanpa riwayat sebelumnya)
2️⃣ *Masih Terkait* (Lanjutan pembahasan studi kasus tadi)

_(Balas *1* untuk topik baru, atau *2* jika masih terkait)_`;

          await reply({ text: confirmMsg });
          return;
        }
      }

      touchUserActivity(user.jid);
      const answer = await answerGeneralTelcoQuestion(rawText, user.id, {
        contextTrack: user.focus_track,
        preferredLanguage: activeLang
      });
      await reply({ text: `${answer}${getLoopbackFooter(user)}` });
      return;
    }

    // Default fallback
    await reply({ text: MESSAGES.MAIN_MENU(user) });

  } catch (error) {
    console.error('❌ Error handling incoming message:', error);
  }
}
