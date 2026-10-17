/**
 * TelcoLearn Outbound Micro-Dose Scheduler Worker
 * Mengirim materi pembelajaran secara terjadwal:
 * - Slot Pagi: 07:30 WIB
 * - Slot Siang: 12:30 WIB
 * - Slot Malam: 20:30 WIB
 */

import cron from 'node-cron';
import * as db from '../database/db.js';

// Safe fallbacks to prevent crash if an older db.js is cached by Docker/volume
const getActiveUsersForSlot = db.getActiveUsersForSlot || (() => []);
const getNextModuleForUser = db.getNextModuleForUser || (() => null);
const markModuleProgress = db.markModuleProgress || (() => null);
const getUsersForStreakRescue = db.getUsersForStreakRescue || (() => []);

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
        const isEnglishUser = user.preferred_language === 'en';
        if (nextModule) {
          const slotLabel = isEnglishUser
            ? (slotName === 'morning' ? 'Morning' : slotName === 'afternoon' ? 'Afternoon' : 'Evening')
            : (slotName === 'morning' ? 'Pagi' : slotName === 'afternoon' ? 'Siang' : 'Malam');
          let header = `⏰ *[TelcoLearn ${slotLabel}]*\n\n`;
          if (nextModule.is_repeat) {
            header = isEnglishUser
              ? `⏰ *[TelcoLearn ${slotLabel} - Curriculum Review]* 🔄\n_Track completed! Reviewing core concepts:_\n\n`
              : `⏰ *[TelcoLearn ${slotLabel} - Review Kurikulum]* 🔄\n_Materi track selesai! Mengulang konsep inti:_\n\n`;
          }
          const moduleBody = (isEnglishUser && nextModule.wa_text_body_en) ? nextModule.wa_text_body_en : nextModule.wa_text_body;
          const fullMessage = header + moduleBody;

          await sendSafeScheduled(sock, user.jid, { text: fullMessage });
          markModuleProgress(user.id, nextModule.id, 'SENT');
          console.log(`📨 [Scheduler] Berhasil mengantrekan modul "${nextModule.module_code}" ke ${user.phone_number}`);
        } else {
          // Jika semua modul sudah selesai, kirim pemicu kuis
          const quizReminder = isEnglishUser
            ? `⏰ *[TelcoLearn Review]*\n\nGood ${slotName === 'morning' ? 'morning' : slotName === 'afternoon' ? 'afternoon' : 'evening'}! You have completed the main curriculum modules. Keep your streak alive today! Type */quiz* for a 60-second challenge 🚀`
            : `⏰ *[TelcoLearn Review]*\n\nSelamat ${slotName === 'morning' ? 'pagi' : slotName === 'afternoon' ? 'siang' : 'malam'}! Anda telah menyelesaikan materi kurikulum utama. Yuk pertahankan streak Anda hari ini! Ketik */quiz* untuk kuis evaluasi 🚀`;
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
 * Dispatch peringatan streak akan padam (Streak Rescue Alert) pada pukul 20:00 WIB
 */
export async function dispatchStreakRescue(maybeSock) {
  const sock = maybeSock || (typeof currentSocketGetter === 'function' ? currentSocketGetter() : currentSocketGetter);
  if (!sock) return;

  try {
    const atRiskUsers = getUsersForStreakRescue();
    if (!atRiskUsers || atRiskUsers.length === 0) {
      console.log('🔥 [Streak Rescue] Tidak ada pengguna berisiko padam streak hari ini.');
      return;
    }

    console.log(`🔥 [Streak Rescue] Ditemukan ${atRiskUsers.length} pengguna berisiko padam streak.`);
    let count = 0;
    for (const user of atRiskUsers) {
      if (user.reminder_preference === 'none' || user.reminder_preference === 'off') continue;

      const isEnglishUser = user.preferred_language === 'en';
      const rescueText = isEnglishUser
        ? `🚨 *STREAK RESCUE ALERT!* 🔥\n\nHey *${user.display_name}*! Your *${user.streak_count}-day learning streak* is about to expire at midnight!\n\nSave your streak with 1 quick step:\n👉 Reply *2* (or */quiz*) to take a 60-second quiz\n👉 Reply *9* (or */espresso*) for a 30-second field tip`
        : `🚨 *PERINGATAN STREAK AKAN HANGUS!* 🔥\n\nHalo *${user.display_name}*! Rekor belajar *${user.streak_count} hari berturut-turut* Anda akan hangus tengah malam ini!\n\nYuk selamatkan streak Anda dengan 1 aktivitas cepat:\n👉 Balas *2* (atau */quiz*) untuk jawab kuis 60 detik\n👉 Balas *9* (atau */espresso*) untuk tips lapangan 30 detik`;

      try {
        await sendSafeScheduled(sock, user.jid, { text: rescueText });
        count++;
        if (count % 5 === 0 && count < atRiskUsers.length) {
          await new Promise((r) => setTimeout(r, 20000));
        }
      } catch (e) {
        console.error(`❌ Gagal mengirim streak rescue ke ${user.jid}:`, e.message);
      }
    }
  } catch (err) {
    console.error('❌ Error in dispatchStreakRescue:', err);
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

  // 3. Streak Rescue Alert (20:00 WIB - Penyelamat Streak Sebelum Tengah Malam)
  const streakRescueJob = cron.schedule('0 20 * * *', async () => {
    console.log('🔥 [Scheduler Worker] Memicu pengecekan streak rescue alert...');
    await dispatchStreakRescue();
  }, { timezone });
  activeCronJobs.push(streakRescueJob);

  // 4. Slot Malam (20:30 WIB)
  const nightJob = cron.schedule('30 20 * * *', () => {
    dispatchScheduledSlot('night');
  }, { timezone });
  activeCronJobs.push(nightJob);

  // 5. Laporan Kuota & Token Harian ke Email Admin (21:30 WIB)
  const reportJob = cron.schedule('30 21 * * *', async () => {
    console.log('📊 [Scheduler Worker] Memicu pengiriman laporan kuota token harian ke email admin...');
    await sendDailyEmailReport();
  }, { timezone });
  activeCronJobs.push(reportJob);

  console.log(`📅 [Scheduler Worker] Aktif 24/7 untuk zona waktu ${timezone}:`);
  console.log(`   🌅 Pagi          : 07:30 WIB`);
  console.log(`   ☀️ Siang         : 12:30 WIB`);
  console.log(`   🔥 Streak Rescue : 20:00 WIB`);
  console.log(`   🌙 Malam         : 20:30 WIB`);
  console.log(`   📊 Report        : 21:30 WIB (Daily Token & Quota Email)`);
}

/**
 * Hentikan semua scheduler saat shutdown
 */
export function stopScheduler() {
  activeCronJobs.forEach(job => job.stop());
  activeCronJobs = [];
  console.log('🛑 [Scheduler Worker] Seluruh cron job dinonaktifkan.');
}
