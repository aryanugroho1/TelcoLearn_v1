/**
 * TelcoLearn Trivia & Curriculum Looping Test Suite
 */

import {
  getDb,
  getRandomTrivia,
  getAllTrivia,
  formatQuizAsTrivia,
  syncTriviaModulesFromQuizzes,
  getNextModuleForUser,
  markModuleProgress,
  getCategoriesForTrack
} from './database/db.js';
import { handleIncomingMessage } from './services/routerService.js';

console.log('🧪 ========================================================');
console.log('🧪 TESTING TELCO TRIVIA & ROTATIONAL CURRICULUM LOOPING');
console.log('🧪 ========================================================');

// 1. Test formatQuizAsTrivia & getRandomTrivia
console.log('\n▶️ [Test 1] Trivia Generation (Indonesian & English)...');
const db = getDb();
const sampleQuiz = db.prepare('SELECT * FROM quizzes WHERE id = 1').get();

const triviaId = formatQuizAsTrivia(sampleQuiz, 'id');
const triviaEn = formatQuizAsTrivia(sampleQuiz, 'en');

if (!triviaId.includes('TelcoLearn Trivia / Tahukah Anda?') || !triviaId.includes('PFCP')) {
  throw new Error('Indonesian trivia formatting failed!');
}
if (!triviaEn.includes('TelcoLearn Trivia / Did You Know?') || !triviaEn.includes('PFCP')) {
  throw new Error('English trivia formatting failed!');
}
console.log('✅ [Pass] Trivia generation (ID/EN) formatted correctly.');

const randomId = getRandomTrivia(null, 'id');
const randomEn = getRandomTrivia(null, 'en');
if (!randomId || !randomEn) {
  throw new Error('getRandomTrivia failed to return trivia content!');
}
console.log('✅ [Pass] getRandomTrivia returned randomized content.');

const allTrivia = getAllTrivia('id');
if (!Array.isArray(allTrivia) || allTrivia.length < 20) {
  throw new Error(`Expected at least 20 trivia items, got ${allTrivia.length}`);
}
console.log(`✅ [Pass] getAllTrivia retrieved ${allTrivia.length} trivia items.`);

const syncResult = syncTriviaModulesFromQuizzes(db);
if (syncResult.syncedCount < 20) {
  throw new Error(`Expected at least 20 synced trivia modules, got ${syncResult.syncedCount}`);
}
console.log(`✅ [Pass] syncTriviaModulesFromQuizzes successfully auto-converted ${syncResult.syncedCount} Q&A into curriculum modules.`);

// 2. Test Inbound Router /trivia command
console.log('\n▶️ [Test 2] Router Command /trivia & !trivia...');
let lastSent = null;
const mockSock = {
  sendMessage: async (jid, content) => {
    lastSent = { jid, content };
    return { key: { id: 'mock-trivia-' + Date.now() } };
  }
};

await handleIncomingMessage(mockSock, {
  key: { remoteJid: '628990001111@s.whatsapp.net', fromMe: false },
  message: { conversation: '/trivia' }
});

if (!lastSent || !lastSent.content.text.includes('TelcoLearn Trivia')) {
  throw new Error('Router failed to reply to /trivia!');
}
console.log('✅ [Pass] Router successfully handled /trivia command.');

// 3. Test Rotational Curriculum Looping (No Infinite Sticking)
console.log('\n▶️ [Test 3] Rotational Looping (No Sticking on Module 1)...');
const testUserId = 77777;
db.prepare('DELETE FROM user_module_progress WHERE user_id = ?').run(testUserId);
db.prepare('DELETE FROM users WHERE id = ?').run(testUserId);
db.prepare('INSERT INTO users (id, jid, phone_number, display_name, focus_track) VALUES (?, ?, ?, ?, ?)').run(
  testUserId, 'test77777@s.whatsapp.net', '77777', 'Tester Rotation', 'protocol_qa'
);

const cats = getCategoriesForTrack('protocol_qa');
const placeholders = cats.map(() => '?').join(',');
const qaMods = db.prepare(`SELECT id, module_code FROM modules WHERE is_active = 1 AND category IN (${placeholders}) ORDER BY sequence_order ASC`).all(...cats);

// Mark all as completed initially
for (const m of qaMods) {
  markModuleProgress(testUserId, m.id, 'COMPLETED');
}

// Ensure the next 5 calls advance sequentially without getting stuck on Module 1
const seenModules = [];
for (let i = 0; i < Math.min(5, qaMods.length); i++) {
  const next = getNextModuleForUser(testUserId);
  if (!next.is_repeat) {
    throw new Error(`Expected is_repeat to be true in curriculum review mode!`);
  }
  seenModules.push(next.module_code);
  markModuleProgress(testUserId, next.id, 'SENT');
}

console.log('Sequential repeat order observed:', seenModules.join(' -> '));
const uniqueCount = new Set(seenModules).size;
if (uniqueCount !== seenModules.length) {
  throw new Error(`Curriculum loop got stuck! Observed duplicates in consecutive requests: ${seenModules.join(', ')}`);
}
console.log(`✅ [Pass] Rotational curriculum looping verified across ${seenModules.length} consecutive modules without repeating!`);

// Clean up
db.prepare('DELETE FROM user_module_progress WHERE user_id = ?').run(testUserId);
db.prepare('DELETE FROM users WHERE id = ?').run(testUserId);

console.log('\n🎉 ALL TRIVIA & ROTATION TESTS PASSED! 🚀');
process.exit(0);
