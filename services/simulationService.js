/**
 * TelcoLearn Simulation & Technical Diagram Service
 * Menghasilkan visualisasi teknis beresolusi tinggi untuk WhatsApp:
 * 1. Diagram Arsitektur Jaringan, Topologi, dan Call Flow (5G SA/NSA, O-RAN, 3GPP Interfaces) via Graphviz QuickChart
 * 2. Kurva Metrik RF & Analisis Kinerja Kuantitatif (Throughput vs SINR/PRB, RSRP vs Jarak, Latensi) via Chart.js QuickChart
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
    throw new Error(`QuickChart Chart error: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Generate QuickChart PNG Buffer from Graphviz DOT syntax
 */
async function generateGraphvizBuffer(dotSource) {
  const postData = JSON.stringify({ graph: dotSource, format: 'png' });
  const response = await fetch('https://quickchart.io/graphviz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData).toString()
    },
    body: postData,
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) {
    throw new Error(`QuickChart Graphviz error: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Template Diagram Arsitektur Default (5G SA vs NSA atau 5GC Standalone)
 */
function createDefaultArchitectureDiagram(topic = '5G Network Architecture') {
  const isNsa = /nsa|non-standalone|option\s*3/i.test(topic);

  if (isNsa) {
    return `digraph G {
      bgcolor="#0f172a";
      rankdir=LR;
      node [shape=box, style="filled,rounded", fillcolor="#1e293b", fontcolor="#38bdf8", color="#38bdf8", fontname="Arial", fontsize=11];
      edge [color="#94a3b8", fontcolor="#cbd5e1", fontsize=10];

      subgraph cluster_eutran {
        label="Dual Connectivity (EN-DC)";
        color="#334155";
        fontcolor="#94a3b8";
        eNB [label="eNB (LTE Master Node)\\nControl + Data Anchor"];
        gNB [label="en-gNB (5G Secondary Node)\\nUser Plane Data"];
      }

      subgraph cluster_core {
        label="4G Core (EPC)";
        color="#334155";
        fontcolor="#94a3b8";
        MME [label="MME (Control Plane)"];
        SGW [label="SGW / PGW (User Plane)"];
      }

      UE [label="5G UE Dual-Mode"];
      Internet [label="Data Network / Internet"];

      UE -> eNB [label="LTE RRC (Control)"];
      UE -> gNB [label="NR User Plane"];
      eNB -> gNB [label="X2 Interface"];
      eNB -> MME [label="S1-C"];
      eNB -> SGW [label="S1-U"];
      gNB -> SGW [label="S1-U (Direct Bearer)"];
      SGW -> Internet [label="SGi"];
    }`;
  }

  return `digraph G {
    bgcolor="#0f172a";
    rankdir=LR;
    node [shape=box, style="filled,rounded", fillcolor="#1e293b", fontcolor="#38bdf8", color="#38bdf8", fontname="Arial", fontsize=11];
    edge [color="#94a3b8", fontcolor="#cbd5e1", fontsize=10];

    subgraph cluster_ran {
      label="5G NextGen RAN";
      color="#334155";
      fontcolor="#94a3b8";
      gNB [label="gNodeB (5G NR)\\nCU/DU Disaggregated"];
    }

    subgraph cluster_core {
      label="5G Core Network (5GC SBA)";
      color="#334155";
      fontcolor="#94a3b8";
      AMF [label="AMF (Access & Mobility)"];
      SMF [label="SMF (Session Mgmt)"];
      UPF [label="UPF (User Plane Function)"];
    }

    UE [label="5G Standalone UE"];
    DN [label="Data Network (Internet/DN)"];

    UE -> gNB [label="NR Uu (Air Interface)"];
    gNB -> AMF [label="N2 (NG-C Signaling)"];
    gNB -> UPF [label="N3 (NG-U User Plane)"];
    AMF -> SMF [label="N11 (Service Based)"];
    SMF -> UPF [label="N4 (PFCP Control)"];
    UPF -> DN [label="N6 Interface"];
  }`;
}

/**
 * Template Grafik Throughput vs Bottleneck Default
 */
function createDefaultThroughputChart(topic = '5G Throughput vs Bottleneck Factors') {
  return {
    type: 'bar',
    data: {
      labels: ['Radio Ideal (LoS, MCS 28)', 'Rank 4, SINR Bagus', 'PRB Congested (High Load)', 'Limited Backhaul (100M)', 'High BLER (>10%)'],
      datasets: [
        {
          label: 'Throughput Downlink (Mbps)',
          data: [1200, 950, 220, 95, 80],
          backgroundColor: [
            'rgba(56, 189, 248, 0.7)',
            'rgba(34, 197, 94, 0.7)',
            'rgba(234, 179, 8, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(239, 68, 68, 0.7)'
          ],
          borderColor: ['#38bdf8', '#22c55e', '#eab808', '#ef4444', '#ef4444'],
          borderWidth: 2
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: `Simulasi Analisis Throughput: ${topic.slice(0, 45)}`,
        fontColor: '#f8fafc',
        fontSize: 16,
        padding: 16
      },
      legend: { labels: { fontColor: '#cbd5e1' } },
      scales: {
        xAxes: [{
          gridLines: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { fontColor: '#cbd5e1', fontSize: 10 }
        }],
        yAxes: [{
          gridLines: { color: 'rgba(255, 255, 255, 0.1)' },
          scaleLabel: { display: true, labelString: 'Throughput (Mbps)', fontColor: '#94a3b8' },
          ticks: { fontColor: '#cbd5e1' }
        }]
      }
    }
  };
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
 * Main Entrypoint: Generate Simulation Image based on query or last conversation
 */
export async function generateTelcoSimulation(userId = 0, customPrompt = '') {
  // 1. Dapatkan konteks pembahasan
  let topicContext = customPrompt.trim();
  const cleanTopic = topicContext.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();
  const genericWords = new Set([
    'bisa', 'tolong', 'coba', 'dong', 'ya', 'kan', 'kah', 'ini', 'gambar', 'gambarnya',
    'simulasi', 'simulasinya', 'visualisasi', 'visualisasinya', 'grafik', 'grafiknya',
    'diagram', 'diagramnya', 'buat', 'buatkan', 'bikin', 'minta', 'tampilkan', 'perlihatkan',
    'kasus', 'kasusnya', 'jawaban', 'tadi', 'arsitektur', 'architecture'
  ]);

  const words = cleanTopic.split(/\s+/).filter(Boolean);
  const isGenericRequest = words.length === 0 || words.every(w => genericWords.has(w)) || topicContext.length < 5;

  if (isGenericRequest && userId) {
    const recent = getRecentLlmConversation(userId, 1);
    if (recent && recent.length > 0) {
      topicContext = `${recent[0].incoming_query} - ${recent[0].ai_response.slice(0, 300)}`;
    }
  }

  if (!topicContext || isGenericRequest) {
    topicContext = '5G Standalone (SA) and Non-Standalone (NSA) Network Architecture';
  }

  console.log(`🎨 [Simulation Service] Merancang simulasi gambar untuk topik: "${topicContext.slice(0, 80)}..."`);

  // Deteksi intensi visual dari kata kunci
  const isArchitectureInquiry = /\b(arsitektur|architecture|topologi|topology|diagram|flow|call flow|stack|protokol|protocol|sa|nsa|o-ran|oran|ran|core|5gc|epc|enb|gnb|amf|upf|smf|mme|sgw|node|struktur|elemen)\b/i.test(topicContext);

  // 2. Evaluasi tipe simulasi via Gemini
  let simulationPlan = {
    type: isArchitectureInquiry ? 'diagram' : 'chart',
    dot: null,
    chartConfig: null,
    caption: ''
  };

  try {
    const promptPlan = `Analisis topik telekomunikasi berikut dan pilih jenis visualisasi terbaik:
"${topicContext}"

INSTRUKSI PEMILIHAN:
1. Jika topik menanyakan arsitektur, topologi jaringan, komponen node (gNB/eNB/AMF/UPF/Core/RAN), call flow, atau perbandingan SA vs NSA:
   Pilih "type": "diagram" dan buatkan kode Graphviz DOT yang VALID & RAPI.
   Style Graphviz WAJIB:
   - bgcolor="#0f172a"
   - rankdir=LR
   - node [shape=box, style="filled,rounded", fillcolor="#1e293b", fontcolor="#38bdf8", color="#38bdf8", fontname="Arial", fontsize=11]
   - edge [color="#94a3b8", fontcolor="#cbd5e1", fontsize=10]
   - Gunakan subgraph cluster jika ada pembagian RAN vs Core.

2. Jika topik menanyakan kuantitas angka, kurva RF, grafik throughput vs bottleneck, RSRP vs jarak, perbandingan latensi, atau utilisasi PRB:
   Pilih "type": "chart" dan buatkan chartConfig Chart.js (type: line atau bar) dengan tema gelap #0f172a.

Hasilkan HANYA JSON murni (tanpa markdown backticks, tanpa teks pembuka atau penutup):
{
  "type": "diagram" atau "chart",
  "dot": "digraph G { ... }",
  "chartConfig": { ... },
  "caption": "*Penjelasan teknis singkat diagram/grafik dalam Bahasa Indonesia (2-3 kalimat tipografi WhatsApp)*"
}`;

    const planRes = await callGeminiModel(promptPlan, 'You are an expert telecom visualizer and Graphviz/Chart engineer. Return ONLY pure JSON.');
    if (planRes && planRes.success && planRes.text) {
      const cleanJson = planRes.text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed && (parsed.type === 'diagram' || parsed.type === 'chart')) {
        simulationPlan = parsed;
        console.log(`💡 [Simulation Service] Berhasil merancang visualisasi bertipe: ${parsed.type}`);
      }
    }
  } catch (planErr) {
    console.warn('⚠️ Gagal mem-parse rencana visual Gemini, menggunakan template kontekstual:', planErr.message);
  }

  // 3. Eksekusi pembuatan gambar
  let imageBuffer = null;

  // A. Eksekusi Graphviz Diagram jika tipe adalah "diagram" (atau jika topik arsitektur)
  if (simulationPlan.type === 'diagram' || (isArchitectureInquiry && simulationPlan.dot)) {
    try {
      const dotSource = simulationPlan.dot || createDefaultArchitectureDiagram(topicContext);
      imageBuffer = await generateGraphvizBuffer(dotSource);
      console.log('✅ [Simulation Service] Diagram arsitektur Graphviz berhasil dirender.');
    } catch (dotErr) {
      console.warn('⚠️ Gagal merender DOT kustom, mencoba diagram arsitektur default:', dotErr.message);
      try {
        imageBuffer = await generateGraphvizBuffer(createDefaultArchitectureDiagram(topicContext));
      } catch (fbErr) {
        console.error('❌ Gagal merender fallback diagram arsitektur:', fbErr.message);
      }
    }
  }

  // B. Eksekusi Chart.js jika tipe adalah "chart" atau fallback jika diagram belum berhasil
  if (!imageBuffer) {
    try {
      let config = simulationPlan.chartConfig;
      if (!config) {
        if (/throughput|speed|kecepatan|bottleneck|prb/i.test(topicContext)) {
          config = createDefaultThroughputChart(topicContext);
        } else if (isArchitectureInquiry) {
          // Jangan kirim RSRP jika inquiry adalah arsitektur!
          imageBuffer = await generateGraphvizBuffer(createDefaultArchitectureDiagram(topicContext));
        } else {
          config = createDefaultPathLossChart(topicContext.slice(0, 40));
        }
      }

      if (!imageBuffer && config) {
        imageBuffer = await generateChartBuffer(config);
        console.log('✅ [Simulation Service] Diagram kurva RF/Throughput QuickChart berhasil dibuat.');
      }
    } catch (chartErr) {
      console.warn('⚠️ Gagal membuat chart kustom:', chartErr.message);
      if (!isArchitectureInquiry) {
        imageBuffer = await generateChartBuffer(createDefaultPathLossChart('Pelemahan Sinyal RSRP'));
      }
    }
  }

  // Fallback terakhir: jika arsitektur, buat diagram arsitektur default
  if (!imageBuffer && isArchitectureInquiry) {
    try {
      imageBuffer = await generateGraphvizBuffer(createDefaultArchitectureDiagram(topicContext));
    } catch (e) {}
  }

  const defaultCaption = isArchitectureInquiry
    ? '📡 *Diagram Arsitektur Jaringan Telekomunikasi TelcoLearn*\nMenampilkan interkoneksi antarmuka (interfaces) 3GPP antara User Equipment (UE), Radio Access Network (RAN), dan Core Network.'
    : '📊 *Visualisasi Analisis Kinerja Telekomunikasi TelcoLearn*';

  return {
    image: imageBuffer,
    caption: simulationPlan.caption || defaultCaption
  };
}
