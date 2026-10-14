import 'dotenv/config';
import { answerGeneralTelcoQuestion } from './services/geminiService.js';
import { createUser, getUserByJid, getDb } from './database/db.js';

async function testConversationContinuity() {
  console.log('🧪 ========================================================');
  console.log('🧪 PENGUJIAN CONTINUOUS MULTI-TURN QA & CONTEXTUAL ANCHORING');
  console.log('🧪 ========================================================\n');

  const testJid = '6287779998881@s.whatsapp.net';
  let user = getUserByJid(testJid);
  if (!user) {
    user = createUser({
      jid: testJid,
      phone_number: '6287779998881',
      display_name: 'Continuity Tester',
      focus_track: 'protocol_qa',
      reminder_preference: 'all'
    });
  }

  // Clear previous conversation logs for this test user
  const db = getDb();
  db.prepare('DELETE FROM llm_conversation_logs WHERE user_id = ?').run(user.id);

  // Turn 1: Use case throughput
  console.log('▶️ [Turn 1] Pertanyaan 1: "kenapa 5g throughput rendah ketika rsrp dan rsrq bagus?"');
  const startT1 = Date.now();
  const res1 = await answerGeneralTelcoQuestion('kenapa 5g throughput rendah ketika rsrp dan rsrq bagus?', user.id);
  const dur1 = Date.now() - startT1;
  console.log(`⏱️ Selesai dalam: ${dur1} ms`);
  console.log('💬 Cuplikan Jawaban 1:');
  console.log(res1.slice(0, 200) + '...\n');

  if (!res1 || res1.length < 50) {
    throw new Error('Jawaban Turn 1 kosong!');
  }

  // Turn 2: Follow-up question with anaphoric "ini" ("apakah ini 5G SA atau NSA?")
  console.log('▶️ [Turn 2] Pertanyaan 2 (Follow-up): "apakah ini 5G SA atau NSA?"');
  const startT2 = Date.now();
  const res2 = await answerGeneralTelcoQuestion('apakah ini 5G SA atau NSA?', user.id);
  const dur2 = Date.now() - startT2;
  console.log(`⏱️ Selesai dalam: ${dur2} ms`);
  console.log('💬 Jawaban Turn 2:');
  console.log('----------------------------------------------------');
  console.log(res2);
  console.log('----------------------------------------------------');

  // Validasi: Respon WAJIB membahas throughput dalam konteks SA / NSA
  const cleanRes2 = res2.replace(/[_*`]/g, ' ');
  const hasThroughputContext = /\b(throughput|kecepatan|penurunan|sinyal|rsrp|rsrq|anchor|split bearer|gnb|enb|loading|prb|bottleneck)\b/i.test(cleanRes2);
  const hasSAandNSA = /\b(sa|standalone)\b/i.test(cleanRes2) && /\b(nsa|non-standalone)\b/i.test(cleanRes2);
  const isGenericTheoryOnly = res2.startsWith('5G Standalone (SA) adalah arsitektur mandiri');

  if (hasThroughputContext && hasSAandNSA && !isGenericTheoryOnly) {
    console.log('\n✅ [PASS] Bot berhasil mempertahankan konteks use case throughput pada pertanyaan lanjutan!');
    console.log('✅ [PASS] Jawaban membedah kasus throughput pada arsitektur SA vs NSA tanpa terdistraksi teori umum.');
  } else {
    throw new Error('Gagal: Jawaban Turn 2 keluar dari konteks throughput use case!');
  }

  // Token draw-back verification
  const logs = db.prepare('SELECT prompt_tokens, output_tokens, total_tokens, latency_ms FROM llm_conversation_logs WHERE user_id = ? ORDER BY id ASC').all(user.id);
  console.log('\n📊 [Draw-back Capacity Token Check]:');
  logs.forEach((log, idx) => {
    console.log(`Turn ${idx + 1}: Prompt Tokens=${log.prompt_tokens}, Output Tokens=${log.output_tokens}, Latency=${log.latency_ms}ms`);
  });

  if (logs.length === 2 && logs[1].prompt_tokens < 2500) {
    console.log('✅ [PASS] Draw-back capacity token aman (<2500 prompt tokens per follow-up).');
  }

  console.log('\n🎉 SEMUA PENGUJIAN CONVERSATIONAL CONTINUITY SUKSES 100%!');
}

testConversationContinuity().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
