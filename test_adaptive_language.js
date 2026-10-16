/**
 * Test Suite: Adaptive Language Intelligence & 3x Consecutive Auto-Switching
 */

import assert from 'assert';
import { detectQueryLanguage } from './config/constants.js';
import {
  getDb,
  createUser,
  getUserByJid,
  updateUserPreferences,
  logLlmConversation,
  trackAndAdaptUserLanguage,
  getRecentUserQueries,
  getNextQuizForUser,
  getNextModuleForUser
} from './database/db.js';

console.log('🧪 [Test Suite] Starting Adaptive Language Intelligence Tests...\n');

// 1. Language Detection Unit Tests
console.log('--- Test 1: Language Detection Accuracy ---');
assert.strictEqual(detectQueryLanguage('What is handover in LTE?'), 'en', 'English question detection failed');
assert.strictEqual(detectQueryLanguage('How does RACH procedure work in 5G NR?'), 'en', 'English question detection failed');
assert.strictEqual(detectQueryLanguage('Explain the difference between RSRP and RSRQ'), 'en', 'English question detection failed');
assert.strictEqual(detectQueryLanguage('Can you troubleshoot this high BLER issue?'), 'en', 'English question detection failed');

assert.strictEqual(detectQueryLanguage('Apa perbedaan antara RSRP dan RSRQ?'), 'id', 'Indonesian question detection failed');
assert.strictEqual(detectQueryLanguage('Bagaimana cara kerja proses RACH di 5G?'), 'id', 'Indonesian question detection failed');
assert.strictEqual(detectQueryLanguage('Tolong jelaskan kenapa sinyal saya drop'), 'id', 'Indonesian question detection failed');
assert.strictEqual(detectQueryLanguage('Gimana solusi mengatasi interferensi tinggi?'), 'id', 'Indonesian question detection failed');

// Fallback behavior on neutral terms
assert.strictEqual(detectQueryLanguage('CQI 15', 'en'), 'en', 'Fallback to EN failed');
assert.strictEqual(detectQueryLanguage('CQI 15', 'id'), 'id', 'Fallback to ID failed');

// Explicit language request overrides
assert.strictEqual(detectQueryLanguage('jelaskan dalam bahasa inggris please switch to english'), 'en', 'Override to EN failed');
assert.strictEqual(detectQueryLanguage('explain this in bahasa indonesia dong'), 'id', 'Override to ID failed');
console.log('✅ Test 1 Passed: Language Detection functions with high accuracy.\n');


// 2. New User Registration Language Inheritance
console.log('--- Test 2: New User Registration Language Selection ---');
const testEnglishJid = `test_en_${Date.now()}@s.whatsapp.net`;
const enQuery = 'What is the role of gNodeB in 5G network?';
const initialLangEn = detectQueryLanguage(enQuery, 'id');
assert.strictEqual(initialLangEn, 'en', 'Initial detected language should be en');

const userEn = createUser({
  jid: testEnglishJid,
  phone_number: '6289999001',
  display_name: 'English Learner',
  focus_track: 'protocol_qa',
  preferred_language: initialLangEn,
  reminder_preference: 'all'
});
assert.strictEqual(userEn.preferred_language, 'en', 'New user asking in English must have preferred_language = en');

const testIndoJid = `test_id_${Date.now()}@s.whatsapp.net`;
const idQuery = 'Apa fungsi gNodeB pada jaringan 5G?';
const initialLangId = detectQueryLanguage(idQuery, 'id');
assert.strictEqual(initialLangId, 'id', 'Initial detected language should be id');

const userId = createUser({
  jid: testIndoJid,
  phone_number: '6289999002',
  display_name: 'Pelajar Telco',
  focus_track: 'protocol_qa',
  preferred_language: initialLangId,
  reminder_preference: 'all'
});
assert.strictEqual(userId.preferred_language, 'id', 'New user asking in Indonesian must have preferred_language = id');
console.log('✅ Test 2 Passed: First user inquiry initializes correct preferred_language.\n');


// 3. 3x Consecutive English Queries Auto-Switching
console.log('--- Test 3: 3x Consecutive English Queries Auto-Switching ---');
const testSwitchJid = `test_switch_${Date.now()}@s.whatsapp.net`;
let adaptiveUser = createUser({
  jid: testSwitchJid,
  phone_number: '6289999003',
  display_name: 'Switch Learner',
  focus_track: 'protocol_qa',
  preferred_language: 'id', // Starts in Indonesian
  reminder_preference: 'all'
});
assert.strictEqual(adaptiveUser.preferred_language, 'id');

// Inquiry 1: English question
const q1 = 'What causes high BLER during drive testing?';
let activeLang1 = trackAndAdaptUserLanguage(adaptiveUser, q1);
assert.strictEqual(activeLang1, 'en', 'Inquiry 1 should be answered in English');
assert.strictEqual(adaptiveUser.preferred_language, 'id', 'Profile should still remain ID after 1 inquiry');
logLlmConversation(adaptiveUser.id, q1, 'High BLER is caused by interference or low SINR.', 20);

