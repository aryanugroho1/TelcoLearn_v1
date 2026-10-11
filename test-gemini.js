/**
 * Gemini Cognitive Reasoning Integration Test
 * Menguji adapter Gemini 3 Flash / 2.5 Flash
 */

import 'dotenv/config';
import { analyzeTelcoLog, answerGeneralTelcoQuestion } from './services/geminiService.js';

async function testGeminiIntegration() {
  console.log('🤖 Menguji Integrasi Gemini Adapter...');

  const sampleLog = `RRCConnectionReject-r8-IEs: waitTime: 16
Nas Reject Cause: 5GMM cause = 11 (PLMN not allowed)`;

  console.log('📝 Mengirim sampel log radio:');
  console.log(sampleLog);
  console.log('\n⏳ Menunggu respon dari Gemini Adapter...');

  const result = await analyzeTelcoLog(sampleLog, 1);
  console.log('\n💬 Respon Adapter:');
  console.log('----------------------------------------------------');
  console.log(result);
  console.log('----------------------------------------------------');

  if (result && result.length > 20) {
    console.log('✅ Adapter Gemini berfungsi dengan baik (graceful handling / API call berhasil).');
  } else {
    throw new Error('Hasil respon Gemini kosong');
  }

  console.log('\n🇬🇧 Menguji Pertanyaan Bahasa Inggris (Bilingual check)...');
  const englishQ = 'Explain the Random Access Procedure (RACH) in LTE briefly.';
  const englishRes = await answerGeneralTelcoQuestion(englishQ, 1);
  console.log('\n💬 Respon Bahasa Inggris:');
  console.log('----------------------------------------------------');
  console.log(englishRes.slice(0, 300) + '...');
  console.log('----------------------------------------------------');

  if (/\b(random access|preamble|timing advance|contention|rach)\b/i.test(englishRes)) {
    console.log('✅ [Pass] Gemini berhasil merespon pertanyaan bahasa Inggris dalam bahasa Inggris!');
  } else {
    throw new Error('Gemini gagal merespon dalam bahasa Inggris.');
  }
}

testGeminiIntegration().catch(err => {
  console.error('❌ Gagal menguji Gemini:', err);
  process.exit(1);
});
