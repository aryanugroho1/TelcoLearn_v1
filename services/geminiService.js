/**
 * TelcoLearn Gemini 3 Flash Cognitive Reasoning Adapter
 * Integrasi resmi menggunakan SDK @google/genai
 * Berdasarkan Master PRD Section 6
 */

import { GoogleGenAI } from '@google/genai';
import { GEMINI_SYSTEM_INSTRUCTION, MESSAGES } from '../config/constants.js';
import { logLlmConversation, searchKnowledgeBase, getRecentLlmConversation } from '../database/db.js';

let genAIClient = null;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_GEMINI_API_KEY')) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey: apiKey.trim() });
  }
  return genAIClient;
}

/**
 * Execute Gemini model with timeout protection (8000 ms) and multi-version SDK compatibility
 */
async function callGeminiModel(prompt, systemInstruction = GEMINI_SYSTEM_INSTRUCTION, options = {}) {
  const client = getClient();
  if (!client) {
    return {
      success: false,
      error: 'GEMINI_API_KEY belum dikonfigurasi pada file .env',
      text: '⚠️ *Kunci API Gemini belum dikonfigurasi.*\nSilakan tambahkan `GEMINI_API_KEY` pada file `.env` di server TelcoLearn.'
    };
  }

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  const candidateModels = Array.from(new Set([primaryModel, 'gemini-3.5-flash', 'gemini-3.5-flash-lite']));
  const timeoutMs = parseInt(process.env.GEMINI_TIMEOUT_MS || '35000', 10);

  let timer = null;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('LLM_TIMEOUT')), timeoutMs);
  });

  const MAX_RETRIES = 2;

  const executionPromise = (async () => {
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
      const currentModel = candidateModels[attempt - 1] || candidateModels[0];
      try {
        // 1. Coba pola SDK @google/genai v0.1.x / v1.x (models.generateContent)
        if (client.models && typeof client.models.generateContent === 'function') {
          const genConfig = {
            systemInstruction: systemInstruction,
            temperature: 0.2,
            maxOutputTokens: 3072
          };
          // Extended thinking hanya diaktifkan jika analisis log mendalam
          if (options.isLogAnalysis) {
            genConfig.thinkingConfig = {
              thinkingBudget: 1024
            };
          }
          const contents = options.imagePart
            ? [
                {
                  role: 'user',
                  parts: [
                    options.imagePart,
                    { text: typeof prompt === 'string' ? prompt : JSON.stringify(prompt) }
                  ]
                }
              ]
            : prompt;

          const response = await client.models.generateContent({
            model: currentModel,
            contents: contents,
            config: genConfig
          });
          const text = response.text || (response.candidates?.[0]?.content?.parts?.[0]?.text) || '';
          const usageMetadata = response.usageMetadata || {};
          const pTokens = usageMetadata.promptTokenCount || Math.round((prompt.length + 150) / 3.8);
          const oTokens = usageMetadata.candidatesTokenCount || Math.round(text.length / 3.8);
          const tTokens = usageMetadata.totalTokenCount || (pTokens + oTokens);
          return {
            text,
            usage: {
              promptTokens: pTokens,
              outputTokens: oTokens,
              totalTokens: tTokens,
              modelName: currentModel
            }
          };
        }

        // 2. Coba pola SDK @google/genai v2.x (interactions.create)
        if (client.interactions && typeof client.interactions.create === 'function') {
          const interaction = await client.interactions.create({
            model: currentModel,
            input: prompt,
            system_instruction: systemInstruction
          });
          const text = interaction.output_text || '';
          return {
            text,
            usage: {
              promptTokens: Math.round((prompt.length + 150) / 3.8),
              outputTokens: Math.round(text.length / 3.8),
              totalTokens: 0,
              modelName: currentModel
            }
          };
        }

        // 3. Fallback direct call jika ada method getGenerativeModel
        if (typeof client.getGenerativeModel === 'function') {
          const model = client.getGenerativeModel({
            model: currentModel,
            systemInstruction: systemInstruction
          });
          const contentParam = options.imagePart ? [options.imagePart, prompt] : prompt;
          const result = await model.generateContent(contentParam);
          const text = result.response.text();
          return {
            text,
            usage: {
              promptTokens: Math.round((prompt.length + 150) / 3.8),
              outputTokens: Math.round(text.length / 3.8),
              totalTokens: 0,
              modelName: currentModel
            }
          };
        }

        throw new Error('Unsupported @google/genai client structure');
      } catch (err) {
        lastError = err;
        const statusCode = err.status || err.statusCode || (err.error && err.error.code);
        const errMsg = String(err.message || '');
        const isTransient = statusCode === 503 || 
                            statusCode === 429 || 
                            statusCode === 408 || 
                            (statusCode >= 500 && statusCode < 600) ||
                            errMsg.includes('503') ||
                            errMsg.includes('UNAVAILABLE') ||
                            errMsg.includes('high demand') ||
                            errMsg.includes('RESOURCE_EXHAUSTED');

        if (isTransient && attempt <= MAX_RETRIES) {
          const delayMs = attempt * 1500 + Math.floor(Math.random() * 500);
          console.warn(`⚠️ [Gemini Transient ${statusCode || '503'}] Server Google sedang antre/padat. Percobaan ${attempt}/${MAX_RETRIES} gagal. Mencoba ulang otomatis dalam ${delayMs}ms...`);
          await new Promise(r => setTimeout(r, delayMs));
          continue;
        }

        throw err;
      }
    }

    throw lastError || new Error('Gemini API execution failed after retries');
  })();

  try {
    const modelResult = await Promise.race([executionPromise, timeoutPromise]);
    if (timer) clearTimeout(timer);
    const outputText = typeof modelResult === 'string' ? modelResult : (modelResult.text || '');
    return {
      success: true,
      text: outputText.trim(),
      usage: modelResult.usage || {
        promptTokens: Math.round((prompt.length + 150) / 3.8),
        outputTokens: Math.round(outputText.length / 3.8),
        totalTokens: 0,
        modelName
      }
    };
  } catch (err) {
    if (timer) clearTimeout(timer);
    if (err.message === 'LLM_TIMEOUT') {
      console.warn(`⏱️ Gemini API call exceeded ${timeoutMs}ms timeout`);
      let timeoutMessage = '';
      if (options.isLogAnalysis) {
        timeoutMessage = options.isEnglish
          ? '⏱️ *Log analysis took longer than expected.* Please provide a narrower excerpt of your log lines and try again.'
          : '⏱️ *Analisis log memerlukan waktu lebih dari batas waktu yang ditentukan.* Mohon persempit cuplikan baris log Anda atau coba sesaat lagi.';
      } else {
        timeoutMessage = options.isEnglish
          ? '⏱️ *The AI server is experiencing high traffic and took too long to respond.* Please try sending your question again in a moment.'
          : '⏱️ *Server AI sedang mengalami antrean dan memerlukan waktu lebih lama untuk merespons.* Silakan kirimkan kembali pertanyaan Anda sesaat lagi.';
      }
      return {
        success: false,
        error: 'TIMEOUT',
        text: timeoutMessage
      };
    }
    console.error('❌ Error executing Gemini API:', err);
    let fallbackText = '';
    if (options.isLogAnalysis) {
      fallbackText = options.isEnglish
        ? '⚠️ *Sorry, the AI log analysis module encountered a temporary issue.*\nPlease try submitting your log snippet again in a few moments.'
        : MESSAGES.LLM_FALLBACK_ERROR;
    } else {
      fallbackText = options.isEnglish
        ? '⚠️ *Sorry, the AI service is temporarily experiencing high traffic.*\nPlease try asking your question again in a moment.'
        : '⚠️ *Maaf, server AI sedang mengalami antrean beban tinggi sementara.*\nSilakan kirimkan kembali pertanyaan Anda beberapa saat lagi.';
    }
    return {
      success: false,
      error: err.message,
      text: fallbackText
    };
  }
}

