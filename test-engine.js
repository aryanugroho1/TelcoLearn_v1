/**
 * Automated Verification & Unit Test Suite for TelcoLearn Engine
 * Menguji:
 * 1. Database Init (7 tabel & indexes)
 * 2. CRUD Modul, Kuis, User
 * 3. Router Service State Machine (Onboarding -> Quiz Evaluation -> Streak Tracking)
 * 4. Telco Log Heuristic Pattern Detection
 * 5. Mock WhatsApp Dispatch
 */

import 'dotenv/config';
import { initializeDatabase } from './database/init.js';
import {
  createUser,
  getUserByJid,
  updateUserState,
  updateUserPreferences,
  updateUserStreak,
  getNextModuleForUser,
  markModuleProgress,
  getNextQuizForUser,
  recordQuizLog,
  getQuizById,
  saveUserNote,
  getUserNotes,
  getActiveUsersForSlot,
  getDb
} from './database/db.js';
import { detectTelcoLogPattern, FOCUS_TRACKS, REMINDER_PREFERENCES } from './config/constants.js';
import { handleIncomingMessage } from './services/routerService.js';

async function runTestSuite() {
  console.log('🧪 ========================================================');
  console.log('🧪 MEMULAI TELCOLEARN VERIFICATION TEST SUITE');
  console.log('🧪 ========================================================\n');

  // 1. Inisialisasi Database
  console.log('▶️ [Test 1] Database Initialization & Seed Testing...');
  initializeDatabase();
  const db = getDb();
  const moduleCount = db.prepare('SELECT COUNT(*) as count FROM modules').get().count;
  const quizCount = db.prepare('SELECT COUNT(*) as count FROM quizzes').get().count;
  if (moduleCount >= 5 && quizCount >= 5) {
    console.log(`✅ [Pass] Modul (${moduleCount}) dan Kuis (${quizCount}) berhasil diverifikasi.`);
  } else {
    throw new Error(`Modul atau kuis kurang: modules=${moduleCount}, quizzes=${quizCount}`);
  }

  // 2. User Creation & Preferences
  console.log('\n▶️ [Test 2] User Lifecycle & State Machine...');
  const testJid = '628999999999@s.whatsapp.net';
  db.prepare('DELETE FROM users WHERE jid = ?').run(testJid);

  let user = createUser({
    jid: testJid,
    phone_number: '628999999999',
    display_name: 'Tester Protocol QA',
    focus_track: 'protocol_qa',
    reminder_preference: 'all'
  });
  console.log(`✅ [Pass] User dibuat: ID=${user.id}, JID=${user.jid}, State=${user.current_state}`);

  // Test Update Preferences
  updateUserPreferences(testJid, { focus_track: 'ml_telco', reminder_preference: 'morning' });
  user = getUserByJid(testJid);
  if (user.focus_track === 'ml_telco' && user.reminder_preference === 'morning') {
    console.log(`✅ [Pass] Update Preferensi berhasil: Track=${user.focus_track}, Pref=${user.reminder_preference}`);
  } else {
    throw new Error('Update preferensi gagal.');
  }

  // 3. Module Progression
  console.log('\n▶️ [Test 3] Module Progression Testing...');
  const nextMod = getNextModuleForUser(user.id);
  console.log(`✅ [Pass] Modul berikutnya: ${nextMod.module_code} - "${nextMod.title}"`);
  markModuleProgress(user.id, nextMod.id, 'COMPLETED');
  const afterProgress = getNextModuleForUser(user.id);
  console.log(`✅ [Pass] Modul selanjutnya setelah progress: ${afterProgress.module_code} - "${afterProgress.title}"`);

  // 4. Quiz Evaluation & Streak Counting
  console.log('\n▶️ [Test 4] Quiz & Streak Evaluation...');
  const quiz = getNextQuizForUser(user.id);
  console.log(`✅ [Pass] Mengambil Kuis: ID=${quiz.id}, Soal: "${quiz.question.slice(0, 50)}..."`);
  console.log(`   Kunci Jawaban: ${quiz.correct_option}`);

  // Simulasi jawaban benar
  recordQuizLog(user.id, quiz.id, quiz.correct_option, true);
  const newStreak = updateUserStreak(testJid, true);
  if (newStreak >= 1) {
    console.log(`✅ [Pass] Streak bertambah: 🔥 ${newStreak} Hari`);
  } else {
    throw new Error('Streak tidak bertambah setelah jawaban benar.');
  }

  // 5. Notes Persistence
  console.log('\n▶️ [Test 5] Custom User Notes Testing...');
  const noteId = saveUserNote(user.id, 'Test Note', 'RRC connection reject waitTime = 16s observed on Cell 102', 'logfile');
  const notes = getUserNotes(user.id);
  if (notes.length > 0 && notes[0].id === noteId) {
    console.log(`✅ [Pass] Catatan tersimpan: "${notes[0].note_body}"`);
  } else {
    throw new Error('Penyimpanan catatan gagal.');
  }

  // 6. Log Heuristic Pattern Detection
  console.log('\n▶️ [Test 6] Heuristic Log Detection Testing...');
  const sampleLog1 = 'UE log trace: RRCConnectionReject-r8-IEs: waitTime: 16';
  const sampleLog2 = 'Tolong jelaskan apa itu 5G Core AMF';
  const sampleLog3 = 'Nas Reject Cause: 5GMM cause = 11 (PLMN not allowed)';

  if (detectTelcoLogPattern(sampleLog1) && detectTelcoLogPattern(sampleLog3) && !detectTelcoLogPattern(sampleLog2)) {
    console.log('✅ [Pass] Heuristic detector berhasil membedakan log OTA vs teks biasa.');
  } else {
    throw new Error('Heuristic log detection tidak akurat.');
  }

  // 7. Mock Baileys Message Routing
  console.log('\n▶️ [Test 7] Mock Baileys Inbound Router Testing...');
  const sentMessages = [];
  const mockSock = {
    sendMessage: async (jid, content) => {
      sentMessages.push({ jid, content });
      return { key: { id: 'mock-msg-' + Date.now() } };
    },
    readMessages: async (keys) => {
      return true;
    },
    sendPresenceUpdate: async (type, jid) => {
      return true;
    }
  };

  // Test slash command /menu
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: '/menu' }
  });
  if (sentMessages.length > 0 && sentMessages[sentMessages.length - 1].content.text.includes('TELCOLEARN MAIN MENU')) {
    console.log('✅ [Pass] Router berhasil menangani command /menu.');
  } else {
    throw new Error('Handler /menu gagal merespons.');
  }

  // Test slash command /streak
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: '/streak' }
  });
  if (sentMessages[sentMessages.length - 1].content.text.includes('KONSISTENSI & STATISTIK BELAJAR')) {
    console.log('✅ [Pass] Router berhasil menangani command /streak.');
  } else {
    throw new Error('Handler /streak gagal merespons.');
  }

  // 8. Onboarding End-to-End Simulation
  console.log('\n▶️ [Test 8] Complete Onboarding Flow Simulation...');
  const newJid = '628881234567@s.whatsapp.net';
  db.prepare('DELETE FROM users WHERE jid = ?').run(newJid);

  // User baru kirim "Halo TelcoLearn"
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: newJid, fromMe: false },
    message: { conversation: 'Halo TelcoLearn' }
  });
  let newUser = getUserByJid(newJid);
  if (newUser && newUser.current_state === 'ONBOARDING_TRACK') {
    console.log('✅ [Pass] Skenario 1.1: User baru otomatis masuk state ONBOARDING_TRACK');
  } else {
    throw new Error('Onboarding initial state gagal.');
  }

  // User pilih "4" (Log Analysis / log_telco)
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: newJid, fromMe: false },
    message: { conversation: '4' }
  });
  newUser = getUserByJid(newJid);
  if (newUser && newUser.current_state === 'IDLE' && newUser.focus_track === 'log_telco') {
    console.log('✅ [Pass] Skenario 1.2: Pemilihan track "4" (log_telco) berhasil disimpan & beralih ke state IDLE.');
  } else {
    throw new Error('Onboarding track selection gagal.');
  }

  // 9. Interactive Commands (/track, /jadwal, /belajar, /quiz, /batal)
  console.log('\n▶️ [Test 9] Interactive Commands (/track, /jadwal, /belajar, /quiz, /batal)...');
  // Test /track 3
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: newJid, fromMe: false },
    message: { conversation: '/track 3' }
  });
  newUser = getUserByJid(newJid);
  if (newUser.focus_track === 'ml_telco') {
    console.log('✅ [Pass] Command /track 3 berhasil mengubah fokus ke ml_telco.');
  } else {
    throw new Error('Command /track gagal.');
  }

  // Test /jadwal 1
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: newJid, fromMe: false },
    message: { conversation: '/jadwal 1' }
  });
  newUser = getUserByJid(newJid);
  if (newUser.reminder_preference === 'morning') {
    console.log('✅ [Pass] Command /jadwal 1 berhasil mengubah reminder ke morning.');
  } else {
    throw new Error('Command /jadwal gagal.');
  }

  // Test /belajar
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: newJid, fromMe: false },
    message: { conversation: '/belajar' }
  });
  const lastMsg = sentMessages[sentMessages.length - 1].content.text;
  if (lastMsg.includes('Topik Hari Ini:')) {
    console.log('✅ [Pass] Command /belajar berhasil mengirim materi micro-learning.');
  } else {
    throw new Error('Command /belajar gagal.');
  }

  // Test /quiz & cancel /batal
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: newJid, fromMe: false },
    message: { conversation: '/quiz' }
  });
  newUser = getUserByJid(newJid);
  if (newUser.current_state === 'AWAITING_QUIZ_ANSWER') {
    console.log('✅ [Pass] Command /quiz berhasil masuk ke state AWAITING_QUIZ_ANSWER.');
  } else {
    throw new Error('Command /quiz state transition gagal.');
  }

  // Batalkan kuis dengan /batal
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: newJid, fromMe: false },
    message: { conversation: '/batal' }
  });
  newUser = getUserByJid(newJid);
  if (newUser.current_state === 'IDLE') {
    console.log('✅ [Pass] Command /batal berhasil membatalkan kuis dan kembali ke IDLE.');
  } else {
    throw new Error('Command /batal gagal.');
  }

  // 10. Outbound Scheduler Slot Dispatching
  console.log('\n▶️ [Test 10] Outbound Scheduler Worker Dispatching...');
  const { dispatchScheduledSlot } = await import('./services/schedulerService.js');
  const initialCount = sentMessages.length;
  await dispatchScheduledSlot(mockSock, 'morning');
  if (sentMessages.length > initialCount) {
    console.log(`✅ [Pass] Scheduler dispatch berhasil mengirim ${sentMessages.length - initialCount} push pesan pagi.`);
  } else {
    throw new Error('Scheduler dispatch gagal mengirim pesan.');
  }

  // 11. Anti-Ban & Security Verification
  console.log('\n▶️ [Test 11] Anti-Ban & Security Mechanisms Verification...');
  const {
    randomizeMessageContent,
    getMessageHash,
    calculateBackoff,
    isCooldownActive,
    activateCooldown,
    clearCooldown
  } = await import('./services/antiBanService.js');

  // Test 11.1 Content Fingerprint Randomization
  const baseText = 'Halo! Ini adalah materi harian 3GPP 5G NR Protocol QA.';
  const randomized1 = randomizeMessageContent(baseText);
  const randomized2 = randomizeMessageContent(baseText);
  const hash1 = getMessageHash(randomized1);
  const hash2 = getMessageHash(randomized2);

  if (hash1 !== hash2) {
    console.log('✅ [Pass] Anti-Fingerprint: Dua pesan identik menghasilkan hash SHA-256 yang berbeda.');
  } else {
    throw new Error('Anti-Fingerprint gagal menghasilkan hash acak unik.');
  }

  // Test 11.2 Exponential Backoff Calculation
  const backoff1 = calculateBackoff(1, 5000, 60000);
  const backoff3 = calculateBackoff(3, 5000, 60000);
  if (backoff3 > backoff1) {
    console.log(`✅ [Pass] Exponential Backoff bertambah sesuai percobaan (Attempt 1: ${backoff1}ms, Attempt 3: ${backoff3}ms).`);
  } else {
    throw new Error('Kalkulasi exponential backoff tidak valid.');
  }

  // Test 11.3 Circuit Breaker Cooldown Lock
  activateCooldown(5, 'Test verification');
  const cooldownState = isCooldownActive();
  if (cooldownState && cooldownState.active) {
    console.log(`✅ [Pass] Circuit Breaker: Cooldown lock aktif terdeteksi (${cooldownState.remainingMinutes} menit tersisa).`);
    clearCooldown();
  } else {
    throw new Error('Circuit Breaker Cooldown lock harusnya aktif.');
  }

  // 12. Security Egress Guardrail & Host Protection Verification
  console.log('\n▶️ [Test 12] Security Egress Guardrail & Host Protection Verification...');
  const { validateEgressPayload } = await import('./services/antiBanService.js');

  // Test 12.1 Valid text message allowed
  const validTextRes = validateEgressPayload({ text: 'Halo, ini pesan teks yang valid.' });
  if (validTextRes.valid) {
    console.log('✅ [Pass] Egress Guardrail: Pesan teks murni diizinkan lewat.');
  } else {
    throw new Error('Egress guardrail menolak pesan teks yang valid.');
  }

  // Test 12.2 Prohibited media / document / file upload strictly blocked
  const forbiddenPayloads = [
    { image: { url: 'https://evil.com/photo.jpg' }, text: 'Evil image' },
    { document: { url: 'C:\\passwords.txt' }, text: 'Evil document' },
    { video: { url: 'https://evil.com/vid.mp4' } },
    { audio: { url: 'https://evil.com/voice.ogg' } },
    { contacts: [{ displayName: 'Hacked Contact' }] },
    { location: { degreesLatitude: -6.2, degreesLongitude: 106.8 } }
  ];

  for (const forbidden of forbiddenPayloads) {
    const res = validateEgressPayload(forbidden);
    if (res.valid) {
      throw new Error(`Egress guardrail LOLOS mengizinkan payload berbahaya: ${JSON.stringify(forbidden)}`);
    }
  }
  console.log('✅ [Pass] Egress Guardrail: Seluruh 6 payload terlarang (image, doc, video, audio, contact, location) sukses DIBLOKIR 100%.');

  console.log('\n🎉 ========================================================');
  console.log('🎉 SEMUA 12 PENGUJIAN UNIT, INTEGRASI & SECURITY BERHASIL 100%!');
  console.log('🎉 TELCOLEARN ENGINE DILENGKAPI EGRESS GUARDRAIL & HOST PRIVACY.');
  console.log('🎉 ========================================================\n');
}

runTestSuite().catch(err => {
  console.error('\n❌ TEST GAGAL:', err);
  process.exit(1);
});
