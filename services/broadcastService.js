/**
 * TelcoLearn Serial One-Time Broadcast Service (Anti-Spam & Anti-Ban Protected)
 * Mengirimkan pesan pengumuman/pemulihan ke pengguna secara serial dan aman.
 *
 * Fitur Keamanan WhatsApp Anti-Ban:
 * 1. Pengiriman murni serial (1 per 1 pesan, non-paralel)
 * 2. Delay acak dinamis (jitter 8-15 detik antar pesan)
 * 3. Human Presence Simulator (composing/mengetik sebelum kirim)
 * 4. Pacing jeda istirahat (batch pause 35 detik setiap 10 pesan)
 * 5. Unique SHA-256 fingerprint (invisible zero-width salt)
 * 6. Checkpoint state persistence (resume aman jika server restart / koneksi drop)
 * 7. Socket guardrail (langsung jeda jika koneksi WhatsApp terputus)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb } from '../database/db.js';
import { 
  sendSafeScheduled, 
  simulateHumanPresence, 
  randomizeMessageContent,
  isCooldownActive 
} from './antiBanService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATE_FILE_PATH = path.join(__dirname, '..', 'broadcast_state.json');

const DEFAULT_CAMPAIGN_ID = 'outage_recovery_update_20261030';

let isRunning = false;
let shouldPause = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Daftar Preset Pesan Broadcast Standar
 */
