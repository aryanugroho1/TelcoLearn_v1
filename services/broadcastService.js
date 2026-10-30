/**
/**
 * TelcoLearn Serial One-Time Broadcast Service (Anti-Spam & Anti-Ban Protected)
 * Mengirimkan pesan pengumuman/pemulihan satu kali ke seluruh pengguna secara serial.
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

const CAMPAIGN_ID = 'outage_recovery_update_20261030';

let isRunning = false;
let shouldPause = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Baca state checkpoint dari disk
 */
export function getBroadcastState() {
  if (fs.existsSync(STATE_FILE_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(STATE_FILE_PATH, 'utf-8'));
      if (data && data.campaign_id === CAMPAIGN_ID) {
        return data;
      }
    } catch (e) {
      console.warn('⚠️ Gagal membaca broadcast_state.json:', e.message);
    }
  }

  return {
    campaign_id: CAMPAIGN_ID,
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
 * Template Pesan Broadcast (Bilingual & Ramah Pengguna)
 */
export function generateBroadcastText(user) {
  const isEn = user.preferred_language === 'en';
  const name = user.display_name && user.display_name !== 'Pelajar Telco'
    ? user.display_name
    : (isEn ? 'Fellow Engineer' : 'Rekan Engineer');

  if (isEn) {
    return `Hello, *${name}*! 👋

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

Thank you very much for your patience and support! Happy learning with TelcoLearn. 📡✨`;
  }

  return `Halo, *${name}*! 👋

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

Terima kasih banyak atas dukungan dan kesabaran rekan-rekan engineer! Selamat kembali belajar bersama TelcoLearn. 📡✨`;
}

/**
 * Preview Broadcast dan statistik target
 */
export function getBroadcastPreview() {
  const db = getDb();
  const allUsers = db.prepare(`
    SELECT id, jid, phone_number, display_name, preferred_language, last_active_date, created_at 
    FROM users 
    ORDER BY id ASC
  `).all();

  const state = getBroadcastState();
  const sentSet = new Set(state.sent_jids || []);
  const pendingUsers = allUsers.filter(u => {
    const userJid = u.jid || `${u.phone_number}@s.whatsapp.net`;
    return !sentSet.has(userJid);
  });

  const sampleIdUser = allUsers.find(u => u.preferred_language !== 'en') || allUsers[0] || { display_name: 'Budi Santoso', preferred_language: 'id' };
  const sampleEnUser = allUsers.find(u => u.preferred_language === 'en') || { display_name: 'John Doe', preferred_language: 'en' };

  return {
    campaign_id: CAMPAIGN_ID,
    total_users_in_db: allUsers.length,
    already_sent: sentSet.size,
    pending_to_send: pendingUsers.length,
    status: state.status,
    estimated_duration_minutes: Math.round((pendingUsers.length * 11 + Math.floor(pendingUsers.length / 10) * 35) / 60),
    sample_message_id: generateBroadcastText(sampleIdUser),
    sample_message_en: generateBroadcastText(sampleEnUser)
  };
}

/**
 * Memulai broadcast serial di background
 */
export async function startSerialBroadcast(getSocketFn) {
  if (isRunning) {
    return { success: false, message: 'Broadcast sudah sedang berjalan saat ini!' };
  }

  const db = getDb();
  const allUsers = db.prepare(`
    SELECT id, jid, phone_number, display_name, preferred_language 
    FROM users 
    ORDER BY id ASC
  `).all();

  let state = getBroadcastState();
  const sentSet = new Set(state.sent_jids || []);
  const failedSet = new Set(state.failed_jids || []);

  const targetUsers = allUsers.filter(u => {
    const userJid = u.jid || `${u.phone_number}@s.whatsapp.net`;
    return !sentSet.has(userJid);
  });

  if (targetUsers.length === 0) {
    state.status = 'completed';
    state.completed_at = new Date().toISOString();
    saveBroadcastState(state);
    return { success: true, message: 'Seluruh pengguna sudah menerima broadcast sebelumnya.', state };
  }

  state.status = 'running';
  state.total_targets = allUsers.length;
  if (!state.started_at) {
    state.started_at = new Date().toISOString();
  }
  saveBroadcastState(state);

  isRunning = true;
  shouldPause = false;

  console.log(`\n📢 [Broadcast] Memulai Serial Broadcast ke ${targetUsers.length} pengguna tersisa (Total: ${allUsers.length})...`);

  // Jalankan di background secara asinkron agar tidak memblokir event loop
  (async () => {
    try {
      let batchCount = 0;

      for (let i = 0; i < targetUsers.length; i++) {
        if (shouldPause) {
          state.status = 'paused';
          saveBroadcastState(state);
          console.log(`⏸️ [Broadcast] Pengiriman dijeda atas permintaan operator.`);
          break;
        }

        const user = targetUsers[i];
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
          const baseText = generateBroadcastText(user);
          const randomizedText = randomizeMessageContent(baseText);

          // 5. Kirim via Antrean Safe Outbound
          console.log(`[Broadcast ${state.sent_count + 1}/${allUsers.length}] Mengirim ke ${userJid} (${user.display_name})...`);
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
          if (batchCount % 10 === 0 && i < targetUsers.length - 1) {
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

          // Delay sebentar sebelum lanjut ke user berikutnya jika gagal
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
    message: `Broadcast telah dimulai di background untuk ${targetUsers.length} pengguna tersisa.`,
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
    campaign_id: CAMPAIGN_ID,
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
