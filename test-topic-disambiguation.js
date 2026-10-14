import 'dotenv/config';
import { evaluateConversationContext, extractTopicKeywords } from './services/geminiService.js';
import { handleIncomingMessage } from './services/routerService.js';
import { createUser, getUserByJid, getDb, clearLlmConversation, logLlmConversation } from './database/db.js';

async function runTopicDisambiguationTests() {
  console.log('🧪 ========================================================');
  console.log('🧪 UNIT & INTEGRATION TEST: TOPIC DISAMBIGUATION & CONFIRM');
  console.log('🧪 ========================================================\n');

  // Test 1: Unit Test Evaluator Logic
  console.log('▶️ [Test 1] Unit Test: evaluateConversationContext');
  const mockHistory = [
    { incoming_query: 'apa fungsi dan cara kerja rrc inactivity timer di lte?', ai_response: 'RRC Inactivity timer...' }
  ];

  // 1.1 Direct follow-up with continuity starter
  const evalFollowUp1 = evaluateConversationContext('terus dampaknya ke UE apa?', mockHistory);
  console.log('  1.1 "terus dampaknya ke UE apa?":', evalFollowUp1.reason);
  if (!evalFollowUp1.isFollowUp || evalFollowUp1.needsConfirmation) {
    throw new Error('1.1 Gagal: seharusnya isFollowUp=true, needsConfirmation=false');
  }

  // 1.2 Direct follow-up with language switch
  const evalFollowUp2 = evaluateConversationContext('in english please', mockHistory);
  console.log('  1.2 "in english please":', evalFollowUp2.reason);
  if (!evalFollowUp2.isFollowUp || evalFollowUp2.needsConfirmation) {
    throw new Error('1.2 Gagal: seharusnya isFollowUp=true, needsConfirmation=false');
  }

  // 1.3 Direct follow-up with explicit reference
  const evalFollowUp3 = evaluateConversationContext('pada kasus tadi timer standarnya berapa?', mockHistory);
  console.log('  1.3 "pada kasus tadi...":', evalFollowUp3.reason);
  if (!evalFollowUp3.isFollowUp || evalFollowUp3.needsConfirmation) {
    throw new Error('1.3 Gagal: seharusnya isFollowUp=true, needsConfirmation=false');
  }

  // 1.4 Disjoint topic (eSIM Transfer) - Should ask for confirmation!
  const evalDisjoint1 = evaluateConversationContext('esim transfer mekanisme', mockHistory);
  console.log('  1.4 "esim transfer mekanisme":', evalDisjoint1.reason, 'needsConfirmation:', evalDisjoint1.needsConfirmation);
  if (evalDisjoint1.isFollowUp || !evalDisjoint1.needsConfirmation) {
    throw new Error('1.4 Gagal: seharusnya isFollowUp=false, needsConfirmation=true');
  }

  // 1.5 Disjoint topic with conversational "itu" ("mekanisme transfer esim itu gimana?")
  const evalDisjoint2 = evaluateConversationContext('mekanisme transfer esim itu gimana?', mockHistory);
  console.log('  1.5 "mekanisme transfer esim itu gimana?":', evalDisjoint2.reason, 'needsConfirmation:', evalDisjoint2.needsConfirmation);
  if (evalDisjoint2.isFollowUp || !evalDisjoint2.needsConfirmation) {
    throw new Error('1.5 Gagal: seharusnya isFollowUp=false, needsConfirmation=true');
  }

  console.log('✅ [Pass] Unit Test evaluateConversationContext berhasil 100%!\n');

  // Test 2: Full State Machine Integration Test
  console.log('▶️ [Test 2] State Machine Integration Test: AWAITING_TOPIC_CONFIRM');
  const testJid = '6289911223344@s.whatsapp.net';
  let user = getUserByJid(testJid);
  if (!user) {
    user = createUser({
      jid: testJid,
      phone_number: '6289911223344',
      display_name: 'Topic Tester',
      focus_track: 'protocol_qa',
      reminder_preference: 'all'
    });
  }

  // Reset database state & logs for this user
  clearLlmConversation(user.id);
  const db = getDb();
  db.prepare('UPDATE users SET current_state = ?, state_payload = NULL WHERE id = ?').run('IDLE', user.id);

  let capturedReplies = [];
  const mockSock = {
    user: { id: 'bot@s.whatsapp.net' },
    sendPresenceUpdate: async () => {},
    sendMessage: async (jid, content) => {
      capturedReplies.push({ jid, content });
      return { key: { id: `msg-${Date.now()}` } };
    }
  };

  // 2.1 User starts by asking about RRC Inactivity (Logged as past interaction)
  logLlmConversation(
    user.id,
    'apa fungsi dan cara kerja rrc inactivity timer?',
    'RRC Inactivity timer digunakan eNodeB untuk memindahkan status UE dari RRC_CONNECTED ke RRC_IDLE.',
    1200,
    { promptTokens: 300, outputTokens: 200, totalTokens: 500 }
  );
  console.log('  2.1 Riwayat tanya jawab RRC Inactivity tersimpan di database.');

  // 2.2 User sends a completely new topic: "esim transfer mekanisme"
  capturedReplies = [];
  console.log('  2.2 Mengirim pesan: "esim transfer mekanisme"...');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false, id: 'inbound-1' },
    message: { conversation: 'esim transfer mekanisme' }
  });

  user = getUserByJid(testJid);
  console.log(`      Current user state: ${user.current_state}`);
  console.log(`      Reply received:\n"${capturedReplies[0]?.content?.text?.slice(0, 160)}..."`);

  if (user.current_state !== 'AWAITING_TOPIC_CONFIRM') {
    throw new Error(`2.2 Gagal: State harus AWAITING_TOPIC_CONFIRM, tapi mendapatkan: ${user.current_state}`);
  }

  const hasConfirmText = capturedReplies[0]?.content?.text?.includes('Konfirmasi Topik Diskusi') &&
                         capturedReplies[0]?.content?.text?.includes('Topik Baru');
  if (!hasConfirmText) {
    throw new Error('2.2 Gagal: Bot tidak mengirim pertanyaan konfirmasi topik!');
  }
  console.log('  ✅ [Pass] Bot berhasil mendeteksi topik berbeda dan menanyakan balik ke user!');

  // 2.3 User responds with "1" (Topik Baru)
  capturedReplies = [];
  console.log('  2.3 User membalas "1" (Pilih Topik Baru)...');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false, id: 'inbound-2' },
    message: { conversation: '1' }
  });

  user = getUserByJid(testJid);
  console.log(`      Current user state: ${user.current_state}`);
  console.log(`      Reply received count: ${capturedReplies.length}`);

  if (user.current_state !== 'IDLE') {
    throw new Error(`2.3 Gagal: State setelah konfirmasi harus kembali ke IDLE, tapi mendapatkan: ${user.current_state}`);
  }
  console.log('  ✅ [Pass] State berhasil kembali ke IDLE dan jawaban diproses secara bersih!');

  // Test 3: Manual Reset Slash Commands (/clear, /topikbaru)
  console.log('\n▶️ [Test 3] Slash Command: /topikbaru & /clear');
  capturedReplies = [];
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false, id: 'inbound-3' },
    message: { conversation: '/topikbaru' }
  });

  const clearAck = capturedReplies[0]?.content?.text;
  if (!clearAck || !clearAck.includes('Topik Diskusi Berhasil Direset')) {
    throw new Error('3.1 Gagal: Respon command /topikbaru tidak sesuai!');
  }
  console.log('  ✅ [Pass] Command /topikbaru berhasil me-reset memori percakapan.');

  console.log('\n🎉 SEMUA PENGUJIAN TOPIC DISAMBIGUATION & STATE MACHINE SUKSES 100%!');
  process.exit(0);
}

runTopicDisambiguationTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