export const PRESET_TEMPLATES = {
  apology_recovery: {
    id: 'apology_recovery',
    label: '1. Permohonan Maaf & Update Kebijakan 14 Hari (Default)',
    text_id: `Halo, *{name}*! 👋

Sebelumnya, tim TelcoLearn memohon maaf yang sebesar-besarnya jika beberapa waktu lalu pesan atau pertanyaan Anda sempat tidak terbalas oleh bot karena adanya pemeliharaan dan kendala koneksi pada server. 🙏

Kabar baiknya, kini *TelcoLearn Engine telah kembali normal, aktif, dan berjalan dengan sistem koneksi yang jauh lebih stabil!* 🚀

Berikut beberapa pembaruan penting untuk kenyamanan belajar Anda:
1️⃣ *Pengingat Belajar Harian Ramah Anti-Spam:*
Pengingat materi tetap terjadwal untuk Anda. Untuk menjaga kenyamanan chat Anda, pengingat harian kini hanya akan dikirimkan kepada rekan engineer yang aktif dalam 14 hari terakhir. Jika 14 hari tidak ada interaksi, pengingat akan otomatis dijeda secara damai.

2️⃣ *Pilihan Fleksibel:*
• Ingin lanjut materi hari ini? Cukup balas *1* (atau */lanjut*).
• Ingin jeda atau berhenti menerima jadwal harian? Balas */stop*.
• Ingin kuis 60 detik? Balas */quiz*.

Fitur konsultasi AI teknis (tanya teori 3GPP 4G/5G, analisis log pcap/qxdm, dan tips lapangan) tetap bisa Anda gunakan secara mandiri kapan saja.

Terima kasih banyak atas dukungan dan kesabaran rekan-rekan engineer! Selamat kembali belajar bersama TelcoLearn. 📡✨`,
    text_en: `Hello, *{name}*! 👋

First of all, our sincere apologies if some of your messages or questions went unanswered recently due to unexpected server connection maintenance. 🙏

We are glad to inform you that *TelcoLearn Engine is now fully restored, active, and running on a much more resilient connection!* 🚀

Here are key updates designed for a better learning experience:
1️⃣ *Clutter-Free Daily Reminders:*
Your daily micro-learning schedule remains active. To keep your inbox clean and prevent spam, scheduled reminders will now only be sent to engineers active within the last 14 days. If there is no activity for 14 days, reminders will automatically pause.

2️⃣ *Flexible Controls:*
• Want today's lesson? Simply reply *1* (or */learn*).
• Want to pause daily reminders? Reply */stop*.
• Want a 60-second quiz challenge? Reply */quiz*.

On-demand AI technical inquiries (3GPP 4G/5G concepts, log analysis, and field tips) remain available 24/7.

Thank you very much for your patience and support! Happy learning with TelcoLearn. 📡✨`
  },

  new_modules: {
    id: 'new_modules',
    label: '2. Pengumuman Modul / Kurikulum Baru',
    text_id: `Halo, *{name}*! 📚✨

Ada kabar gembira dari kurikulum TelcoLearn! Modul studi baru seputar optimasi jaringan 5G NR dan analisis radio log telah ditambahkan ke sistem.

Yuk tingkatkan kompetensi telekomunikasi Anda hari ini:
👉 Balas *1* untuk langsung mengambil modul terbaru
👉 Balas *2* untuk mencoba kuis evaluasi 60 detik
👉 Balas *0* untuk melihat daftar topik lengkap

Selamat belajar dan raih streak konsistensi terbaik Anda! 🚀`,
    text_en: `Hello, *{name}*! 📚✨

Exciting news from TelcoLearn! New micro-learning curriculum modules covering 5G NR optimization and protocol log analytics are now live.

Boost your telecom engineering skills today:
👉 Reply *1* to fetch the latest lesson
👉 Reply *2* to take a 60-second challenge
👉 Reply *0* to browse all tracks

Happy learning and keep your streak alive! 🚀`
  },

  quiz_challenge: {
    id: 'quiz_challenge',
    label: '3. Tantangan Kuis & Streak Belajar',
    text_id: `Halo, *{name}*! 🔥🎯

Sudahkah Anda menguji pemahaman telekomunikasi hari ini?
Papan peringkat (leaderboard) TelcoLearn sedang berlangsung ketat!

Yuk luangkan waktu 60 detik untuk menjawab kuis radio/core hari ini:
👉 Balas *2* (atau */quiz*) untuk mulai kuis sekarang
👉 Balas *8* untuk menantang rekan engineer di grup Anda

Jaga streak konsistensi belajar Anda sebelum tengah malam! 🚀`,
    text_en: `Hello, *{name}*! 🔥🎯

Have you tested your telecom knowledge today?
The TelcoLearn leaderboard competition is heating up!

Take 60 seconds to solve today's challenge:
👉 Reply *2* (or */quiz*) to start now
👉 Reply *8* to challenge your peers in group chats

Keep your learning streak shining bright! 🚀`
  },

  maintenance: {
    id: 'maintenance',
    label: '4. Pemberitahuan Pemeliharaan Server (Maintenance)',
    text_id: `Halo, *{name}*! 🛠️

Pemberitahuan: Sistem TelcoLearn Engine akan melakukan peningkatan performa dan pemeliharaan server secara berkala untuk meningkatkan kecepatan respons AI dan stabilitas jaringan.

Layanan akan tetap beroperasi normal setelah pembaruan selesai. Terima kasih atas pengertian dan kerjasamanya! 🙏📡`,
    text_en: `Hello, *{name}*! 🛠️

Notice: TelcoLearn Engine will undergo scheduled performance upgrades to enhance AI response speed and socket stability.

All services will resume normal operation shortly. Thank you for your support! 🙏📡`
  },

  custom: {
    id: 'custom',
    label: '5. Pesan Kustom Bebas (Custom Announcement)',
    text_id: `Halo, *{name}*!\n\n[Tuliskan pesan kustom Anda di sini]\n\nBalas *0* untuk menu utama TelcoLearn. 📡`,
    text_en: `Hello, *{name}*!\n\n[Write your custom message here]\n\nReply *0* for TelcoLearn main menu. 📡`
  }
};

/**
 * Baca state checkpoint dari disk
 */
export function getBroadcastState() {
  if (fs.existsSync(STATE_FILE_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(STATE_FILE_PATH, 'utf-8'));
      if (data && data.campaign_id) {
        return data;
      }
    } catch (e) {
      console.warn('⚠️ Gagal membaca broadcast_state.json:', e.message);
    }
  }

  return {
    campaign_id: DEFAULT_CAMPAIGN_ID,
    preset: 'apology_recovery',
    target_filter: 'all',
    status: 'idle', // 'idle' | 'running' | 'paused' | 'completed' | 'failed'
    total_targets: 0,
    sent_count: 0,
    failed_count: 0,
    current_index: 0,
    started_at: null,
    last_sent_at: null,
    completed_at: null,
    sent_jids: [],
    failed_jids: [],
    last_error: null
  };
}