/**
 * Menganalisis potongan log radio (QXDM, NAS, RRC, OTA trace)
 */
export async function analyzeTelcoLog(logSnippet, userId = 0) {
  const startTime = Date.now();

  // Safeguard Overload: Batasi cuplikan log maksimal 10.000 karakter agar tidak timeout / overload
  let sanitizedLog = logSnippet;
  if (logSnippet && logSnippet.length > 10000) {
    console.log(`✂️ [Log Truncation] Log panjang terdeteksi (${logSnippet.length} char). Mengambil 10.000 karakter terpenting.`);
    sanitizedLog = logSnippet.slice(0, 10000) + '\n... [Cuplikan log dipotong otomatis agar tidak membebani memori / kuota token]';
  }

  const prompt = `Pelajar mengirimkan cuplikan log protokol radio berikut untuk didiagnosis:

\`\`\`
${sanitizedLog}
\`\`\`

Tolong lakukan triage teknis dengan format WhatsApp:
1. *Root Cause Analysis (RCA)*: Mengapa event/penolakan ini terjadi secara spesifikasi 3GPP.
2. *Dampak pada Perilaku UE*: Bagaimana modem/software stack UE bereaksi (misal: state transition, timers, FPLMN, fallback).
3. *Langkah Verifikasi di Lab Test*: Parameter log selanjutnya yang perlu diperiksa atau aksi uji di lab.

Gunakan tipografi WhatsApp (*bold*, _italic_, \`\`\`code\`\`\`). Jangan gunakan format heading markdown seperti '#' atau tabel.`;

  const isEnglishLog = /\b(analyze|error|reject|cause|failure|log|ue|modem)\b/i.test(logSnippet);
  const result = await callGeminiModel(prompt, GEMINI_SYSTEM_INSTRUCTION, { isLogAnalysis: true, isEnglish: isEnglishLog });
  const latency = Date.now() - startTime;

  // Catat ke audit log di SQLite
  try {
    logLlmConversation(userId, logSnippet, result.text, latency, result.usage || {});
  } catch (dbErr) {
    console.error('Failed to log LLM interaction to SQLite:', dbErr);
  }

  const latencySec = (latency / 1000).toFixed(1);
  const showTokenStats = process.env.SHOW_TOKEN_STATS === 'true';
  const tokenStats = showTokenStats ? `\n\n📊 _Konsumsi Token: ${result.usage?.promptTokens || 0} in / ${result.usage?.outputTokens || 0} out (Total: ${result.usage?.totalTokens || 0} token) | ⏱️ ${latencySec}s_` : '';
  return `${result.text}${tokenStats}`;
}

