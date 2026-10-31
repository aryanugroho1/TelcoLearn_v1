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

import { sendSafeScheduled, isSocketReady } from './antiBanService.js';
import { sendDailyEmailReport } from './reportingService.js';

let activeCronJobs = [];
let currentSocketGetter = null;

/**
 * Kontrol Status Outbound Scheduler
 * Demi keamanan akun WhatsApp dari suspend/restriksi Meta, default di-set true (PAUSED).
 * Hanya berjalan jika explicitly ENABLE_OUTBOUND_SCHEDULER === 'true' DAN PAUSE_OUTBOUND_SCHEDULER !== 'true'.
 */
let isOutboundPaused = (
  process.env.PAUSE_OUTBOUND_SCHEDULER === 'false' ||
  (process.env.ENABLE_OUTBOUND_SCHEDULER === 'true' && process.env.PAUSE_OUTBOUND_SCHEDULER !== 'true')
) ? false : true;

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

  if (isOutboundPaused) {
    console.log(`🛑 [Scheduler] Outbound messaging sedang DIJEDA SEMENTARA (Safety Mode: Inbound Pull Only). Melewati slot ${slotName}.`);
    return { success: false, paused: true, message: `Outbound scheduler sedang dijeda demi keamanan akun.` };
  }

  console.log(`⏰ [Scheduler] Memulai dispatch materi otomatis untuk slot: ${slotName.toUpperCase()}`);

  if (!sock) {
    console.warn('⚠️ [Scheduler] Baileys socket belum siap, lewati dispatch.');
    return;
  }

  // Cek kesiapan WebSocket Baileys
  if (!isSocketReady(sock)) {
    console.warn(`⚠️ [Scheduler] WebSocket Baileys sedang tidak aktif. Melewati dispatch slot ${slotName}.`);
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
        const today = new Date().toISOString().slice(0, 10);
        let daysInactive = 0;
        if (user.last_active_date) {
          const lastDate = new Date(user.last_active_date);
          const todayDate = new Date(today);
          daysInactive = Math.max(0, Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24)));
        } else if (user.created_at) {
          const createDate = new Date(user.created_at.slice(0, 10));
          const todayDate = new Date(today);
          daysInactive = Math.max(0, Math.round((todayDate - createDate) / (1000 * 60 * 60 * 24)));
        }

        // Jika mendekati batas 14 hari tidak aktif (7-13 hari), sertakan sapaan & konfirmasi kelanjutan pengingat
        let reengagementPrefix = '';
        if (daysInactive >= 7) {
          reengagementPrefix = isEnglishUser
            ? `🔔 *Hi ${user.display_name}! Would you like to keep receiving daily TelcoLearn reminders?*\n_We noticed you haven't been active for ${daysInactive} days. To keep your chat clutter-free, automatic reminders will pause after 14 days of inactivity._\n👉 Reply *1* (or */learn*) to continue learning\n👉 Reply */stop* to pause daily reminders anytime\n\n────────────────────────\n\n`
            : `🔔 *Halo ${user.display_name}! Masih ingin melanjutkan pengingat belajar TelcoLearn?*\n_Kami perhatikan Anda belum aktif selama ${daysInactive} hari. Demi kenyamanan Anda, jadwal pengingat akan otomatis dijeda setelah 14 hari tanpa aktivitas._\n👉 Balas *1* (atau */lanjut*) untuk tetap menerima materi\n👉 Balas */stop* jika ingin menghentikan pengingat\n\n────────────────────────\n\n`;
        }

        const scheduledFooter = isEnglishUser
          ? `\n\n────────────────────────\n💡 *Daily Quick Actions:*\n• Reply *1* (or */learn*) for next lesson\n• Reply *2* (or */quiz*) for daily quiz\n• Reply */stop* to pause daily reminders`
          : `\n\n────────────────────────\n💡 *Aksi Belajar Harian:*\n• Balas *1* (atau */lanjut*) untuk materi berikutnya\n• Balas *2* (atau */quiz*) untuk kuis harian\n• Balas */stop* jika ingin menghentikan pengingat harian`;

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
          const fullMessage = reengagementPrefix + header + moduleBody + scheduledFooter;

          await sendSafeScheduled(sock, user.jid, { text: fullMessage });
          markModuleProgress(user.id, nextModule.id, 'SENT');
          console.log(`📨 [Scheduler] Berhasil mengantrekan modul "${nextModule.module_code}" ke ${user.phone_number}`);
        } else {
          // Jika semua modul sudah selesai, kirim pemicu kuis
          const quizReminder = isEnglishUser
            ? `${reengagementPrefix}⏰ *[TelcoLearn Review]*\n\nGood ${slotName === 'morning' ? 'morning' : slotName === 'afternoon' ? 'afternoon' : 'evening'}! You have completed the main curriculum modules. Keep your streak alive today! Type */quiz* for a 60-second challenge 🚀${scheduledFooter}`
            : `${reengagementPrefix}⏰ *[TelcoLearn Review]*\n\nSelamat ${slotName === 'morning' ? 'pagi' : slotName === 'afternoon' ? 'siang' : 'malam'}! Anda telah menyelesaikan materi kurikulum utama. Yuk pertahankan streak Anda hari ini! Ketik */quiz* untuk kuis evaluasi 🚀${scheduledFooter}`;
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
        const isClosed = userErr.message?.toLowerCase().includes('connection closed') || !isSocketReady(activeSock);

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
  if (isOutboundPaused) {
    console.log('🛑 [Streak Rescue] Outbound messaging sedang DIJEDA SEMENTARA (Safety Mode: Inbound Pull Only). Melewati pengiriman.');
    return { success: false, paused: true, message: 'Outbound streak rescue sedang dijeda demi keamanan akun.' };
  }

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
        const isClosed = e.message?.toLowerCase().includes('connection closed') || !isSocketReady(sock);
        if (isClosed) {
          console.warn('⚠️ [Streak Rescue] Terdeteksi koneksi WhatsApp terputus. Menghentikan antrean streak rescue demi keamanan.');
          break;
        }
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
    if (isOutboundPaused) {
      console.log('🛑 [Scheduler Worker 07:30 WIB] Outbound scheduler sedang DIJEDA. Melewati pengiriman materi pagi.');
      return;
    }
    dispatchScheduledSlot('morning');
  }, { timezone });
  activeCronJobs.push(morningJob);

  // 2. Slot Siang (12:30 WIB)
  const afternoonJob = cron.schedule('30 12 * * *', () => {
    if (isOutboundPaused) {
      console.log('🛑 [Scheduler Worker 12:30 WIB] Outbound scheduler sedang DIJEDA. Melewati pengiriman materi siang.');
      return;
    }
    dispatchScheduledSlot('afternoon');
  }, { timezone });
  activeCronJobs.push(afternoonJob);

  // 3. Streak Rescue Alert (20:00 WIB - Penyelamat Streak Sebelum Tengah Malam)
  const streakRescueJob = cron.schedule('0 20 * * *', async () => {
    if (isOutboundPaused) {
      console.log('🛑 [Scheduler Worker 20:00 WIB] Outbound scheduler sedang DIJEDA. Melewati streak rescue alert.');
      return;
    }
    console.log('🔥 [Scheduler Worker] Memicu pengecekan streak rescue alert...');
    await dispatchStreakRescue();
  }, { timezone });
  activeCronJobs.push(streakRescueJob);

  // 4. Slot Malam (20:30 WIB)
  const nightJob = cron.schedule('30 20 * * *', () => {
    if (isOutboundPaused) {
      console.log('🛑 [Scheduler Worker 20:30 WIB] Outbound scheduler sedang DIJEDA. Melewati pengiriman materi malam.');
      return;
    }
    dispatchScheduledSlot('night');
  }, { timezone });
  activeCronJobs.push(nightJob);

  // 5. Laporan Kuota & Token Harian ke Email Admin (21:30 WIB - Tetap Berjalan)
  const reportJob = cron.schedule('30 21 * * *', async () => {
    console.log('📊 [Scheduler Worker] Memicu pengiriman laporan kuota token harian ke email admin...');
    await sendDailyEmailReport();
  }, { timezone });
  activeCronJobs.push(reportJob);

  if (isOutboundPaused) {
    console.log(`🛑 [Scheduler Worker] Mode Keamanan Akun Aktif: Outbound cron broadcast DIJEDA SEMENTARA.`);
    console.log(`   Slot Pagi (07:30), Siang (12:30), Streak Rescue (20:00), dan Malam (20:30) TIDAK AKAN MENGIRIM PESAN.`);
    console.log(`   Bot tetap 100% responsif menjawab pesan masuk (Inbound on-demand: /belajar, /quiz, tanya AI).`);
    console.log(`   📊 Report email admin (21:30 WIB) tetap aktif.`);
  } else {
    console.log(`📅 [Scheduler Worker] Aktif 24/7 untuk zona waktu ${timezone}:`);
    console.log(`   🌅 Pagi          : 07:30 WIB`);
    console.log(`   ☀️ Siang         : 12:30 WIB`);
    console.log(`   🔥 Streak Rescue : 20:00 WIB`);
    console.log(`   🌙 Malam         : 20:30 WIB`);
    console.log(`   📊 Report        : 21:30 WIB (Daily Token & Quota Email)`);
  }
}