/**
 * Simpan state checkpoint ke disk
 */
export function saveBroadcastState(state) {
  try {
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    console.error('❌ Gagal menyimpan broadcast_state.json:', e.message);
  }
}

/**
 * Ambil daftar pengguna berdasarkan filter target
 */
export function getTargetUsers(filter = 'all') {
  const db = getDb();
  const cutoff14 = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  let query = 'SELECT id, jid, phone_number, display_name, focus_track, preferred_language, last_active_date, created_at FROM users ';
  let params = [];

  if (filter === 'active') {
    query += `WHERE (last_active_date IS NOT NULL AND last_active_date >= ?) OR (last_active_date IS NULL AND created_at >= ?) `;
    params.push(cutoff14, cutoff14);
  } else if (filter === 'dormant') {
    query += `WHERE (last_active_date IS NOT NULL AND last_active_date < ?) OR (last_active_date IS NULL AND created_at < ?) `;
    params.push(cutoff14, cutoff14);
  } else if (filter.startsWith('track_')) {
    const track = filter.replace('track_', '');
    query += `WHERE focus_track = ? `;
    params.push(track);
  }

  query += 'ORDER BY id ASC';
  return db.prepare(query).all(...params);
}

/**
 * Format teks pesan dengan mengganti placeholder {name}, {track}, dll.
 */
export function formatPersonalizedText(template, user) {
  const isEn = user.preferred_language === 'en';
  const name = user.display_name && user.display_name !== 'Pelajar Telco'
    ? user.display_name
    : (isEn ? 'Fellow Engineer' : 'Rekan Engineer');

  return template
    .replace(/{name}/g, name)
    .replace(/{track}/g, user.focus_track || 'protocol_qa')
    .replace(/{streak}/g, String(user.streak_count || 1));
}

/**
 * Generate teks pesan broadcast untuk pengguna tertentu
 */
export function generateBroadcastText(user, customTemplates = null) {
  const isEn = user.preferred_language === 'en';

  if (customTemplates && (customTemplates.text_id || customTemplates.text_en)) {
    const rawTpl = (isEn && customTemplates.text_en) ? customTemplates.text_en : (customTemplates.text_id || customTemplates.text_en);
    return formatPersonalizedText(rawTpl, user);
  }

  const preset = PRESET_TEMPLATES.apology_recovery;
  const rawTpl = isEn ? preset.text_en : preset.text_id;
  return formatPersonalizedText(rawTpl, user);
}

/**
 * Preview Broadcast dan statistik target
 */
export function getBroadcastPreview(filter = 'all', customTemplates = null) {
  const allUsers = getTargetUsers(filter);
  const state = getBroadcastState();
  const sentSet = new Set(state.sent_jids || []);
  const pendingUsers = allUsers.filter(u => {
    const userJid = u.jid || `${u.phone_number}@s.whatsapp.net`;
    return !sentSet.has(userJid);
  });

  const sampleIdUser = allUsers.find(u => u.preferred_language !== 'en') || allUsers[0] || { display_name: 'Budi Santoso', preferred_language: 'id', focus_track: 'protocol_qa' };
  const sampleEnUser = allUsers.find(u => u.preferred_language === 'en') || { display_name: 'John Doe', preferred_language: 'en', focus_track: 'protocol_qa' };

  return {
    campaign_id: state.campaign_id || DEFAULT_CAMPAIGN_ID,
    target_filter: filter,
    total_users_in_target: allUsers.length,
    already_sent: allUsers.length - pendingUsers.length,
    pending_to_send: pendingUsers.length,
    status: state.status,
    estimated_duration_minutes: Math.round((pendingUsers.length * 11 + Math.floor(pendingUsers.length / 10) * 35) / 60),
    sample_message_id: generateBroadcastText(sampleIdUser, customTemplates),
    sample_message_en: generateBroadcastText(sampleEnUser, customTemplates),
    presets: Object.keys(PRESET_TEMPLATES).map(k => ({
      id: k,
      label: PRESET_TEMPLATES[k].label,
      text_id: PRESET_TEMPLATES[k].text_id,
      text_en: PRESET_TEMPLATES[k].text_en
    }))
  };
}

