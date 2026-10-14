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
  updateUserStreak,
  getNextModuleForUser,
  markModuleProgress,
  getNextQuizForUser,
  getQuizById,
  recordQuizLog,
  saveUserNote,
  getUserNotes,
  getDailyTokenMetrics,
  getDb
} = db;

// Safe fallbacks to prevent crash if an older db.js is cached by Docker/volume
const saveUserFeedback = db.saveUserFeedback || (() => null);
const getAllFeedbacks = db.getAllFeedbacks || (() => []);
const getFeedbackMetrics = db.getFeedbackMetrics || (() => ({ total: 0, pending: 0 }));
const updateFeedbackStatus = db.updateFeedbackStatus || (() => null);
const clearLlmConversation = db.clearLlmConversation || (() => false);

import {
  MESSAGES,
  FOCUS_TRACKS,
  REMINDER_PREFERENCES,
  detectTelcoLogPattern,
  isDriveTestInquiry,
  isObviousNonTelcoQuery
} from '../config/constants.js';
import { analyzeTelcoLog, answerGeneralTelcoQuestion, analyzeTelcoImage, analyzeTelcoDocument } from './geminiService.js';
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
export async function sendReply(sock, jid, content) {
  try {
    // Tampilkan typing bubble sebentar agar terasa interaktif
    await sock.sendPresenceUpdate('composing', jid).catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 800));
    await sock.sendPresenceUpdate('paused', jid).catch(() => {});
  } catch (e) {}

  console.log(`📤 [Outbound Send] Mengirim balasan ke ${jid}...`);
  const sent = await sock.sendMessage(jid, content);
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

    // 1. STRICTLY IGNORE GROUP CHATS, BROADCASTS, CHANNELS/NEWSLETTERS
    if (senderJid.endsWith('@g.us') || senderJid.includes('@g.us') || msg.key.participant) return;
    if (senderJid.endsWith('@newsletter') || senderJid.includes('@newsletter')) return;
    if (senderJid === 'status@broadcast' || senderJid.endsWith('@broadcast')) return;

    const rawText = extractMessageText(msg.message);
    const hasImage = Boolean(msg.message?.imageMessage);
    const documentMsg = msg.message?.documentMessage || msg.message?.documentWithCaptionMessage?.message?.documentMessage;
    const hasDocument = Boolean(documentMsg);

    if (!rawText && !hasImage && !hasDocument) return;

    // Resolusi identitas pengirim (LID & Phone mapping persis ai-reception-zeroweb)
    const identity = await resolveSenderIdentity(msg, sock);
    const cleanSenderPhone = identity.resolvedPhone || (senderJid.includes('@lid') ? '' : identity.phone);
    const cleanSenderLid = identity.lid;

    const myPnRaw = (sock?.user?.id || '').split(':')[0].replace(/\D/g, '');
    const myLidRaw = (sock?.authState?.creds?.me?.lid || '').split(':')[0].replace(/\D/g, '');
    const myPn = myPnRaw ? `${myPnRaw}@s.whatsapp.net` : null;
    const myLid = myLidRaw ? `${myLidRaw}@lid` : null;

    // Deteksi obrolan dengan diri sendiri (Message Yourself)
    const isTargetingSelf = Boolean(
      (myLid && (senderJid === myLid || (cleanSenderLid && cleanSenderLid === myLidRaw))) ||
      (myPn && (senderJid === myPn || (cleanSenderPhone && cleanSenderPhone === myPnRaw)))
    );

    // KRUSIAL ANTI-LOOP: Jika msg.key.fromMe = true TETAPI BUKAN obrolan ke bot sendiri,
    // maka ini adalah pesan keluar yang dikirim ke kontak/user lain (misal materi scheduler atau balasan bot).
    // JANGAN PERNAH diproses sebagai pesan masuk agar tidak terjadi feedback loop/burst overload!
    if (msg.key?.fromMe && !isTargetingSelf) {
      return;
    }

    const isSelfChat = isTargetingSelf;

    // Tentukan JID balasan:
    // Jika self-chat, kirim ke nomor HP (@s.whatsapp.net).
    // Jika pesan orang lain, balas langsung ke senderJid asli (persis ai-reception-zeroweb)
    const replyJid = isSelfChat ? myPn : senderJid;
    const phoneNumber = isSelfChat ? myPn.replace(/\D/g, '') : (cleanSenderPhone || cleanSenderLid || senderJid.replace(/\D/g, ''));
    const pushName = msg.pushName || (isSelfChat ? 'Admin TelcoLearn' : 'Pelajar Telco');

    const mediaLabel = hasImage ? '[GAMBAR]' : (hasDocument ? `[DOKUMEN: ${documentMsg.fileName || 'file'}]` : '');
    console.log(`📩 [Inbound] Pesan dari ${senderJid} (Route ke: ${replyJid}, SelfChat: ${isSelfChat}): ${mediaLabel} "${rawText}"`);

    const reply = (content) => sendReply(sock, replyJid, content);

    // 1. Ambil atau Buat User di SQLite
    const userDbKey = isSelfChat ? myPn : (cleanSenderPhone ? `${cleanSenderPhone}@s.whatsapp.net` : senderJid);
    let user = getUserByJid(userDbKey) || getUserByJid(senderJid);
    const lowerText = rawText.toLowerCase().trim();
    const isGreeting = ['halo', 'hi', 'hello', 'hai', 'p', 'tes', 'test', 'start', '/start', 'mulai'].some(g => lowerText === g || lowerText.startsWith(g + ' ') || lowerText.startsWith(g + '!'));
    const isFreeInquiry = rawText.trim().length > 3 && !isGreeting && !['0', '1', '2', '3', '4', '5'].includes(rawText.trim());
    const isMediaInquiry = hasImage || hasDocument;

    if (!user) {
      user = createUser({
        jid: userDbKey,
        phone_number: phoneNumber,
        display_name: pushName,
        current_state: (isSelfChat || isFreeInquiry || isMediaInquiry) ? 'IDLE' : 'ONBOARDING_TRACK',
        focus_track: 'protocol_qa',
        reminder_preference: 'all'
      });
      console.log(`👋 [User Baru] Terdaftar: ${userDbKey} (State: ${user.current_state})`);
      if (!isSelfChat && !isFreeInquiry && !isMediaInquiry) {
        await reply({ text: MESSAGES.WELCOME_ONBOARDING });
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
          await reply({ text: `⚠️ Gagal mengunduh gambar WhatsApp. Silakan kirimkan kembali.${LOOPBACK_FOOTER}` });
          return;
        }

        const visionAnalysis = await analyzeTelcoImage(buffer, mimeType, caption, user.id);
        await reply({ text: `${visionAnalysis}${LOOPBACK_FOOTER}` });
      } catch (mediaErr) {
        console.error('❌ Gagal memproses gambar:', mediaErr);
        await reply({ text: `⚠️ Maaf, terjadi kendala saat mengunduh atau menganalisis gambar. Silakan coba kembali.${LOOPBACK_FOOTER}` });
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
          await reply({ text: `⚠️ Gagal mengunduh dokumen WhatsApp. Silakan kirimkan kembali.${LOOPBACK_FOOTER}` });
          return;
        }

        const docAnalysis = await analyzeTelcoDocument(buffer, fileName, mimeType, caption, user.id);
        await reply({ text: `${docAnalysis}${LOOPBACK_FOOTER}` });
      } catch (mediaErr) {
        console.error('❌ Gagal memproses dokumen:', mediaErr);
        await reply({ text: `⚠️ Maaf, terjadi kendala saat mengunduh atau membaca dokumen log. Silakan coba kembali.${LOOPBACK_FOOTER}` });
      }
      return;
    }

    const currentState = user.current_state || 'IDLE';

    // 2. GREETING & ONBOARDING INITIAL TRIGGER
    // Ketika pengguna mengirimkan halo atau pesan pembuka, kirim onboarding menu preferensi
    if (isGreeting) {
      console.log(`👋 [Greeting] Pengguna ${user.jid} mengirimkan salam "${rawText}". Mengarahkan ke ONBOARDING_TRACK.`);
      updateUserState(user.jid, 'ONBOARDING_TRACK', null);
      await reply({ text: MESSAGES.WELCOME_ONBOARDING });
      return;
    }

    // Reset command darurat kapan saja
    if (lowerText === '/reset') {
      updateUserState(user.jid, 'ONBOARDING_TRACK', null);
      await reply({ text: MESSAGES.WELCOME_ONBOARDING });
      return;
    }

    // 3. STATE: ONBOARDING_TRACK (Memilih 1, 2, 3, atau 4)
    if (currentState === 'ONBOARDING_TRACK') {
      const choice = rawText.trim();
      if (['1', '2', '3', '4'].includes(choice)) {
        const selected = FOCUS_TRACKS[choice];
        updateUserPreferences(user.jid, { focus_track: selected.key });
        updateUserState(user.jid, 'IDLE', null);
        const ackMsg = `🎯 *Fokus Belajar Anda Diatur ke:* *${selected.label}*

Pembahasan dan materi Anda sekarang difokuskan ke *${selected.label}*.

Silakan langsung:
• Bertanya bebas seputar topik ini (misal: call flow, RSRP/SINR, log modem, dll.)
• Ketik *1* (atau */belajar*) untuk membaca modul harian
• Ketik *2* (atau */quiz*) untuk latihan kuis interaktif
• Ketik *0* (atau */menu*) untuk membuka menu navigasi utama${LOOPBACK_FOOTER}`;
        await reply({ text: ackMsg });
        return;
      } else if (['0', '/menu', 'menu', 'kembali'].includes(choice)) {
        updateUserState(user.jid, 'IDLE', null);
        await reply({ text: MESSAGES.MAIN_MENU(user) });
        return;
      } else if (choice.length === 1 && ['5', '6', '7', '8', '9'].includes(choice)) {
        await reply({
          text: `⚠️ Mohon ketik angka *1*, *2*, *3*, atau *4* untuk memilih fokus belajar:\n\n1️⃣ 4G/5G Protocol QA\n2️⃣ Field & Drive Test\n3️⃣ ML Telco Testing\n4️⃣ Log Analysis\n\n_(Atau ketik *0* untuk langsung ke menu utama)_`
        });
        return;
      } else {
        // User langsung mengetik pertanyaan teknis bebas / slash command:
        // Auto-complete onboarding ke IDLE agar tidak memblokir user
        console.log(`⏩ [Auto-Bypass Onboarding] User ${user.jid} mengirim "${rawText}", auto-complete onboarding ke IDLE.`);
        updateUserPreferences(user.jid, { focus_track: 'protocol_qa', reminder_preference: 'all' });
        updateUserState(user.jid, 'IDLE', null);
        user = getUserByJid(user.jid); // Muat ulang objek user
      }
    }

    // 4. STATE: AWAITING_DRIVETEST_CONFIRM (Konfirmasi apakah konteksnya Drivetest)
    if (currentState === 'AWAITING_DRIVETEST_CONFIRM') {
      if (['0', '/menu', 'menu', 'kembali', 'home', '/batal', 'batal'].includes(lowerText)) {
        updateUserState(user.jid, 'IDLE', null);
        await reply({ text: `❌ *Konfirmasi dibatalkan.* Kembali ke menu utama:\n\n${MESSAGES.MAIN_MENU(user)}` });
        return;
      }

      let pendingQuestion = '';
      try {
        const payload = JSON.parse(user.state_payload || '{}');
        pendingQuestion = payload.pending_question || '';
      } catch (e) {}

      if (!pendingQuestion) {
        updateUserState(user.jid, 'IDLE', null);
        await reply({ text: `Sesi konfirmasi kedaluwarsa. Silakan ajukan pertanyaan Anda kembali.${LOOPBACK_FOOTER}` });
        return;
      }

      const yesRegex = /^(ya|yes|y|iya|betul|benar|yup|yo|drivetest|drive test|ok|oke)$/i;
      const noRegex = /^(tidak|no|n|bukan|ga|gak|bkn|ngga|nggak|bukan drivetest)$/i;

      if (yesRegex.test(lowerText)) {
        updateUserState(user.jid, 'IDLE', null);
        await reply({ text: `👍 *Baik, pertanyaan Anda dijawab dalam konteks Field & Drive Test 🚙:*` });
        const answer = await answerGeneralTelcoQuestion(pendingQuestion, user.id, { contextTrack: 'drive_test' });
        await reply({ text: `${answer}${LOOPBACK_FOOTER}` });
        return;
      } else if (noRegex.test(lowerText)) {
        updateUserState(user.jid, 'IDLE', null);
        const trackLabel = FOCUS_TRACKS[Object.keys(FOCUS_TRACKS).find(k => FOCUS_TRACKS[k].key === user.focus_track)]?.label || 'Protocol QA';
        await reply({ text: `👍 *Baik, pertanyaan Anda dijawab dalam konteks ${trackLabel}:*` });
        const answer = await answerGeneralTelcoQuestion(pendingQuestion, user.id, { contextTrack: user.focus_track });
        await reply({ text: `${answer}${LOOPBACK_FOOTER}` });
        return;
      } else {
        if (lowerText.startsWith('/')) {
          updateUserState(user.jid, 'IDLE', null);
          // Lanjut ke handler slash command di bawah
        } else {
          await reply({
            text: `⚠️ Mohon konfirmasi dengan menjawab *Ya* atau *Tidak*:\n\n*Apakah ini konteksnya Drivetest?*\n_"${pendingQuestion}"_\n\n_(Ketik *0* untuk kembali ke menu utama)_`
          });
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

      if (!activeQuizId) {
        updateUserState(user.jid, 'IDLE', null);
        await reply({ text: `Sesi kuis kedaluwarsa. Ketik */quiz* (atau *2*) untuk kuis baru.${LOOPBACK_FOOTER}` });
        return;
      }

      const quiz = getQuizById(activeQuizId);
      if (!quiz) {
        updateUserState(user.jid, 'IDLE', null);
        await reply({ text: `Kuis tidak ditemukan. Ketik */quiz* (atau *2*) untuk kuis baru.${LOOPBACK_FOOTER}` });
        return;
      }

      if (lowerText === '/batal' || lowerText === '/cancel' || lowerText === 'batal' || lowerText === 'cancel' || lowerText === '0' || lowerText === '/menu' || lowerText === 'menu' || lowerText === 'kembali') {
        updateUserState(user.jid, 'IDLE', null);
        await reply({ text: `❌ *Kuis dibatalkan.* Kembali ke menu utama:\n\n${MESSAGES.MAIN_MENU(user)}` });
        return;
      }

      // Normalisasi jawaban: konversi 1,2,3,4 ke A,B,C,D jika user mengetik angka
      const numberToLetter = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
      const selectedOption = (numberToLetter[lowerText] || lowerText).toUpperCase();

      if (!['A', 'B', 'C', 'D'].includes(selectedOption)) {
        await reply({
          text: `⚠️ Mohon jawab dengan pilihan huruf *A*, *B*, *C*, atau *D*! (atau ketik *0* / */batal* untuk kembali ke menu utama)`
        });
        return;
      }

      const isCorrect = selectedOption === quiz.correct_option.toUpperCase();
      recordQuizLog(user.id, quiz.id, selectedOption, isCorrect);
      const newStreak = updateUserStreak(user.jid, isCorrect);
      updateUserState(user.jid, 'IDLE', null);

      if (isCorrect) {
        const responseText = `🎉 *Tepat Sekali! (Jawaban ${quiz.correct_option})*

📊 *Penjelasan Teknis:*
${quiz.explanation}

🏆 *Streak Anda bertambah:* *🔥 ${newStreak} Hari Belajar Berturut-turut!*

Ketik */belajar* (atau *1*) untuk materi selanjutnya atau */quiz* (atau *2*) untuk tantangan berikutnya!${LOOPBACK_FOOTER}`;
        await reply({ text: responseText });
      } else {
        const responseText = `❌ *Jawaban Kurang Tepat!*
Jawaban yang benar adalah *${quiz.correct_option}*.

📊 *Penjelasan Teknis:*
${quiz.explanation}

💪 Jangan patah semangat! Rekor streak Anda saat ini: *🔥 ${user.streak_count || 0} Hari*.
Ketik */quiz* (atau *2*) untuk melatih topik lain!${LOOPBACK_FOOTER}`;
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
        text: `📝 *Catatan Berhasil Disimpan!*\n\n_"${rawText}"_${LOOPBACK_FOOTER}`
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
        text: `🙏 *Terima Kasih Banyak atas Masukan Anda!*\n\nSaran Anda telah berhasil dicatat ke sistem pengembangan TelcoLearn (Tiket *#${fbId || 'BARU'}*):\n_"${rawText}"_\n\nIde dan masukan Anda sangat berharga untuk penambahan fitur dan kurikulum selanjutnya. Tetap semangat belajar! 🚀${LOOPBACK_FOOTER}`
      });
      return;
    }

    // 6. SLASH COMMANDS & SHORTCUTS (State IDLE)
    // 0 / Menu Utama
    if (lowerText === '/menu' || lowerText === 'menu' || lowerText === '0' || lowerText === 'kembali' || lowerText === 'home' || lowerText === 'main menu') {
      await reply({ text: MESSAGES.MAIN_MENU(user) });
      return;
    }

    if (lowerText === '/track' || lowerText.startsWith('/track ')) {
      const arg = lowerText.replace('/track', '').trim();
      if (FOCUS_TRACKS[arg]) {
        const selected = FOCUS_TRACKS[arg];
        updateUserPreferences(user.jid, { focus_track: selected.key });
        await reply({ text: `✅ *Jalur fokus belajar Anda diubah menjadi:* ${selected.label}${LOOPBACK_FOOTER}` });
      } else {
        await reply({
          text: `🎯 *PILIH JALUR FOKUS BELAJAR:*\n\n1️⃣ 4G/5G Protocol QA\n2️⃣ Field & Drive Test\n3️⃣ ML Telco Testing\n4️⃣ Log Analysis\n\n_Ketik */track 1*, */track 2*, */track 3*, atau */track 4*_${LOOPBACK_FOOTER}`
        });
      }
      return;
    }

    if (lowerText === '/jadwal' || lowerText.startsWith('/jadwal ')) {
      const arg = lowerText.replace('/jadwal', '').trim();
      if (REMINDER_PREFERENCES[arg]) {
        const selected = REMINDER_PREFERENCES[arg];
        updateUserPreferences(user.jid, { reminder_preference: selected.key });
        await reply({ text: `✅ *Jadwal notifikasi Anda diubah menjadi:* ${selected.label}${LOOPBACK_FOOTER}` });
      } else {
        await reply({
          text: `⏰ *PILIH JADWAL NOTIFIKASI HARIAN:*\n\n1️⃣ Pagi (07:30 WIB)\n2️⃣ Siang (12:30 WIB)\n3️⃣ Lengkap (Pagi, Siang, Malam)\n\n_Ketik */jadwal 1*, */jadwal 2*, atau */jadwal 3*_${LOOPBACK_FOOTER}`
        });
      }
      return;
    }

    // Shortcut 1 -> /belajar
    if (lowerText === '/belajar' || lowerText === 'belajar' || lowerText === '1') {
      const nextModule = getNextModuleForUser(user.id);
      if (!nextModule) {
        await reply({ text: `${MESSAGES.NO_MORE_MODULES}${LOOPBACK_FOOTER}` });
        return;
      }

      markModuleProgress(user.id, nextModule.id, 'SENT');
      updateUserState(user.jid, 'IDLE', { last_module_id: nextModule.id });
      await reply({ text: `${nextModule.wa_text_body}${LOOPBACK_FOOTER}` });
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
          text: `Belum ada kuis yang tersedia untuk modul ini. Ketik */belajar* (atau *1*) untuk melanjutkan materi.${LOOPBACK_FOOTER}`
        });
        return;
      }

      updateUserState(user.jid, 'AWAITING_QUIZ_ANSWER', { active_quiz_id: quiz.id });
      const quizPrompt = `🌙 *Waktunya Kuis 60 Detik! (Streak Anda: 🔥 ${user.streak_count || 0} Hari)*

❓ *Pertanyaan:*
${quiz.question}

A. ${quiz.option_a}
B. ${quiz.option_b}
C. ${quiz.option_c}
D. ${quiz.option_d}

_(Balas dengan huruf A, B, C, atau D. Ketik *0* atau */batal* untuk kembali ke menu utama)_`;

      await reply({ text: quizPrompt });
      return;
    }

    // Shortcut 3 -> /streak
    if (lowerText === '/streak' || lowerText === 'streak' || lowerText === '3') {
      const db = getDb();
      const completedModules = db.prepare("SELECT COUNT(*) as count FROM user_module_progress WHERE user_id = ? AND status = 'COMPLETED'").get(user.id).count;
      const totalQuizzes = db.prepare('SELECT COUNT(*) as count FROM quiz_logs WHERE user_id = ? AND is_correct = 1').get(user.id).count;

      const streakText = `🔥 *KONSISTENSI & STATISTIK BELAJAR*
Halo, *${user.display_name}*!

• *Current Streak:* 🔥 *${user.streak_count || 0} Hari Berturut-turut*
• *Terakhir Aktif:* ${user.last_active_date || 'Hari ini'}
• *Kuis Terjawab Benar:* 🎯 ${totalQuizzes} Soal
• *Modul Diselesaikan:* 📚 ${completedModules} Modul

Pertahankan streak Anda dengan menjawab kuis harian! Ketik */quiz* (atau *2*) sekarang. 🚀${LOOPBACK_FOOTER}`;
      await reply({ text: streakText });
      return;
    }

    if (lowerText.startsWith('/catat')) {
      const noteBody = rawText.replace(/^\/catat\s*/i, '').trim();
      if (!noteBody) {
        updateUserState(user.jid, 'AWAITING_CUSTOM_NOTE', null);
        await reply({
          text: `📝 *Tuliskan Catatan Anda*\nKirimkan teks rangkuman materi atau catatan log yang ingin Anda simpan sekarang:\n\n_(Ketik *0* atau */batal* untuk batal)_`
        });
        return;
      }
      saveUserNote(user.id, 'Catatan Cepat', noteBody, 'note');
      await reply({
        text: `📝 *Catatan Berhasil Disimpan!*\n\n_"${noteBody}"_${LOOPBACK_FOOTER}`
      });
      return;
    }

    if (lowerText === '/notes') {
      const notes = getUserNotes(user.id);
      if (notes.length === 0) {
        await reply({ text: `Belum ada catatan yang tersimpan. Gunakan perintah */catat [isi]* untuk menyimpan catatan.${LOOPBACK_FOOTER}` });
        return;
      }
      const noteList = notes.map((n, idx) => `${idx + 1}. *${n.title}* (${n.created_at})\n   "${n.note_body}"`).join('\n\n');
      await reply({ text: `📋 *Daftar Catatan Anda:*\n\n${noteList}${LOOPBACK_FOOTER}` });
      return;
    }

    if (lowerText === '/batal' || lowerText === '/cancel' || lowerText === 'batal' || lowerText === 'cancel') {
      updateUserState(user.jid, 'IDLE', null);
      await reply({ text: `❌ *Aktivitas dibatalkan.* Kembali ke menu utama:\n\n${MESSAGES.MAIN_MENU(user)}` });
      return;
    }

    // Shortcut 4 -> /profil
    if (lowerText === '/profil' || lowerText === 'profil' || lowerText === '/profile' || lowerText === 'profile' || lowerText === '4') {
      const trackName = FOCUS_TRACKS[Object.keys(FOCUS_TRACKS).find(k => FOCUS_TRACKS[k].key === user.focus_track)]?.label || user.focus_track;
      const prefName = REMINDER_PREFERENCES[Object.keys(REMINDER_PREFERENCES).find(k => REMINDER_PREFERENCES[k].key === user.reminder_preference)]?.label || user.reminder_preference;

      const profileText = `👤 *PROFIL PENGGUNA*
• Nama: *${user.display_name}*
• Nomor: *${user.phone_number}*
• Jalur Fokus: *${trackName}*
• Jadwal Notifikasi: *${prefName}*
• Streak: *🔥 ${user.streak_count || 0} Hari*

Ketik */reset* jika ingin mengubah alur preferensi belajar dari awal.${LOOPBACK_FOOTER}`;
      await reply({ text: profileText });
      return;
    }

    // Shortcut 5 -> /bantuan
    if (lowerText === '/bantuan' || lowerText === '/help' || lowerText === 'bantuan' || lowerText === 'help' || lowerText === '5') {
      await reply({ text: `${MESSAGES.HELP}${LOOPBACK_FOOTER}` });
      return;
    }

    // Reset Topik Diskusi Percakapan (/clear, /topik_baru, atau 'topik baru')
    const isClearTopicCmd = /^\/?(clear|cleartopic|topik_baru|topik baru|reset_topik|reset topik|new_topic|new topic)$/i.test(lowerText.trim());
    if (isClearTopicCmd) {
      clearLlmConversation(user.id);
      await reply({
        text: `🧹 *Konteks Diskusi Berhasil Direset!*\n\nRiwayat percakapan sebelumnya telah dibersihkan. Anda sekarang dapat menanyakan topik baru secara mandiri tanpa terpengaruh riwayat diskusi sebelumnya.\n\n_Silakan ketik pertanyaan atau topik telekomunikasi yang ingin Anda bahas!_${LOOPBACK_FOOTER}`
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

      if (!inlineFeedback || lowerText === '6') {
        updateUserState(user.jid, 'AWAITING_USER_FEEDBACK', null);
        await reply({
          text: `💡 *FORM MASUKAN & SARAN PENGEMBANGAN*\n\nPunya usulan topik 3GPP/5G/ML baru, ide fitur tambahan, atau menemukan kendala pada bot?\n\nSilakan *tuliskan pesan masukan Anda* sekarang dan kirimkan ke chat ini.\n\n_(Ketik *0* atau */batal* untuk membatalkan)_`
        });
        return;
      }

      const fbId = await saveUserFeedback({
        feedbackText: inlineFeedback,
        category: 'general'
      });

      await reply({
        text: `🙏 *Terima Kasih Banyak atas Masukan Anda!*\n\nSaran Anda telah berhasil dicatat ke sistem pengembangan TelcoLearn (Tiket *#${fbId || 'BARU'}*):\n_"${inlineFeedback}"_\n\nIde dan masukan Anda sangat berharga untuk penambahan fitur dan kurikulum selanjutnya! 🚀${LOOPBACK_FOOTER}`
      });
      return;
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
            caption: `${simResult.caption}${LOOPBACK_FOOTER}`
          });
        } else {
          await reply({
            text: `⚠️ Maaf, belum dapat merender gambar simulasi untuk topik ini saat ini.${LOOPBACK_FOOTER}`
          });
        }
      } catch (simErr) {
        console.error('❌ Gagal menghasilkan simulasi visual:', simErr);
        await reply({
          text: `⚠️ Terjadi kendala saat merender simulasi: ${simErr.message}${LOOPBACK_FOOTER}`
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
      await reply({
        text: `🔍 *Terdeteksi potongan log protokol radio.* Menganalisis RCA via AI Cognitive Engine...`
      });
      const analysis = await analyzeTelcoLog(rawText, user.id);
      await reply({ text: `${analysis}${LOOPBACK_FOOTER}` });
      return;
    }

    // 8. DETEKSI PERTANYAAN KONTEKS DRIVETEST (Jika fokus pengguna saat ini bukan Drive Test)
    if (isDriveTestInquiry(rawText) && user.focus_track !== 'drive_test') {
      console.log(`🚙 [Drivetest Detection] Terdeteksi pertanyaan bernuansa drivetest dari user track "${user.focus_track}". Mengirim konfirmasi.`);
      updateUserState(user.jid, 'AWAITING_DRIVETEST_CONFIRM', { pending_question: rawText });
      await reply({
        text: `🤔 Pertanyaan Anda terindikasi seputar pengujian lapangan.\n*Apakah ini konteksnya Drivetest?*\n\n_(Balas *Ya* atau *Tidak*, atau ketik *0* untuk kembali ke menu)_`
      });
      return;
    }

    // 8.5. TIER-1 LOCAL PRE-FILTER: TOPIK DI LUAR LINGKUP TELCO & NETWORKING (Hemat Token LLM)
    if (isObviousNonTelcoQuery(rawText)) {
      console.log(`🛡️ [Out-of-Scope Pre-Filter] Menolak pertanyaan non-telco dari user ${user.jid}: "${rawText}"`);
      const isEnglish = /\b(how|what|why|who|when|where|which|can|recipe|cook|weather|president|love|movie|song)\b/i.test(rawText);
      const refusalMsg = isEnglish ? MESSAGES.OUT_OF_SCOPE_EN : MESSAGES.OUT_OF_SCOPE;
      await reply({ text: `${refusalMsg}${LOOPBACK_FOOTER}` });
      return;
    }

    // 8.6. BOT IDENTITY FAST-PATH ("What are you?", "Who are you?", "Kamu itu siapa?", "Perkenalkan anda", dll.)
    const identityRegex = /\b(who\s*(are|r)\s*(you|u)|what\s*(are|r)\s*(you|u)|what\s*is\s*(this\s*bot|telcolearn)|what\s*can\s*you\s*do|tell\s*me\s*about\s*yourself|introduce\s*yourself|who\s*made\s*you|kamu\s*(itu)?\s*siapa|siapa\s*(sih)?\s*(kamu|anda)|anda\s*(itu)?\s*siapa|siapakah\s*(kamu|anda)|perkenal(kan)?(\s*(diri|anda|kamu))?|kenalan(\s*dong)?|bot\s*apa\s*(ini|sih)|ini\s*bot\s*apa|apa\s*ini|apa\s*itu\s*telcolearn|tentang\s*bot|tentang\s*telcolearn|bisa\s*apa\s*aja|fitur\s*bot)\b/i;
    const cleanPrompt = lowerText.replace(/[?!.,]/g, '').trim();
    if (identityRegex.test(cleanPrompt)) {
      const isEnglish = /\b(who|what|tell me|made you|can you|are you|introduce)\b/i.test(cleanPrompt);
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

      await reply({ text: `${identityReply}${LOOPBACK_FOOTER}` });
      return;
    }

    // 9. TANYA JAWAB BEBAS TELEKOMUNIKASI (Gemini AI Assistant & ShareTechNote RAG)
    if (rawText.trim().length >= 3) {
      const answer = await answerGeneralTelcoQuestion(rawText, user.id, { contextTrack: user.focus_track });
      await reply({ text: `${answer}${LOOPBACK_FOOTER}` });
      return;
    }

    // Default fallback
    await reply({ text: MESSAGES.MAIN_MENU(user) });

  } catch (error) {
    console.error('❌ Error handling incoming message:', error);
  }
}