/**
 * Menjawab pertanyaan umum seputar 4G/5G, O-RAN, dan Machine Learning
 * Menggunakan Hybrid RAG dengan referensi mendalam ShareTechNote
 */
export async function answerGeneralTelcoQuestion(question, userId = 0, options = {}) {
  const { contextTrack } = options;
  const startTime = Date.now();
  const maxHistory = parseInt(process.env.MAX_CONVERSATION_HISTORY || '5', 10);
  const recentHistory = getRecentLlmConversation(userId, maxHistory);

  // Deteksi jika pertanyaan adalah permintaan alih bahasa (misal: "In english please")
  const isLanguageFollowUp = /^\s*(in\s+english\s*(please)?|please\s*in\s*english|translate\s*to\s*english|english\s*version|tolong\s*bahasa\s*inggris|pake\s*bahasa\s*inggris|bahasa\s*inggris\s*dong)\s*$/i.test(question.trim());

  let kbSearchQuery = question;
  if (isLanguageFollowUp && recentHistory.length > 0) {
    kbSearchQuery = recentHistory[recentHistory.length - 1].incoming_query;
  }

  const kbMatch = searchKnowledgeBase(kbSearchQuery);

  let historyContext = '';
  if (recentHistory && recentHistory.length > 0) {
    historyContext = `\n\nRIWAYAT PERCAKAPAN SEBELUMNYA:\n` + recentHistory.map((h, i) => 
      `[Sesi ${i+1}]\nPelajar: "${h.incoming_query}"\nJawaban AI Terakhir:\n${h.ai_response.slice(0, 1000)}...`
    ).join('\n\n');
  }

  let trackContextInstruction = '';
  if (contextTrack === 'drive_test') {
    trackContextInstruction = `\n\nPERSPEKTIF KHUSUS:\nFokuskan penjelasan secara mendalam dari sudut pandang *Field & Drive Test* (pengukuran RF di rute pengujian lapangan, analisis parameter RSRP/RSRQ/SINR/BLER di jalan, penggunaan tool lapangan seperti TEMS/Nemo/Scanner, physical cell issues seperti overshooting/antenna tilt/azimuth/cross feeder, handover coverage di rute perjalanan, dan optimasi radio lapangan).`;
  } else if (contextTrack === 'protocol_qa') {
    trackContextInstruction = `\n\nPERSPEKTIF KHUSUS:\nFokuskan penjelasan secara mendalam dari sudut pandang *4G/5G Protocol QA & Lab Testing* (analisis signaling Layer 3 RRC/NAS, decoding trace modem QXDM/Shannon/PCAP, cause code 3GPP, timers radio T300/T310/T311, dan validasi kepatuhan spesifikasi 3GPP).`;
  } else if (contextTrack === 'ml_telco') {
    trackContextInstruction = `\n\nPERSPEKTIF KHUSUS:\nFokuskan penjelasan secara mendalam dari sudut pandang *Machine Learning Telco Testing* (penerapan data science/AI, deteksi anomali time-series KPI radio, regresi prediktif performa UE/thermal, dan otomatisasi triage log).`;
  } else if (contextTrack === 'log_telco') {
    trackContextInstruction = `\n\nPERSPEKTIF KHUSUS:\nFokuskan penjelasan secara mendalam dari sudut pandang *Log Analysis & Modem Triage* (decoding log QXDM, Shannon, Wireshark PCAP trace, analisis Root Cause Analysis (RCA), failure cause code, paket 0xB0C0, 0xB801, 0xB821, crash stack triage, dan parameter log penting yang perlu diverifikasi).`;
  }

  const followUpInstruction = `\n\nPANDUAN PERTANYAAN LANJUTAN (FOLLOW-UP CONVERSATION):
- Periksa RIWAYAT PERCAKAPAN SEBELUMNYA. Jika pertanyaan pelajar berkaitan atau merupakan tindak lanjut dari pembahasan sebelumnya (seperti HAPS, satelit NTN, biaya CAPEX/OPEX rollout telco, call flow, dll.), Anda WAJIB MENJAWABNYA secara komprehensif dalam konteks topik tersebut. JANGAN PERNAH menolaknya sebagai topik di luar lingkup!`;

  const languageInstruction = `\n\nKETENTUAN BAHASA (BILINGUAL MANDATORY):
- Deteksi bahasa pengguna. Jika pengguna bertanya dalam BAHASA INGGRIS atau meminta ("In english please", "speak english", dll), Anda WAJIB menjawab 100% dalam BAHASA INGGRIS (English) yang fasih, profesional, dan mendalam.
- Jika pengguna bertanya dalam Bahasa Indonesia, jawablah dalam Bahasa Indonesia.
- Jika pengguna meminta "In english please" atau terjemahan dari percakapan sebelumnya, sajikan dan jelaskan kembali topik dari riwayat percakapan secara komprehensif dalam Bahasa Inggris.`;

  let prompt = '';
  if (kbMatch) {
    console.log(`📚 [Hybrid RAG] Menemukan referensi ShareTechNote: "${kbMatch.title}" untuk pertanyaan: "${question}" (Track: ${contextTrack || 'Umum'})`);
    prompt = `Pertanyaan dari pelajar:
"${question}"${historyContext}

REFERENSI PENGETAHUAN RESMI (SHARETECHNOTE KNOWLEDGE BASE):
Topik: ${kbMatch.title} (${kbMatch.category})
Ringkasan: ${kbMatch.summary}
Konten Detail:
${kbMatch.core_content}

Instruksi Menjawab (Standar ShareTechNote untuk WhatsApp):
1. Jawab pertanyaan pelajar secara komprehensif, teknis, dan presisi mengacu pada referensi ShareTechNote di atas dan spesifikasi 3GPP terkini.
2. Jika pertanyaan menyangkut alur/proses (seperti call flow, signal acquisition, RAR, registration), WAJIB gunakan format urutan step-by-step yang rapi dan terstruktur (1️⃣, 2️⃣, 3️⃣ atau 1, 2, 3).
3. Sebutkan nama-nama kanal radio spesifik (seperti PRACH, PDCCH, PDSCH, PBCH, PUSCH, PUCCH) serta Information Element (IE) / RNTI / Timer penting jika relevan.
4. Gunakan tipografi WhatsApp (*bold*, _italic_, \`\`\`code\`\`\`). JANGAN gunakan markdown heading '#' atau format tabel markdown.
5. JANGAN menyertakan URL link luar. Berikan penjelasan mandiri yang lengkap, tuntas sampai kalimat penutup, dan tidak terpotong (panjang ideal: 1.500 - 3.500 karakter).${trackContextInstruction}${followUpInstruction}${languageInstruction}`;
  } else {
    prompt = `Pertanyaan dari pelajar:
"${question}"${historyContext}

Instruksi Menjawab (Standar ShareTechNote untuk WhatsApp):
1. Jawablah secara profesional, mendalam, dan akurat berdasarkan spesifikasi 3GPP (Rel-15 s/d Rel-18) dan standar telekomunikasi (seperti konsep ShareTechNote).
2. Jika pertanyaan mengenai alur kerja atau protokol, gunakan format urutan step-by-step berstruktur lengkap dengan kanal radio & layer terkait.
3. Sebutkan nama-nama kanal radio spesifik (seperti PRACH, PDCCH, PDSCH, PBCH, PUSCH, PUCCH) serta Information Element (IE) penting jika relevan.
4. Gunakan format tipografi WhatsApp (*bold*, _italic_, \`\`\`code\`\`\`). JANGAN gunakan heading '#' atau format tabel markdown.
5. JANGAN sertakan link URL luar. Berikan penjelasan mandiri yang tuntas sampai kalimat penutup, dan tidak terpotong (panjang ideal: 1.500 - 3.500 karakter).${trackContextInstruction}${followUpInstruction}${languageInstruction}`;
  }

  const isEnglishQuestion = /\b(what|how|why|who|when|where|which|can|could|would|should|is|are|do|does|explain|in english|english)\b/i.test(question);
  const result = await callGeminiModel(prompt, GEMINI_SYSTEM_INSTRUCTION, { isLogAnalysis: false, isEnglish: isEnglishQuestion });
  const latency = Date.now() - startTime;

  try {
    logLlmConversation(userId, question, result.text, latency, result.usage || {});
  } catch (dbErr) {
    console.error('Failed to log LLM interaction to SQLite:', dbErr);
  }

  const latencySec = (latency / 1000).toFixed(1);
  const showTokenStats = process.env.SHOW_TOKEN_STATS === 'true';
  const tokenStats = showTokenStats ? `\n\n📊 _Konsumsi Token: ${result.usage?.promptTokens || 0} in / ${result.usage?.outputTokens || 0} out (Total: ${result.usage?.totalTokens || 0} token) | ⏱️ ${latencySec}s_` : '';
  return `${result.text}${tokenStats}`;
}

