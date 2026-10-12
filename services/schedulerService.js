/**
 * TelcoLearn Outbound Micro-Dose Scheduler Worker
 * Mengirim materi pembelajaran secara terjadwal:
 * - Slot Pagi: 07:30 WIB
 * - Slot Siang: 12:30 WIB
 * - Slot Malam: 20:30 WIB
 */

import cron from 'node-cron';
import { getActiveUsersForSlot, getNextModuleForUser, markModuleProgress } from '../database/db.js';
import { sendSafeScheduled } from './antiBanService.js';
import { sendDailyEmailReport } from './reportingService.js';

let activeCronJobs = [];
let currentSocketGetter = null;

/**
 * Dispatch materi terjadwal untuk slot tertentu dengan proteksi anti-bulk spam
 */
export async function dispatchScheduledSlot(sockOrSlot, maybeSlotName) {
  let sock;
  let slotName;

  if (typeof sockOrSlot === 'string') {
    slotName = sockOrSlot;
    sock = typeof currentSocketGetter === 'function' ? currentSocketGetter() : currentSocketGetter;
  } else {
    sock = sockOrSlot || (typeof currentSocketGetter === 'function' ? currentSocketGetter() : currentSocketGetter);
    slotName = maybeSlotName || 'morning';
  }

  console.log(`⏰ [Scheduler] Memulai dispatch materi otomatis untuk slot: ${slotName.toUpperCase()}`);

  if (!sock) {
    console.warn('⚠️ [Scheduler] Baileys socket belum siap, lewati dispatch.');
    return;
  }

  // Cek kesiapan WebSocket (readyState 1 = OPEN) jika property ws tersedia
  if (sock.ws && typeof sock.ws.readyState === 'number' && sock.ws.readyState !== 1) {
    console.warn(`⚠️ [Scheduler] WebSocket Baileys sedang tidak aktif (readyState: ${sock.ws.readyState}). Melewati dispatch slot ${slotName}.`);
    return;
  }

  try {
    const targetUsers = getActiveUsersForSlot(slotName);
    console.log(`👥 [Scheduler] Ditemukan ${targetUsers.length} pengguna aktif untuk slot ${slotName}`);

    let processedCount = 0;
    for (const user of targetUsers) {
      try {
        const nextModule = getNextModuleForUser(user.id);
        if (nextModule) {
          const header = `⏰ *[TelcoLearn ${slotName === 'morning' ? 'Pagi' : slotName === 'afternoon' ? 'Siang' : 'Malam'}]*\n\n`;
          const fullMessage = header + nextModule.wa_text_body;

          await sendSafeScheduled(sock, user.jid, { text: fullMessage });
          markModuleProgress(user.id, nextModule.id, 'SENT');
          console.log(`📨 [Scheduler] Berhasil mengantrekan modul "${nextModule.module_code}" ke ${user.phone_number}`);
        } else {
          // Jika semua modul sudah selesai, kirim pemicu kuis
          const quizReminder = `⏰ *[TelcoLearn Review]*\n\nSelamat ${slotName === 'morning' ? 'pagi' : slotName === 'afternoon' ? 'siang' : 'malam'}! Anda telah menyelesaikan materi kurikulum utama. Yuk pertahankan streak Anda hari ini! Ketik */quiz* untuk kuis evaluasi 🚀`;
          await sendSafeScheduled(sock, user.jid, { text: quizReminder });
        }

        processedCount++;
        // Setiap 5 pengguna, berikan jeda batch 30 detik agar tidak terdeteksi bulk messaging spike
        if (processedCount % 5 === 0 && processedCount < targetUsers.length) {
          console.log(`🛡️ [Scheduler Anti-Spam] Jeda batch 30 detik setelah 5 pengiriman...`);
          await new Promise((r) => setTimeout(r, 30000));
        }
      } catch (userErr) {
        console.error(`❌ [Scheduler] Gagal mengirim pesan ke user ${user.jid}:`, userErr.message);

        // Jika error Connection Closed, periksa apakah koneksi socket terputus
        const activeSock = typeof currentSocketGetter === 'function' ? currentSocketGetter() : currentSocketGetter;
        const isClosed = userErr.message?.toLowerCase().includes('connection closed') ||
                         (activeSock?.ws && typeof activeSock.ws.readyState === 'number' && activeSock.ws.readyState !== 1);

        if (isClosed) {
          console.warn(`⚠️ [Scheduler] Terdeteksi koneksi WhatsApp terputus di tengah pengiriman batch. Menunda sisa antrean slot ${slotName} demi keamanan akun.`);
          break;
        }
      }
    }
  } catch (err) {
    console.error(`❌ [Scheduler] Kesalahan saat menjalankan batch slot ${slotName}:`, err);
  }
}

/**
 * Inisialisasi cron jobs
 */
export function initScheduler(sockOrGetter) {
  if (typeof sockOrGetter === 'function') {
    currentSocketGetter = sockOrGetter;
  } else {
    currentSocketGetter = () => sockOrGetter;
  }

  // Hentikan cron job sebelumnya jika ada
  activeCronJobs.forEach(job => job.stop());
  activeCronJobs = [];

  const timezone = process.env.TIMEZONE || 'Asia/Jakarta';

  // 1. Slot Pagi (07:30 WIB)
  const morningJob = cron.schedule('30 7 * * *', () => {
    dispatchScheduledSlot('morning');
  }, { timezone });
  activeCronJobs.push(morningJob);

  // 2. Slot Siang (12:30 WIB)
  const afternoonJob = cron.schedule('30 12 * * *', () => {
    dispatchScheduledSlot('afternoon');
  }, { timezone });
  activeCronJobs.push(afternoonJob);

  // 3. Slot Malam (20:30 WIB)
  const nightJob = cron.schedule('30 20 * * *', () => {
    dispatchScheduledSlot('night');
  }, { timezone });
  activeCronJobs.push(nightJob);

  // 4. Laporan Kuota & Token Harian ke Email Admin (21:30 WIB)
  const reportJob = cron.schedule('30 21 * * *', async () => {
    console.log('📊 [Scheduler Worker] Memicu pengiriman laporan kuota token harian ke email admin...');
    await sendDailyEmailReport();
  }, { timezone });
  activeCronJobs.push(reportJob);

  console.log(`📅 [Scheduler Worker] Aktif 24/7 untuk zona waktu ${timezone}:`);
  console.log(`   🌅 Pagi    : 07:30 WIB`);
  console.log(`   ☀️ Siang   : 12:30 WIB`);
  console.log(`   🌙 Malam   : 20:30 WIB`);
  console.log(`   📊 Report  : 21:30 WIB (Daily Token & Quota Email)`);
}

/**
 * Hentikan semua scheduler saat shutdown
 */
export function stopScheduler() {
  activeCronJobs.forEach(job => job.stop());
  activeCronJobs = [];
  console.log('🛑 [Scheduler Worker] Seluruh cron job dinonaktifkan.');
}
