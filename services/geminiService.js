/**
 * TelcoLearn Gemini 3 Flash Cognitive Reasoning Adapter
 * Integrasi resmi menggunakan SDK @google/genai
 * Berdasarkan Master PRD Section 6
 */

import { GoogleGenAI } from '@google/genai';
import { GEMINI_SYSTEM_INSTRUCTION, MESSAGES } from '../config/constants.js';
import { logLlmConversation, searchKnowledgeBase, getRecentLlmConversation } from '../database/db.js';
import { getCachedResponse, setCachedResponse } from './cacheService.js';

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
export async function callGeminiModel(prompt, systemInstruction = GEMINI_SYSTEM_INSTRUCTION, options = {}) {
  const client = getClient();
  if (!client) {
    return {
      success: false,
      error: 'GEMINI_API_KEY belum dikonfigurasi pada file .env',
      text: '⚠️ *Kunci API Gemini belum dikonfigurasi.*\nSilakan tambahkan `GEMINI_API_KEY` pada file `.env` di server TelcoLearn.'
    };
  }

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
  const candidateModels = options.isLogAnalysis
    ? Array.from(new Set([
        'gemini-3.1-flash-lite',
        'gemini-flash-lite-latest',
        'gemini-3.5-flash-lite',
        primaryModel
      ]))
    : Array.from(new Set([
        primaryModel,
        'gemini-flash-lite-latest',
        'gemini-3.1-flash-lite',
        'gemini-3.5-flash-lite'
      ]));
  const timeoutMs = parseInt(process.env.GEMINI_TIMEOUT_MS || '45000', 10);
  const perAttemptTimeoutMs = parseInt(process.env.GEMINI_PER_ATTEMPT_TIMEOUT_MS || '14000', 10);

  let timer = null;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('LLM_TIMEOUT')), timeoutMs);
  });

  const MAX_RETRIES = 2;

  const executionPromise = (async () => {
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
      const currentModel = candidateModels[attempt - 1] || candidateModels[0];
      
      // Watchdog Per-Attempt: Jangan biarkan 1 model menggantung seluruh 45s
      let attemptTimer = null;
      const attemptTimeoutPromise = new Promise((_, reject) => {
        attemptTimer = setTimeout(() => reject(new Error(`ATTEMPT_TIMEOUT_${currentModel}`)), perAttemptTimeoutMs);
      });

      const singleAttemptExecution = async () => {
        // 1. Coba pola SDK @google/genai v0.1.x / v1.x (models.generateContent)
        if (client.models && typeof client.models.generateContent === 'function') {
          const genConfig = {
            systemInstruction: systemInstruction,
            temperature: 0.2,
            maxOutputTokens: 2048
          };
          // Extended thinking hanya diaktifkan jika konfigurasi GEMINI_THINKING_BUDGET > 0
          const thinkingBudget = parseInt(process.env.GEMINI_THINKING_BUDGET || '0', 10);
          if (options.isLogAnalysis && thinkingBudget > 0) {
            genConfig.thinkingConfig = {
              thinkingBudget
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
            : (Array.isArray(prompt) ? prompt : prompt);

          const response = await client.models.generateContent({
            model: currentModel,
            contents: contents,
            config: genConfig
          });
          const text = response.text || (response.candidates?.[0]?.content?.parts?.[0]?.text) || '';
          const usageMetadata = response.usageMetadata || {};
          const promptCharLength = typeof prompt === 'string' ? prompt.length : JSON.stringify(prompt).length;
          const pTokens = usageMetadata.promptTokenCount || Math.round((promptCharLength + 150) / 3.8);
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
      };

      try {
        const attemptResult = await Promise.race([singleAttemptExecution(), attemptTimeoutPromise]);
        if (attemptTimer) clearTimeout(attemptTimer);
        return attemptResult;
      } catch (err) {
        if (attemptTimer) clearTimeout(attemptTimer);
        lastError = err;
        const isAttemptTimeout = err.message && err.message.startsWith('ATTEMPT_TIMEOUT_');
        const statusCode = err.status || err.statusCode || (err.error && err.error.code);
        const errMsg = String(err.message || '');
        const isTransient = isAttemptTimeout ||
                            statusCode === 503 || 
                            statusCode === 429 || 
                            statusCode === 408 || 
                            (statusCode >= 500 && statusCode < 600) ||
                            errMsg.includes('503') ||
                            errMsg.includes('UNAVAILABLE') ||
                            errMsg.includes('high demand') ||
                            errMsg.includes('RESOURCE_EXHAUSTED');

        if (isTransient && attempt <= MAX_RETRIES) {
          const nextModel = candidateModels[attempt] || candidateModels[0];
          console.warn(`⚠️ [Gemini Rapid Fallback] Model '${currentModel}' ${isAttemptTimeout ? `tidak merespons dalam ${perAttemptTimeoutMs}ms` : `mengalami antrean/transient error (${statusCode || errMsg})`}. Mengalihkan instan ke model cadangan '${nextModel}' (Percobaan ${attempt}/${MAX_RETRIES})...`);
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
 * Mengekstrak kata kunci teknis dari teks untuk komparasi topik
 */
export function extractTopicKeywords(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !/^(dan|yang|atau|untuk|pada|dari|dengan|dalam|ke|di|ini|itu|apa|bagaimana|kenapa|mengapa|apakah|bisa|tolong|dong|adalah|yaitu|cara|maksud|tentang|seperti|hal|nya|saja|juga|kok|deh|nih|tuh|gimana|kalo|kalau|saat|bila|jika)$/i.test(w));
}

/**
 * Mendeteksi apakah pertanyaan merupakan lanjutan kontekstual (Follow-Up)
 * atau pergeseran topik baru yang independen (Topic Shift),
 * serta menentukan apakah perlu konfirmasi interaktif ke pengguna.
 */
export function evaluateConversationContext(question, recentHistory) {
  if (!recentHistory || recentHistory.length === 0) {
    return { isFollowUp: false, needsConfirmation: false, reason: 'NO_RECENT_HISTORY' };
  }

  const cleanQ = question.trim().toLowerCase();
  const lastInteraction = recentHistory[recentHistory.length - 1];
  const lastTopic = (lastInteraction?.incoming_query || '').toLowerCase();

  // 1. Permintaan bahasa (misal: "In English please")
  const isLanguageFollowUp = /^\s*(in\s+english\s*(please)?|please\s*in\s*english|translate\s*to\s*english|english\s*version|tolong\s*bahasa\s*inggris|pake\s*bahasa\s*inggris|bahasa\s*inggris\s*dong)\s*$/i.test(question.trim());
  if (isLanguageFollowUp) {
    return { isFollowUp: true, needsConfirmation: false, reason: 'LANGUAGE_SWITCH' };
  }

  // 2. Deteksi Kata Rujukan Eksplisit (Anaphoric / Deictic References)
  // Menunjuk langsung ke kasus sebelumnya, misal: "kasus ini", "masalah tadi", "kondisi tersebut", "penjelasan tadi"
  const hasExplicitReference = /\b(kasus\s*(ini|itu|tadi|tersebut)|masalah\s*(ini|itu|tadi|tersebut)|skenario\s*(ini|itu|tadi|tersebut)|kondisi\s*(ini|itu|tadi|tersebut)|penjelasan\s*(ini|tadi|tersebut)|tadi\s*kan|yang\s*tadi|dari\s*jawaban\s*(tadi|di\s*atas)|pada\s*sa\s*atau\s*nsa|sa\s*atau\s*nsa)\b/i.test(cleanQ);
  if (hasExplicitReference) {
    return { isFollowUp: true, needsConfirmation: false, reason: 'EXPLICIT_REFERENCE' };
  }

  // 3. Konjungsi Lanjutan Percakapan di Awal Kalimat (Continuity Conjunctions)
  // e.g., "terus solusinya apa?", "lalu apa dampaknya?", "berarti UE detach?", "nah kalau di 5G?"
  const hasContinuityStarter = /^(terus\b|lalu\b|selanjutnya\b|berarti\b|artinya\b|nah\s*kalau\b|nah\s*terus\b|jadi\s*kalau\b|kalau\s*gitu\b|kalo\s*gitu\b|kalau\s*begitu\b)/i.test(cleanQ);
  if (hasContinuityStarter) {
    return { isFollowUp: true, needsConfirmation: false, reason: 'CONTINUITY_STARTER' };
  }

  // 4. Kalimat Elipsis / Pendek Tanpa Subjek Lengkap (<40 karakter)
  // misal: "kenapa?", "solusinya apa?", "kalau di 4G?", "berapa timernya?"
  const isShortElliptical = cleanQ.length < 40 && (
    /^(kenapa|mengapa|solusinya|apa\s*solusinya|apa\s*efeknya|dampaknya|contohnya|berapa\b|bagaimana\s*solusinya)\b/i.test(cleanQ) ||
    /^(kalau|kalo|pada)\s*(di\s*)?(5g|4g|sa|nsa|lte|nr)\b/i.test(cleanQ)
  );
  if (isShortElliptical) {
    return { isFollowUp: true, needsConfirmation: false, reason: 'SHORT_ELLIPTICAL' };
  }

  // 5. Evaluasi Overlap Kata Kunci Teknis
  const newKeywords = extractTopicKeywords(cleanQ);
  const oldKeywords = extractTopicKeywords(lastTopic);

  const overlap = newKeywords.filter(k => oldKeywords.includes(k));
  const overlapRatio = newKeywords.length > 0 ? overlap.length / newKeywords.length : 0;

  // Jika kata kunci teknis tumpang tindih tinggi (>= 40%), pasti pembahasan topik terkait
  if (overlapRatio >= 0.4) {
    return { isFollowUp: true, needsConfirmation: false, reason: 'STRONG_KEYWORD_OVERLAP', overlapRatio };
  }

  // Jika overlap rendah (< 40%) saat ada riwayat sesi aktif:
  // Butuh konfirmasi interaktif ke pengguna agar topik lama (misal: RRC Inactivity)
  // tidak ter-mix dengan topik baru (misal: eSIM Transfer)
  return {
    isFollowUp: false,
    needsConfirmation: true,
    reason: 'TOPIC_DISJOINT_NEED_CONFIRM',
    lastTopic: lastInteraction?.incoming_query || '',
    overlapRatio
  };
}

/**
 * Menjawab pertanyaan umum seputar 4G/5G, O-RAN, dan Machine Learning
 * Menggunakan Continuous Multi-Turn Context, Smart RAG Gating, dan Draw-Back Capacity Token
 */
export async function answerGeneralTelcoQuestion(question, userId = 0, options = {}) {
  const { contextTrack, forceNewTopic = false, forceFollowUp = false } = options;
  const startTime = Date.now();

  // DRAW-BACK CAPACITY TOKEN & TEMPORAL SESSION WINDOW:
  // Batasi riwayat maksimal 3 percakapan dan kedaluwarsa setelah 20 menit (mencegah topik pagi terbawa ke siang)
  const maxHistory = parseInt(process.env.MAX_CONVERSATION_HISTORY || '3', 10);
  const sessionTimeoutMinutes = parseInt(process.env.CONVERSATION_SESSION_TIMEOUT_MINUTES || '20', 10);
  const recentHistory = forceNewTopic ? [] : getRecentLlmConversation(userId, maxHistory, sessionTimeoutMinutes);

  // 1. Deteksi Pertanyaan Lanjutan Kontekstual vs Pergeseran Topik Baru
  let isConversationalFollowUp = false;
  let contextEval = { isFollowUp: false, reason: 'NO_RECENT_HISTORY' };

  if (forceFollowUp && recentHistory.length > 0) {
    isConversationalFollowUp = true;
    contextEval = { isFollowUp: true, reason: 'USER_CONFIRMED_FOLLOW_UP' };
  } else if (!forceNewTopic && recentHistory.length > 0) {
    contextEval = evaluateConversationContext(question, recentHistory);
    isConversationalFollowUp = contextEval.isFollowUp;
  }

  const lastInteraction = recentHistory[recentHistory.length - 1];
  const lastTopic = lastInteraction?.incoming_query || '';

  // 1.5 DYNAMIC RESPONSE CACHE (PostgreSQL Coolify / SQLite)
  // Cek cache untuk pertanyaan mandiri non-followup
  if (!isConversationalFollowUp) {
    try {
      const cached = await getCachedResponse(question);
      if (cached) {
        const latency = Date.now() - startTime;
        console.log(`⚡ [Cache Hit] '${question.slice(0, 45)}...' ditemukan di cache (${cached.driver}). Menjawab seketika.`);
        try {
          logLlmConversation(userId, question, cached.text, latency, cached.usage);
        } catch (dbErr) {}

        const showTokenStats = process.env.SHOW_TOKEN_STATS === 'true';
        const tokenStats = showTokenStats 
          ? `\n\n⚡ _Respon Instan (Cache ${cached.driver}) | 0 Token | ⏱️ ${(latency / 1000).toFixed(2)}s_` 
          : '';
        return `${cached.text}${tokenStats}`;
      }
    } catch (cacheErr) {
      console.warn('⚠️ [Cache Lookup Warning]:', cacheErr.message);
    }
  }

  // 2. Smart RAG Gating:
  // JANGAN jalankan pencarian RAG artikel umum jika ini adalah follow-up lanjutan dari use-case aktif!
  let kbMatch = null;
  if (!isConversationalFollowUp) {
    kbMatch = searchKnowledgeBase(question);
  } else if (contextEval.reason === 'LANGUAGE_SWITCH' && lastTopic) {
    kbMatch = searchKnowledgeBase(lastTopic);
  }

  // 3. Perspectives & Instructions
  // 3. Dynamic Chameleon Perspective & Domain Detection
  const lowerQ = question.toLowerCase();
  const isCoreDomain = /\b(5gc|amf|smf|upf|pcf|udm|ausf|nrf|nssf|nef|sba|epc|mme|sgw|pgw|hss|ims|sip|sdp|volte|vonr|n2|n3|n4|s1-mme|s1-u|diameter|pdu session|qos flow|5qi|qci)\b/i.test(lowerQ);
  const isOranDomain = /\b(o-ran|oran|open ran|ric|near-rt|non-rt|xapp|xapps|rapp|rapps|e2|e2sm|e2ap|a1|o1|o-du|o-cu|o-ru|7\.2x|o-cloud|docker|container|kubernetes|k8s|helm|cnf|vran|ricxappframe)\b/i.test(lowerQ);
  const isRanOptDomain = /\b(kpi|counter|oss|netact|enm|u2020|mae|prb|retainability|accessibility|drop rate|packet loss|throughput|handover success|hosr|sinr|cqi|bler|tilt|azimuth|cluster|neighbor|pci conflict|congestion)\b/i.test(lowerQ);
  const isIntegrationDomain = /\b(commissioning|integrasi|site down|cell down|bbu|rru|aau|vswr|ret|sfp|cabling|fiber optic|cpri|ecpri|s1 link|x2 link|ng link|xn link|board alarm|hardware alarm)\b/i.test(lowerQ);
  const isCemDomain = /\b(cem|soc|qoe|customer experience|user experience|video stall|buffering|latency game|gaming latency|mos score|vip complaint|komplain pelanggan|pelanggan komplain)\b/i.test(lowerQ);
  const isPracticalIssue = /\b(di site|di lapangan|di kantor|lagi ada issue|troubleshoot|mengatasi|solusinya|penyebabnya|kenapa bisa|gimana cara|cara benerin|ticket|komplain)\b/i.test(lowerQ);

  let trackContextInstruction = '';
  if (isCoreDomain) {
    trackContextInstruction = `\n\nPERSPEKTIF DOMAIN UTAMA:\nTinjau kasus/pertanyaan ini dari sudut pandang *Core Network Specialist & Signaling Architect* (analisis alur Control/User Plane, interkoneksi antarmuka N2/N3/N4/S1, session management, dan routing IMS/5GC).`;
  } else if (isOranDomain) {
    trackContextInstruction = `\n\nPERSPEKTIF DOMAIN UTAMA:\nTinjau kasus/pertanyaan ini dari sudut pandang *O-RAN Systems & Cloud-Native Software Engineer* (arsitektur O-RAN Alliance, Near-RT/Non-RT RIC, xApps/rApps lifecycle, integrasi antarmuka E2/A1/O1, kontainerisasi Docker/Kubernetes/O-Cloud, Helm charts, dan scripting Linux/Python/C++ untuk network intelligence).`;
  } else if (isRanOptDomain) {
    trackContextInstruction = `\n\nPERSPEKTIF DOMAIN UTAMA:\nTinjau kasus/pertanyaan ini dari sudut pandang *RAN Performance & Optimization (RPO) Lead* (analisis formula KPI OSS, utilisasi PRB, cluster tuning, parameter radio, dan counter vendor Nokia NetAct/Ericsson ENM/Huawei).`;
  } else if (isIntegrationDomain) {
    trackContextInstruction = `\n\nPERSPEKTIF DOMAIN UTAMA:\nTinjau kasus/pertanyaan ini dari sudut pandang *RAN Integration & Commissioning Engineer* (troubleshooting praktis hardware BBU/RRU, alarm link transport S1/NG/Xn, alarm VSWR/RET, dan verifikasi operasional site).`;
  } else if (isCemDomain) {
    trackContextInstruction = `\n\nPERSPEKTIF DOMAIN UTAMA:\nTinjau kasus/pertanyaan ini dari sudut pandang *Customer Experience Management (CEM) & SOC Lead* (analisis dampak End-to-End QoE, video streaming/VoLTE MOS, korelasi degradasi jaringan terhadap komplain pengguna, dan SLA service).`;
  } else if (contextTrack === 'drive_test') {
    trackContextInstruction = `\n\nPERSPEKTIF KHUSUS:\nFokuskan penjelasan dari sudut pandang *Field & Drive Test* (pengukuran RF di rute pengujian lapangan, analisis parameter RSRP/RSRQ/SINR/BLER di jalan, penggunaan tool lapangan seperti TEMS/Nemo/Scanner, physical cell issues, dan optimasi radio lapangan).`;
  } else if (contextTrack === 'protocol_qa') {
    const isProtocolQuery = /\b(rrc|nas|call flow|handover|timer|t300|t310|rach|sdu|pdu|layer 3|l3|l2|mac|rlc|pdcp|qxdm|shannon)\b/i.test(lowerQ);
    if (isProtocolQuery) {
      trackContextInstruction = `\n\nPERSPEKTIF KHUSUS:\nSajikan analisis mendalam pada aspek protokol radio 3GPP (signaling flow, Layer 2/Layer 3, cause code, dan timer).`;
    }
  } else if (contextTrack === 'ml_telco') {
    trackContextInstruction = `\n\nPERSPEKTIF KHUSUS:\nFokuskan penjelasan dari sudut pandang *Machine Learning Telco Testing* (penerapan data science/AI, deteksi anomali time-series KPI radio, regresi prediktif performa UE/thermal, dan otomatisasi triage log).`;
  } else if (contextTrack === 'log_telco') {
    trackContextInstruction = `\n\nPERSPEKTIF KHUSUS:\nFokuskan penjelasan dari sudut pandang *Log Analysis & Modem Triage* (decoding log QXDM, Shannon, Wireshark PCAP trace, analisis Root Cause Analysis (RCA), failure cause code, paket 0xB0C0, 0xB801, 0xB821, crash stack triage, dan parameter log penting yang perlu diverifikasi).`;
  }

  if (isPracticalIssue) {
    trackContextInstruction += `\n\nPANDUAN PRAKTIKAL (SENIOR TECH LEAD MENTOR):
Pengguna terindikasi sedang menghadapi studi kasus atau masalah pekerjaan nyata di lapangan/kantor. Berikan jawaban to-the-point dengan 'Actionable Troubleshooting Checklist' yang konkret, terstruktur, dan langsung dapat dicek oleh engineer di sistem/lapangan tanpa menggurui secara textbook.`;
  }

  const languageInstruction = `\n\nKETENTUAN BAHASA (BILINGUAL MANDATORY):
- Deteksi bahasa pengguna. Jika pengguna bertanya dalam BAHASA INGGRIS atau meminta ("In english please", "speak english", dll), Anda WAJIB menjawab 100% dalam BAHASA INGGRIS (English) yang fasih, profesional, dan mendalam.
- Jika pengguna bertanya dalam Bahasa Indonesia, jawablah dalam Bahasa Indonesia.`;

  // 4. DRAW-BACK CAPACITY TOKEN & MULTI-TURN ISOLATION:
  // Riwayat percakapan HANYA disertakan jika pertanyaan merupakan kelanjutan kontekstual (Follow-up) dari sesi aktif.
  // Mencegah kontaminasi silang (cross-topic hallucination) jika pengguna bertanya topik baru.
  const historyTurns = isConversationalFollowUp 
    ? recentHistory.flatMap(h => [
        { role: 'user', parts: [{ text: h.incoming_query }] },
        { role: 'model', parts: [{ text: h.ai_response.slice(0, 450) + (h.ai_response.length > 450 ? '...' : '') }] }
      ])
    : [];

  // 5. Context-Anchored User Prompt
  let userTurnText = '';
  if (isConversationalFollowUp && lastTopic) {
    userTurnText = `Pertanyaan pelajar:
"${question}"

[KONTEKS DISKUSI BERSAMBUNG]:
Pertanyaan di atas terdeteksi sebagai kelanjutan dari topik diskusi sebelumnya:
-> Topik Sebelumnya: "${lastTopic}"

PANDUAN KESINAMBUNGAN TEKNIS:
1. Hubungkan penjelasan dengan kasus "${lastTopic}" jika pertanyaan di atas menanyakan kelanjutan, perbandingan, dampak lanjutan, atau solusinya.
2. Namun, jika pengguna beralih menanyakan konsep/entitas teknis baru yang mandiri, utamakan menjawab konsep baru tersebut secara tuntas tanpa memaksakan korelasi fiktif dengan topik sebelumnya.
3. LARANGAN DEKLARASI DIRI ATAU JABATAN: DILARANG KERAS membuka jawaban dengan deklarasi peran, jabatan, atau klaim profesi apa pun (seperti 'Sebagai praktisi...', 'Sebagai engineer...', 'Sebagai asisten...'). Mulailah secara natural dan profesional.
4. ANTI-HALLUCINATION: Berpijaklah pada fakta standar 3GPP/vendor resmi, dilarang mengarang counter atau pesan sinyal fiktif.
5. Gunakan tipografi WhatsApp (*bold*, _italic_, \`\`\`code\`\`\`). Jangan gunakan heading markdown '#' atau tabel markdown.
6. KERAHASIAAN SUMBER: JANGAN menyebutkan kata "ShareTechNote", "database", atau sumber internal.${trackContextInstruction}${languageInstruction}`;
  } else if (kbMatch) {
    const backupContextSection = kbMatch.backup_content
      ? `\n\nKONTEKS CADANGAN & PANDUAN PRAKTIS (ShareTechNote Reference):\n${kbMatch.backup_content}\n`
      : '';

    userTurnText = `Pertanyaan dari pelajar:
"${question}"

KONTEKS TEKNIS UTAMA:
${kbMatch.core_content}${backupContextSection}

Instruksi Menjawab:
1. Jawab pertanyaan pelajar secara komprehensif, teknis, dan presisi mengacu pada konteks teknis di atas dan spesifikasi 3GPP/O-RAN terkini. Jika tersedia KONTEKS CADANGAN (ShareTechNote), jadikan sebagai pelengkap penjelas alur langkah praktis (call flow, diagram, intuisi konsep) yang memperjelas standar normatif utama.
2. KERAHASIAAN SUMBER: JANGAN PERNAH menyebutkan kata "ShareTechNote", "database", "knowledge base", "basis data", "RAG", "Gemini", atau sumber data internal dalam teks jawaban. Penerima pesan tidak perlu dan tidak boleh tahu asal usul jawaban. Jawab langsung secara alami tanpa kalimat klise seperti "Berdasarkan referensi/database...".
3. LARANGAN DEKLARASI DIRI ATAU JABATAN: DILARANG KERAS membuka jawaban dengan deklarasi peran, jabatan, atau klaim profesi apa pun (seperti 'Sebagai praktisi...', 'Sebagai engineer...', 'Sebagai asisten...'). Mulailah secara natural dan profesional.
4. ANTI-HALLUCINATION: Jangan menambah informasi atau klaim yang bertentangan dengan konteks teknis di atas dan standar 3GPP.
5. Jika pertanyaan menyangkut alur/proses (seperti call flow, signal acquisition, RAR, registration), WAJIB gunakan format urutan step-by-step yang rapi dan terstruktur (1️⃣, 2️⃣, 3️⃣ atau 1, 2, 3).
6. Sebutkan nama-nama kanal radio spesifik (seperti PRACH, PDCCH, PDSCH, PBCH, PUSCH, PUCCH) serta Information Element (IE) / RNTI / Timer penting jika relevan.
7. Gunakan tipografi WhatsApp (*bold*, _italic_, \`\`\`code\`\`\`). JANGAN gunakan markdown heading '#' atau format tabel markdown.
8. JANGAN menyertakan URL link luar. Berikan penjelasan mandiri yang lengkap, tuntas sampai kalimat penutup, dan tidak terpotong (panjang ideal: 1.500 - 3.500 karakter).${trackContextInstruction}${languageInstruction}`;
  } else {
    userTurnText = `Pertanyaan dari pelajar:
"${question}"

Instruksi Menjawab:
1. Jawablah secara profesional, mendalam, dan akurat berdasarkan spesifikasi 3GPP (Rel-15 s/d Rel-18), praktik vendor RAN (Nokia, Ericsson, Huawei, ZTE), Core Network, Cellular IoT, dan standar telekomunikasi terkini.
2. KERAHASIAAN SUMBER: JANGAN PERNAH menyebutkan kata "ShareTechNote", "database", "knowledge base", "basis data", "RAG", "Gemini", atau sumber data internal dalam teks jawaban. Penerima pesan tidak perlu dan tidak boleh tahu asal usul jawaban. Jawab langsung secara alami.
3. LARANGAN DEKLARASI DIRI ATAU JABATAN: DILARANG KERAS membuka jawaban dengan deklarasi peran, jabatan, atau klaim profesi apa pun (seperti 'Sebagai praktisi...', 'Sebagai engineer...', 'Sebagai asisten...'). Mulailah secara natural dan profesional (misal: "Halo rekan teknis!", "Mari kita bedah alurnya...", atau langsung masuk ke solusi teknis to-the-point).
4. ANTI-HALLUCINATION: Seluruh penjelasan wajib berbasis standar resmi 3GPP/vendor. DILARANG mengarang counter, parameter, atau pesan fiktif. Jika formulasi berbeda antar release vendor, jelaskan secara objektif ketergantungannya pada software release.
5. Jika pertanyaan menyangkut masalah/studi kasus pekerjaan, berikan struktur: Konsep/Penyebab Inti, Dampak Operasional/Lapangan, dan Checklist Langkah Triage (Actionable Checklist).
6. Jika pertanyaan mengenai alur kerja atau protokol, gunakan format urutan step-by-step berstruktur lengkap dengan kanal radio & layer terkait.
7. Sebutkan nama-nama kanal radio / interface / counter spesifik serta Information Element (IE) penting jika relevan.
8. Gunakan format tipografi WhatsApp (*bold*, _italic_, \`\`\`code\`\`\`). JANGAN gunakan heading '#' atau format tabel markdown.
9. JANGAN sertakan link URL luar. Berikan penjelasan mandiri yang tuntas sampai kalimat penutup, dan tidak terpotong (panjang ideal: 1.500 - 3.500 karakter).${trackContextInstruction}${languageInstruction}`;
  }

  // 6. Native Multi-Turn Payload Assembly
  const multiTurnPayload = [
    ...historyTurns,
    { role: 'user', parts: [{ text: userTurnText }] }
  ];

  const isEnglishQuestion = /\b(what|how|why|who|when|where|which|can|could|would|should|is|are|do|does|explain|in english|english)\b/i.test(question);
  const result = await callGeminiModel(multiTurnPayload, GEMINI_SYSTEM_INSTRUCTION, { isLogAnalysis: false, isEnglish: isEnglishQuestion });
  const latency = Date.now() - startTime;

  try {
    logLlmConversation(userId, question, result.text, latency, result.usage || {});
  } catch (dbErr) {
    console.error('Failed to log LLM interaction to SQLite:', dbErr);
  }

  // Simpan ke Cache jika respon berhasil dan bukan follow-up
  if (result.success && !isConversationalFollowUp && result.text && result.text.length > 50) {
    setCachedResponse(question, result.text, result.usage || {}).catch(err => {
      console.warn('⚠️ [Cache Save Warning]:', err.message);
    });
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
