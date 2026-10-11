/**
 * TelcoLearn Simulation & Technical Diagram Service
 * Menghasilkan gambar simulasi visual untuk chat WhatsApp:
 * 1. Diagram Kurva RF & Metrik Telekomunikasi (RSRP vs Distance, Blocker Path Loss, SINR, Handover) via QuickChart
 * 2. Ilustrasi Konseptual Visual AI (BTS gNB, UE, Obstacle Gedung, Gelombang Radio) via Google Imagen 3
 */

import { GoogleGenAI } from '@google/genai';
import { getRecentLlmConversation } from '../database/db.js';
import { callGeminiModel } from './geminiService.js';

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
 * Generate QuickChart PNG Buffer from Chart.js configuration
 */
async function generateChartBuffer(chartConfig) {
  const chartUrl = `https://quickchart.io/chart?w=800&h=450&bkg=%230f172a&c=${encodeURIComponent(JSON.stringify(chartConfig))}`;
  const response = await fetch(chartUrl, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) {
    throw new Error(`QuickChart error: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Default fallback RF Path Loss & Blocker Curve Chart
 */
function createDefaultPathLossChart(topic = 'RSRP vs Jarak dengan Blocker') {
  return {
    type: 'line',
    data: {
      labels: ['100m', '300m', '600m', '1km', '1.5km', '2km', '3km'],
      datasets: [
        {
          label: 'RSRP Normal / Line-of-Sight (LoS)',
          data: [-75, -84, -92, -99, -106, -112, -119],
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 3
        },
        {
          label: 'RSRP Terhalang Blocker Beton (NLoS)',
          data: [-90, -100, -109, -118, -125, -132, -140],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderDash: [5, 5],
          fill: true,
          tension: 0.3,
          borderWidth: 3
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: `Simulasi RF: ${topic}`,
        fontColor: '#f8fafc',
        fontSize: 18,
        padding: 16
      },
      legend: {
        labels: { fontColor: '#cbd5e1', fontSize: 13 }
      },
      scales: {
        xAxes: [{
          gridLines: { color: 'rgba(255, 255, 255, 0.1)' },
          scaleLabel: { display: true, labelString: 'Jarak UE ke Sel (Distance)', fontColor: '#94a3b8' },
          ticks: { fontColor: '#cbd5e1' }
        }],
        yAxes: [{
          gridLines: { color: 'rgba(255, 255, 255, 0.1)' },
          scaleLabel: { display: true, labelString: 'RSRP Level (dBm)', fontColor: '#94a3b8' },
          ticks: { fontColor: '#cbd5e1', min: -145, max: -65 }
        }]
      }
    }
  };
}

/**
 * Generate Visual Illustration via Google Imagen 3
 */
async function generateImagenIllustration(prompt) {
  const client = getClient();
  if (!client) throw new Error('GEMINI_API_KEY belum dikonfigurasi');

  const response = await client.models.generateImages({
    model: 'imagen-3.0-generate-002',
    prompt: `Professional 3D technical isometric diagram: ${prompt}. Clean telecommunications engineering style, dark slate blue background, detailed cellular transmission waves, high contrast, scientific graphics.`,
    config: {
      numberOfImages: 1,
      aspectRatio: '16:9',
      outputMimeType: 'image/png'
    }
  });

  const base64Bytes = response?.generatedImages?.[0]?.image?.imageBytes;
  if (!base64Bytes) throw new Error('Imagen 3 tidak mengembalikan bytes gambar');
  return Buffer.from(base64Bytes, 'base64');
}

/**
 * Main Entrypoint: Generate Simulation Image based on query or last conversation
 */
export async function generateTelcoSimulation(userId = 0, customPrompt = '') {
  // 1. Dapatkan konteks pembahasan
  let topicContext = customPrompt.trim();
  const cleanTopic = topicContext.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();
  const genericWords = new Set(['bisa', 'tolong', 'coba', 'dong', 'ya', 'kan', 'kah', 'ini', 'gambar', 'gambarnya', 'simulasi', 'simulasinya', 'visualisasi', 'visualisasinya', 'grafik', 'grafiknya', 'diagram', 'diagramnya', 'buat', 'buatkan', 'bikin', 'minta', 'tampilkan', 'perlihatkan', 'kasus', 'kasusnya', 'jawaban', 'tadi']);

  const words = cleanTopic.split(/\s+/).filter(Boolean);
  const isGenericRequest = words.length === 0 || words.every(w => genericWords.has(w)) || topicContext.length < 5;

  if (isGenericRequest && userId) {
    const recent = getRecentLlmConversation(userId, 1);
    if (recent && recent.length > 0) {
      topicContext = `${recent[0].incoming_query} - ${recent[0].ai_response.slice(0, 300)}`;
    }
  }

  if (!topicContext || isGenericRequest) {
    topicContext = 'Pengaruh jarak dan blocker gedung terhadap pelemahan sinyal RSRP seluler 4G/5G';
  }

  console.log(`🎨 [Simulation Service] Merancang simulasi gambar untuk topik: "${topicContext.slice(0, 80)}..."`);

  // 2. Evaluasi tipe simulasi via Gemini
  let simulationPlan = {
    type: 'chart',
    title: 'Simulasi RF: RSRP vs Jarak & Efek Blocker',
    caption: '📊 *Grafik Simulasi RF: Pengaruh Jarak & Obstacle Blocker terhadap RSRP*\n\nTerlihat jelas bahwa keberadaan blocker (beton/gedung) menyebabkan tambahan _penetration loss_ sekitar 15-20 dB, sehingga level RSRP drop drastis di bawah ambang batas deteksi UE (-120 dBm).'
  };

  try {
    const promptPlan = `Analisis topik telekomunikasi berikut dan pilih jenis visualisasi terbaik:
"${topicContext}"

Hasilkan HANYA JSON murni (tanpa tanda kutip markdown backticks, tanpa teks pengantar atau penutup) dengan format:
{
  "type": "chart" | "illustration",
  "chartConfig": {
    "type": "line" atau "bar",
    "data": {
      "labels": ["...", "..."],
      "datasets": [
        {
          "label": "...",
          "data": [ ...angka-angka realistis... ],
          "borderColor": "#38bdf8",
          "backgroundColor": "rgba(56, 189, 248, 0.15)",
          "fill": true,
          "borderWidth": 3
        }
      ]
    },
    "options": {
      "title": { "display": true, "text": "Judul Grafik Simulasi", "fontColor": "#f8fafc", "fontSize": 16 },
      "legend": { "labels": { "fontColor": "#cbd5e1" } },
      "scales": {
        "xAxes": [{ "ticks": { "fontColor": "#cbd5e1" }, "gridLines": { "color": "rgba(255, 255, 255, 0.1)" }, "scaleLabel": { "display": true, "labelString": "Sumbu X", "fontColor": "#94a3b8" } }],
        "yAxes": [{ "ticks": { "fontColor": "#cbd5e1" }, "gridLines": { "color": "rgba(255, 255, 255, 0.1)" }, "scaleLabel": { "display": true, "labelString": "Sumbu Y", "fontColor": "#94a3b8" } }]
      }
    }
  },
  "illustrationPrompt": "...prompt visual bahasa Inggris untuk Imagen 3 jika type == 'illustration'...",
  "caption": "*Penjelasan teknis singkat simulasi dalam Bahasa Indonesia (2-4 kalimat dengan format tipografi WhatsApp)*"
}`;

    const planRes = await callGeminiModel(promptPlan, 'You are an expert RF engineering visualizer that returns pure JSON.');
    if (planRes && planRes.success && planRes.text) {
      const cleanJson = planRes.text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed && (parsed.type === 'chart' || parsed.type === 'illustration')) {
        simulationPlan = parsed;
        console.log(`💡 [Simulation Service] Berhasil merancang visualisasi bertipe: ${parsed.type}`);
      }
    }
  } catch (planErr) {
    console.warn('⚠️ Gagal mem-parse rencana visual Gemini, menggunakan template default:', planErr.message);
  }

  // 3. Eksekusi pembuatan gambar
  let imageBuffer = null;

  // Coba Ilustrasi jika tipe adalah "illustration"
  if (simulationPlan.type === 'illustration' && simulationPlan.illustrationPrompt) {
    try {
      imageBuffer = await generateImagenIllustration(simulationPlan.illustrationPrompt);
      console.log('✅ [Simulation Service] Gambar ilustrasi AI Imagen 3 berhasil dibuat.');
    } catch (imgErr) {
      console.warn('⚠️ Imagen 3 gagal/kuota terbatas, fallback ke diagram kurva RF QuickChart:', imgErr.message);
      simulationPlan.type = 'chart';
    }
  }

  // Jika tipe chart atau fallback dari Imagen
  if (!imageBuffer) {
    try {
      const config = simulationPlan.chartConfig || createDefaultPathLossChart(topicContext.slice(0, 40));
      imageBuffer = await generateChartBuffer(config);
      console.log('✅ [Simulation Service] Diagram kurva RF QuickChart berhasil dibuat.');
    } catch (chartErr) {
      console.warn('⚠️ Gagal membuat chart kustom, menggunakan default chart:', chartErr.message);
      imageBuffer = await generateChartBuffer(createDefaultPathLossChart('Pelemahan Sinyal RSRP'));
    }
  }

  return {
    image: imageBuffer,
    caption: simulationPlan.caption || '📊 *Visualisasi Simulasi Telekomunikasi TelcoLearn*'
  };
}
