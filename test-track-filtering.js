import { getDb, createUser, getNextModuleForUser, getNextQuizForUser, markModuleProgress, recordQuizLog, getCategoriesForTrack } from './database/db.js';

const db = getDb();

console.log('🧪 ========================================================');
console.log('🧪 TESTING FOCUS_TRACK FILTERING & CURRICULUM LOOPING');
console.log('🧪 ========================================================\n');

// 1. Test getCategoriesForTrack
console.log('▶️ [Test 1] Category Mapping per Track...');
const pmpCats = getCategoriesForTrack('telco_pmp');
const qaCats = getCategoriesForTrack('protocol_qa');
const mlCats = getCategoriesForTrack('ml_telco');
const dtCats = getCategoriesForTrack('drive_test');

if (!pmpCats.includes('pmp') || pmpCats.length !== 1) throw new Error('pmpCats mapping failed');
if (!qaCats.includes('callflow') || !qaCats.includes('logfile') || !qaCats.includes('architecture')) throw new Error('qaCats mapping failed');
if (qaCats.includes('pmp')) throw new Error('qaCats must not include pmp');
if (!mlCats.includes('ml') || mlCats.includes('pmp')) throw new Error('mlCats mapping failed');
console.log('✅ [Pass] Category mappings validated.');

// Helper to create test user
function setupTestUser(phone, track) {
  const jid = `${phone}@s.whatsapp.net`;
  db.prepare('DELETE FROM quiz_logs WHERE user_id IN (SELECT id FROM users WHERE jid = ?)').run(jid);
  db.prepare('DELETE FROM user_module_progress WHERE user_id IN (SELECT id FROM users WHERE jid = ?)').run(jid);
  db.prepare('DELETE FROM users WHERE jid = ?').run(jid);
  return createUser({
    jid,
    phone_number: phone,
    display_name: `Test ${track}`,
    focus_track: track,
    preferred_language: 'en'
  });
}

// 2. Test Protocol QA user (fresh & exhausted)
console.log('\n▶️ [Test 2] Protocol QA User Module & Quiz Progression...');
const qaUser = setupTestUser('628990001111', 'protocol_qa');

// Fresh user should get first protocol_qa module
let mod = getNextModuleForUser(qaUser.id);
console.log(`Fresh Protocol QA User Next Module: [ID:${mod.id}] ${mod.category} - ${mod.title}`);
if (!qaCats.includes(mod.category)) {
  throw new Error(`Expected category in ${qaCats.join(',')}, got ${mod.category}`);
}
if (mod.category === 'pmp') throw new Error('Protocol QA user must NOT receive PMP module!');

// Mark all protocol_qa modules as completed
const allQaMods = db.prepare(`SELECT id, sequence_order FROM modules WHERE category IN ('callflow', 'logfile', 'architecture') ORDER BY sequence_order ASC`).all();
for (const m of allQaMods) {
  markModuleProgress(qaUser.id, m.id, 'COMPLETED');
}

// Next module must now LOOP within protocol_qa, with is_repeat = true
mod = getNextModuleForUser(qaUser.id);
console.log(`Exhausted Protocol QA User Next Module (Loop): [ID:${mod.id}] ${mod.category} - ${mod.title} (is_repeat: ${mod.is_repeat})`);
if (!qaCats.includes(mod.category)) {
  throw new Error(`Expected looped module in ${qaCats.join(',')}, got ${mod.category}`);
}
if (!mod.is_repeat) {
  throw new Error('Expected is_repeat to be true for looped module');
}
if (mod.id !== allQaMods[0].id) {
  throw new Error(`Expected first module ID ${allQaMods[0].id}, got ${mod.id}`);
}
console.log('✅ [Pass] Protocol QA module progression and looping verified without PMP leak.');

// 3. Test Quiz Filtering for Protocol QA
console.log('\n▶️ [Test 3] Protocol QA Quiz Selection (Never PMP)...');
for (let i = 0; i < 20; i++) {
  const quiz = getNextQuizForUser(qaUser.id);
  const qMod = db.prepare('SELECT category FROM modules WHERE id = ?').get(quiz.module_id);
  if (!qaCats.includes(qMod.category)) {
    throw new Error(`Quiz ${quiz.id} belongs to ${qMod.category}, which is not in Protocol QA!`);
  }
}
console.log('✅ [Pass] 20/20 random quiz samplings strictly stayed in Protocol QA track.');

// Test with malicious / stale preferredModuleId pointing to PMP
const pmpMod = db.prepare("SELECT id FROM modules WHERE category = 'pmp' LIMIT 1").get();
if (pmpMod) {
  const quiz = getNextQuizForUser(qaUser.id, pmpMod.id);
  const qMod = db.prepare('SELECT category FROM modules WHERE id = ?').get(quiz.module_id);
  if (qMod.category === 'pmp') {
    throw new Error('getNextQuizForUser leaked PMP quiz when given stale PMP module_id to a QA user!');
  }
  console.log('✅ [Pass] getNextQuizForUser rejected cross-track preferredModuleId and stayed in QA track.');
}

// 4. Test ML Telco User
console.log('\n▶️ [Test 4] ML Telco User Progression & Quiz Selection...');
const mlUser = setupTestUser('628990002222', 'ml_telco');
const mlMod = getNextModuleForUser(mlUser.id);
if (mlMod.category !== 'ml') throw new Error(`Expected ML category, got ${mlMod.category}`);
const mlQuiz = getNextQuizForUser(mlUser.id);
const mlQMod = db.prepare('SELECT category FROM modules WHERE id = ?').get(mlQuiz.module_id);
if (mlQMod.category !== 'ml') throw new Error(`Expected ML quiz, got ${mlQMod.category}`);
console.log('✅ [Pass] ML Telco user strictly receives ML modules and quizzes.');

// 5. Test Telecom Project Management (PMP) User
console.log('\n▶️ [Test 5] Telecom PMP User Progression & Quiz Selection...');
const pmpUser = setupTestUser('628990003333', 'telco_pmp');
const userPmpMod = getNextModuleForUser(pmpUser.id);
if (userPmpMod.category !== 'pmp') throw new Error(`Expected PMP category, got ${userPmpMod.category}`);
const userPmpQuiz = getNextQuizForUser(pmpUser.id);
const userPmpQMod = db.prepare('SELECT category FROM modules WHERE id = ?').get(userPmpQuiz.module_id);
if (userPmpQMod.category !== 'pmp') throw new Error(`Expected PMP quiz, got ${userPmpQMod.category}`);
console.log('✅ [Pass] Telecom PMP user strictly receives PMP modules and quizzes.');

console.log('\n🎉 ALL TRACK FILTERING & LOOPING TESTS PASSED! 🚀');
process.exit(0);