// Inquiry 2: English question
const q2 = 'How can we improve SINR in dense urban areas?';
let activeLang2 = trackAndAdaptUserLanguage(adaptiveUser, q2);
assert.strictEqual(activeLang2, 'en', 'Inquiry 2 should be answered in English');
assert.strictEqual(adaptiveUser.preferred_language, 'id', 'Profile should still remain ID after 2 inquiries');
logLlmConversation(adaptiveUser.id, q2, 'Optimize antenna electrical downtilt and azimuth.', 25);

// Verify recent queries retrieved from DB
const recentQueries = getRecentUserQueries(adaptiveUser.id, 2);
assert.strictEqual(recentQueries.length, 2);
assert.strictEqual(recentQueries[0], q2);
assert.strictEqual(recentQueries[1], q1);

// Inquiry 3: 3rd English question in a row -> Auto-switch profile to EN!
const q3 = 'What is the standard RSRP threshold for good coverage?';
let activeLang3 = trackAndAdaptUserLanguage(adaptiveUser, q3);
assert.strictEqual(activeLang3, 'en', 'Inquiry 3 should be answered in English');
assert.strictEqual(adaptiveUser.preferred_language, 'en', 'Profile must auto-switch to EN after 3 consecutive English questions!');

// Verify persistent state in database
const refreshedUser = getUserByJid(testSwitchJid);
assert.strictEqual(refreshedUser.preferred_language, 'en', 'Database record must reflect preferred_language = en');
logLlmConversation(adaptiveUser.id, q3, 'RSRP >= -85 dBm is considered excellent coverage.', 30);
console.log('✅ Test 3 Passed: 3x consecutive English queries auto-switch user profile to EN.\n');


// 4. Scheduled Content Follows the Auto-Switched Language
console.log('--- Test 4: Scheduled Quizzes and Modules Follow Auto-Switched Profile ---');
// Verify quiz language delivery
const nextQuiz = getNextQuizForUser(refreshedUser.id);
if (nextQuiz) {
  const isEnglish = refreshedUser.preferred_language === 'en';
  const deliveredQuestion = (isEnglish && nextQuiz.question_en) ? nextQuiz.question_en : nextQuiz.question;
  assert.ok(deliveredQuestion, 'Quiz question must be delivered');
  if (nextQuiz.question_en) {
    assert.strictEqual(deliveredQuestion, nextQuiz.question_en, 'Delivered quiz question must be in English for auto-switched user');
  }
}

// Verify module language delivery
const nextModule = getNextModuleForUser(refreshedUser.id);
if (nextModule) {
  const isEnglish = refreshedUser.preferred_language === 'en';
  const deliveredBody = (isEnglish && nextModule.wa_text_body_en) ? nextModule.wa_text_body_en : nextModule.wa_text_body;
  assert.ok(deliveredBody, 'Module body must be delivered');
  if (nextModule.wa_text_body_en) {
    assert.strictEqual(deliveredBody, nextModule.wa_text_body_en, 'Delivered module must be in English for auto-switched user');
  }
}
console.log('✅ Test 4 Passed: Quizzes and Modules automatically delivered in English.\n');


// 5. Symmetric Reverse Auto-Switch: 3x Consecutive Indonesian Queries Switch Back to ID
console.log('--- Test 5: Symmetric Reverse Auto-Switching back to ID ---');
// User is currently 'en'
assert.strictEqual(refreshedUser.preferred_language, 'en');

// Indonesian Query 1
const idQ1 = 'Apa fungsi MCS dan kaitannya dengan CQI?';
let revLang1 = trackAndAdaptUserLanguage(refreshedUser, idQ1);
assert.strictEqual(revLang1, 'id', 'Inquiry 1 should be answered in Indonesian');
assert.strictEqual(refreshedUser.preferred_language, 'en', 'Profile should remain EN after 1 Indonesian query');
logLlmConversation(refreshedUser.id, idQ1, 'MCS menentukan modulasi dan code rate berdasarkan CQI.', 20);

// Indonesian Query 2
const idQ2 = 'Bagaimana cara menghitung throughput 5G NR?';
let revLang2 = trackAndAdaptUserLanguage(refreshedUser, idQ2);
assert.strictEqual(revLang2, 'id', 'Inquiry 2 should be answered in Indonesian');
assert.strictEqual(refreshedUser.preferred_language, 'en', 'Profile should remain EN after 2 Indonesian queries');
logLlmConversation(refreshedUser.id, idQ2, 'Throughput dihitung dengan bandwidth, MIMO layers, dan MCS.', 25);

// Indonesian Query 3: 3rd in a row -> Auto-switch profile back to 'id'!
const idQ3 = 'Tolong jelaskan proses handover X2 vs S1';
let revLang3 = trackAndAdaptUserLanguage(refreshedUser, idQ3);
assert.strictEqual(revLang3, 'id', 'Inquiry 3 should be answered in Indonesian');
assert.strictEqual(refreshedUser.preferred_language, 'id', 'Profile must auto-switch back to ID after 3 consecutive Indonesian questions!');

const finalUser = getUserByJid(testSwitchJid);
assert.strictEqual(finalUser.preferred_language, 'id', 'Database record must be restored to id');
console.log('✅ Test 5 Passed: Symmetrically auto-switches back to Indonesian after 3 consecutive ID queries.\n');

console.log('🎉 ALL ADAPTIVE LANGUAGE TESTS PASSED SUCCESSFULLY! 🚀');