/**
 * Menganalisis gambar teknis telekomunikasi (Coverage Heatmap, NetMonster, Nemo, TEMS, Spektrum, Arsitektur)
 * Menggunakan Gemini Multimodal Vision dengan kuantifikasi token granular
 */
export async function analyzeTelcoImage(imageBuffer, mimeType = 'image/jpeg', caption = '', userId = 0) {
  const startTime = Date.now();
  const base64Data = imageBuffer.toString('base64');
  const imagePart = {
    inlineData: {
      mimeType: mimeType || 'image/jpeg',
      data: base64Data
    }
  };

  const prompt = `Pelajar/engineer mengirimkan gambar visual telekomunikasi/drive test berikut:
Catatan/Caption dari engineer: "${caption || 'Tolong lakukan evaluasi diagnostik teknis terhadap gambar/heatmap/screenshot ini.'}"

Lakukan analisis teknis mendalam berstandar industri (3GPP / RF Engineering / Drive Testing) dengan format WhatsApp:
1. *Identifikasi Visual & Konteks*: Sebutkan jenis gambar (apakah peta drive test coverage RSRP/SINR, screenshot aplikasi engineering seperti NetMonster/Nemo/TEMS/XCAP/NSG, spectrum analyzer trace, atau diagram protokol/arsitektur) serta komponen utama yang terlihat.
2. *Ekstraksi Parameter & Diagnostik*: Baca dan sebutkan nilai parameter radio yang terlihat (misal: RSRP, RSRQ, SINR, PCI, Band/Frequency, ARFCN, Modulasi/MCS, BLER, atau titik anomali seperti coverage hole / pilot pollution / overshooting).
3. *Evaluasi Kondisi Sinyal & Root Cause*: Evaluasi kualitas link radio berdasarkan kriteria 3GPP (Sangat Baik / Cukup / Buruk) dan apa potensi penyebab masalah yang terdeteksi di gambar.
4. *Rekomendasi Tindakan / Optimasi*: Langkah teknis konkret bagi engineer di lapangan atau optimasi radio (misal: adjustment antenna tilt/azimuth, tuning handover margin, pemeriksaan interferensi eksternal, atau re-drive).

Gunakan tipografi WhatsApp murni (*bold*, _italic_, \`\`\`code\`\`\`). Hindari tabel markdown atau heading '#' yang merusak tampilan ponsel.`;

  const isEnglishImage = /\b(analyze|english|what is|please explain|how to)\b/i.test(caption);
  const result = await callGeminiModel(prompt, GEMINI_SYSTEM_INSTRUCTION, {
    isLogAnalysis: true,
    imagePart,
    isEnglish: isEnglishImage
  });

  const latency = Date.now() - startTime;
  const latencySec = (latency / 1000).toFixed(1);

  try {
    logLlmConversation(userId, `[IMAGE: ${mimeType}] ${caption || 'Coverage/Vision Analysis'}`, result.text, latency, result.usage || {});
  } catch (dbErr) {
    console.error('Failed to log LLM image interaction to SQLite:', dbErr);
  }

  const showTokenStats = process.env.SHOW_TOKEN_STATS === 'true';
  const tokenStats = showTokenStats ? `\n\n📊 _Konsumsi Token: ${result.usage?.promptTokens || 0} in / ${result.usage?.outputTokens || 0} out (Total: ${result.usage?.totalTokens || 0} token) | ⏱️ ${latencySec}s_` : '';
  return `${result.text}${tokenStats}`;
}