/**
 * Jeda outbound scheduler sementara (Safety Mode)
 */
export function pauseOutboundScheduler() {
  isOutboundPaused = true;
  console.log('🛑 [Scheduler Worker] Outbound cron scheduler berhasil DIJEDA SEMENTARA.');
  return { success: true, paused: true, message: 'Outbound cron scheduler berhasil dijeda sementara.' };
}

/**
 * Aktifkan kembali outbound scheduler
 */
export function resumeOutboundScheduler() {
  isOutboundPaused = false;
  console.log('▶️ [Scheduler Worker] Outbound cron scheduler berhasil DIAKTIFKAN KEMBALI.');
  return { success: true, paused: false, message: 'Outbound cron scheduler berhasil diaktifkan kembali.' };
}

/**
 * Cek apakah outbound scheduler sedang dijeda
 */
export function isOutboundSchedulerPaused() {
  return isOutboundPaused;
}

/**
 * Dapatkan ringkasan status cron scheduler
 */
export function getSchedulerStatus() {
  const timezone = process.env.TIMEZONE || 'Asia/Jakarta';
  return {
    paused: isOutboundPaused,
    timezone,
    slots: [
      { slot: 'morning', time: '07:30 WIB', enabled: !isOutboundPaused },
      { slot: 'afternoon', time: '12:30 WIB', enabled: !isOutboundPaused },
      { slot: 'streakRescue', time: '20:00 WIB', enabled: !isOutboundPaused },
      { slot: 'night', time: '20:30 WIB', enabled: !isOutboundPaused },
      { slot: 'dailyEmailReport', time: '21:30 WIB', enabled: true, note: 'Admin Email Only' }
    ]
  };
}

/**
 * Hentikan semua scheduler saat shutdown
 */
export function stopScheduler() {
  activeCronJobs.forEach(job => job.stop());
  activeCronJobs = [];
  console.log('🛑 [Scheduler Worker] Seluruh cron job dinonaktifkan.');
}