/**
 * Memulai broadcast serial di background dengan konfigurasi dinamis dari Admin
 */
export async function startSerialBroadcast(getSocketFn, options = {}) {
  if (isRunning) {
    return { success: false, message: 'Broadcast sudah sedang berjalan saat ini!' };
  }

  const filter = options.targetFilter || 'all';
  const customTemplates = (options.customTextId || options.customTextEn) ? {
    text_id: options.customTextId,
    text_en: options.customTextEn
  } : (options.preset && PRESET_TEMPLATES[options.preset] ? PRESET_TEMPLATES[options.preset] : null);

  const campaignId = options.campaignId || options.preset || DEFAULT_CAMPAIGN_ID;

  let state = getBroadcastState();

  // Jika campaign berbeda dari yang tersimpan, atau ada flag forceReset
  if (state.campaign_id !== campaignId || options.forceReset) {
    state = {
      campaign_id: campaignId,
      preset: options.preset || 'custom',
      target_filter: filter,
      status: 'idle',
      total_targets: 0,
      sent_count: 0,
      failed_count: 0,
      current_index: 0,
      started_at: null,
      last_sent_at: null,
      completed_at: null,
      sent_jids: [],
      failed_jids: [],
      last_error: null
    };
  }

  const allTargetUsers = getTargetUsers(filter);
  const sentSet = new Set(state.sent_jids || []);

  const pendingUsers = allTargetUsers.filter(u => {
    const userJid = u.jid || `${u.phone_number}@s.whatsapp.net`;
    return !sentSet.has(userJid);
  });

  if (pendingUsers.length === 0) {
    state.status = 'completed';
    state.completed_at = new Date().toISOString();
    saveBroadcastState(state);
    return { 
      success: true, 
      message: 'Seluruh pengguna dalam kategori target ini sudah menerima pesan sebelumnya.', 
      state 
    };
  }

  state.status = 'running';
  state.total_targets = allTargetUsers.length;
  if (!state.started_at) {
    state.started_at = new Date().toISOString();
  }
  saveBroadcastState(state);

  isRunning = true;
  shouldPause = false;

  console.log(`\n📢 [Broadcast Admin] Memulai Serial Broadcast ke ${pendingUsers.length} pengguna tersisa (Filter: ${filter}, Total: ${allTargetUsers.length})...`);

  // Jalankan di background secara asinkron
  (async () => {
    try {
      let batchCount = 0;

      for (let i = 0; i < pendingUsers.length; i++) {
        if (shouldPause) {
          state.status = 'paused';
          saveBroadcastState(state);
          console.log(`⏸️ [Broadcast] Pengiriman dijeda atas permintaan operator.`);
          break;
        }

        const user = pendingUsers[i];
        const userJid = user.jid || `${user.phone_number}@s.whatsapp.net`;

        // 1. Cek kesehatan socket
        const sock = typeof getSocketFn === 'function' ? getSocketFn() : getSocketFn;
        if (!sock || (sock.ws && sock.ws.readyState !== 1)) {
          console.warn(`⚠️ [Broadcast] Socket WhatsApp tidak terhubung (readyState !== 1). Menjeda broadcast demi keamanan.`);
          state.status = 'paused';
          state.last_error = 'Socket disconnected or not ready';
          saveBroadcastState(state);
          break;
        }

        // 2. Cek Circuit Breaker Lock
        if (isCooldownActive()) {
          console.warn(`🛑 [Broadcast] Circuit Breaker cooldown aktif! Menunda pengiriman broadcast.`);
          state.status = 'paused';
          state.last_error = 'Circuit Breaker Cooldown Active';
          saveBroadcastState(state);
          break;
        }

        try {
          // 3. Human Presence Simulator (mengetik 1.2 - 2.2 detik)
          await simulateHumanPresence(sock, userJid, null, 120);

          // 4. Buat teks pesan unik (zero-width hash perturbation)
          const baseText = generateBroadcastText(user, customTemplates);
          const randomizedText = randomizeMessageContent(baseText);

          // 5. Kirim via Antrean Safe Outbound
          console.log(`[Broadcast ${state.sent_count + 1}/${allTargetUsers.length}] Mengirim ke ${userJid} (${user.display_name})...`);
          await sendSafeScheduled(sock, userJid, { text: randomizedText });

          // 6. Catat keberhasilan
          state.sent_count++;
          state.current_index = state.sent_count;
          state.sent_jids.push(userJid);
          state.last_sent_at = new Date().toISOString();
          saveBroadcastState(state);

          batchCount++;

          // 7. Jeda Acak Antar Pesan (Jitter 8 - 14 detik)
          const jitterDelay = Math.floor(8000 + Math.random() * 6000);
          console.log(`⏳ [Broadcast] Jeda serial aman: ${(jitterDelay / 1000).toFixed(1)} detik...`);
          await sleep(jitterDelay);

          // 8. Jeda Batch Pacing (setiap 10 pesan, istirahat 35 detik)
          if (batchCount % 10 === 0 && i < pendingUsers.length - 1) {
            console.log(`🛡️ [Broadcast Anti-Spam] Istirahat batch 35 detik setelah 10 pengiriman...`);
            await sleep(35000);
          }
        } catch (sendErr) {
          console.error(`❌ [Broadcast] Gagal mengirim ke ${userJid}:`, sendErr.message);
          state.failed_count++;
          state.failed_jids.push({ jid: userJid, error: sendErr.message, at: new Date().toISOString() });
          saveBroadcastState(state);

          const isClosed = sendErr.message?.toLowerCase().includes('connection closed') ||
                           sendErr.message?.toLowerCase().includes('socket');
          if (isClosed) {
            console.warn(`⚠️ [Broadcast] Koneksi socket terputus saat kirim. Menjeda broadcast.`);
            state.status = 'paused';
            state.last_error = sendErr.message;
            saveBroadcastState(state);
            break;
          }

          await sleep(5000);
        }
      }

      if (!shouldPause && state.status !== 'paused') {
        state.status = 'completed';
        state.completed_at = new Date().toISOString();
        saveBroadcastState(state);
        console.log(`\n🎉 [Broadcast] SELURUH BROADCAST BERHASIL DISELESAIKAN!`);
        console.log(`📊 Total Berhasil: ${state.sent_count}, Gagal: ${state.failed_count}`);
      }
    } catch (loopErr) {
      console.error('❌ [Broadcast] Kesalahan fatal pada loop broadcast:', loopErr);
      state.status = 'failed';
      state.last_error = loopErr.message;
      saveBroadcastState(state);
    } finally {
      isRunning = false;
      shouldPause = false;
    }
  })();

  return { 
    success: true, 
    message: `Broadcast serial telah dimulai di background untuk ${pendingUsers.length} pengguna (Filter: ${filter}).`,
    state 
  };
}

/**
 * Jeda broadcast yang sedang berjalan
 */
export function pauseBroadcast() {
  if (!isRunning) {
    return { success: false, message: 'Tidak ada broadcast yang sedang berjalan.' };
  }
  shouldPause = true;
  return { success: true, message: 'Permintaan jeda telah dikirim. Broadcast akan berhenti setelah pesan saat ini selesai.' };
}

/**
 * Reset state broadcast (jika ingin mengirim ulang dari awal)
 */
export function resetBroadcastState() {
  if (isRunning) {
    return { success: false, message: 'Tidak dapat mereset broadcast saat sedang berjalan. Jeda terlebih dahulu.' };
  }
  const newState = {
    campaign_id: DEFAULT_CAMPAIGN_ID,
    preset: 'apology_recovery',
    target_filter: 'all',
    status: 'idle',
    total_targets: 0,
    sent_count: 0,
    failed_count: 0,
    current_index: 0,
    started_at: null,
    last_sent_at: null,
    completed_at: null,
    sent_jids: [],
    failed_jids: [],
    last_error: null
  };
  saveBroadcastState(newState);
  return { success: true, message: 'State broadcast berhasil direset ke status awal.', state: newState };
}