/**
 * Menganalisis file dokumen log telekomunikasi (.txt, .csv, .log, .pcap teks, atau mendeteksi file biner .drm)
 */
export async function analyzeTelcoDocument(docBuffer, fileName = 'log.txt', mimeType = 'text/plain', caption = '', userId = 0) {
  const startTime = Date.now();
  const lowerFileName = (fileName || '').toLowerCase();

  // 1. Deteksi file biner proprietary (Accuver XCAL .drm, TEMS .trp, Nemo .nmf, QXDM .isf/.qmdl)
  const isBinaryProprietary = lowerFileName.endsWith('.drm') ||
                              lowerFileName.endsWith('.trp') ||
                              lowerFileName.endsWith('.nmf') ||
                              lowerFileName.endsWith('.isf') ||
                              lowerFileName.endsWith('.qmdl') ||
                              lowerFileName.endsWith('.bin') ||
                              lowerFileName.endsWith('.dat');

  let isBinaryBuffer = false;
  const sampleLength = Math.min(docBuffer.length, 1024);
  for (let i = 0; i < sampleLength; i++) {
    const byte = docBuffer[i];
    if (byte === 0 || (byte < 7 && byte !== 0) || (byte > 14 && byte < 32)) {
      isBinaryBuffer = true;
      break;
    }
  }

  if (isBinaryProprietary || isBinaryBuffer) {
    const ext = fileName.split('.').pop() || 'drm';
    return `⚠️ *File Biner Proprietary Terdeteksi: \`${fileName}\`*

Format file \`.${ext}\` (seperti Accuver XCAL, Keysight Nemo, atau Qualcomm QXDM raw) adalah *Proprietary Binary Encrypted/Compressed Format* yang membutuhkan lisensi decoder desktop (XCAP, Actix Analyzer, atau QCAT).

💡 *Agar AI dapat menganalisisnya secara presisi:*
1️⃣ *Ekspor ke Teks / CSV:* Buka file di software XCAP/Actix Anda, lalu ekspor jendela *Layer 3 Signaling Messages* atau *Event List* ke file \`.txt\` atau \`.csv\`, kemudian kirimkan file teks tersebut ke sini.
2️⃣ *Screenshot Layar:* Cukup foto atau screenshot jendela *Signaling Tree* / *Call Drop Event* di layar laptop Anda, lalu kirimkan gambarnya langsung ke bot ini! AI akan membaca parameter dan grafik via fitur *Computer Vision*. 🚀`;
  }

  // 2. File teks / csv / log / trace
  let textContent = docBuffer.toString('utf-8');
  if (!textContent || textContent.trim().length === 0) {
    return `⚠️ *Dokumen Kosong:* File \`${fileName}\` tidak berisi teks log yang dapat dianalisis.`;
  }

  // Safeguard: Batasi ukuran teks maksimal 12.000 karakter agar hemat token dan tidak timeout
  if (textContent.length > 12000) {
    textContent = textContent.slice(0, 12000) + '\n\n... [Cuplikan dokumen dipotong pada 12.000 karakter pertama agar efisien token & tidak melebihi kuota]';
  }

  const prompt = `Pelajar/engineer mengunggah file dokumen log \`${fileName}\` dengan catatan:
"${caption || 'Tolong lakukan Root Cause Analysis (RCA) dan diagnosis protokol radio terhadap data log ini.'}"

ISI DOKUMEN LOG:
\`\`\`
${textContent}
\`\`\`

Tolong lakukan triage teknis dengan format WhatsApp:
1. *Ringkasan Log & Event Kunci*: Jenis protokol/log yang terdeteksi, timestamp kegagalan, dan pesan L3/KPI penting.
2. *Root Cause Analysis (RCA)*: Mengapa kegagalan/penolakan ini terjadi berdasarkan spesifikasi 3GPP Rel-15 s/d Rel-18.
3. *Dampak pada Modem UE / Jaringan*: Status radio UE (RRC state transition, timers T300/T310/T304, FPLMN, atau fallback).
4. *Rekomendasi Uji Lab & Optimasi*: Parameter yang perlu diverifikasi dan solusi perbaikan di sisi radio/jaringan.

Gunakan tipografi WhatsApp (*bold*, _italic_, \`\`\`code\`\`\`).`;

  const isEnglishDoc = /\b(analyze|english|what is|please explain)\b/i.test(caption || fileName);
  const result = await callGeminiModel(prompt, GEMINI_SYSTEM_INSTRUCTION, {
    isLogAnalysis: true,
    isEnglish: isEnglishDoc
  });

  const latency = Date.now() - startTime;
  const latencySec = (latency / 1000).toFixed(1);

  try {
    logLlmConversation(userId, `[DOC: ${fileName}] ${caption || 'Log Document'}`, result.text, latency, result.usage || {});
  } catch (dbErr) {
    console.error('Failed to log LLM doc interaction to SQLite:', dbErr);
  }

  const showTokenStats = process.env.SHOW_TOKEN_STATS === 'true';
  const tokenStats = showTokenStats ? `\n\n📊 _Konsumsi Token: ${result.usage?.promptTokens || 0} in / ${result.usage?.outputTokens || 0} out (Total: ${result.usage?.totalTokens || 0} token) | ⏱️ ${latencySec}s_` : '';
  return `${result.text}${tokenStats}`;
}
