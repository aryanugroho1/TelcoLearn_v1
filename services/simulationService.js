/**
 * TelcoLearn Simulation & Technical Diagram Service
 * Menghasilkan visualisasi teknis beresolusi tinggi, mobile-first, dan semantik 3GPP untuk WhatsApp:
 * 1. Diagram Arsitektur & Topologi (5G SA/NSA, O-RAN, SBA) via Graphviz QuickChart (Mobile-First Vertical TB Layout)
 * 2. Alur Pensinyalan & Call Flow (Handover, PDU Session Setup, RACH) via Sequential Diagram
 * 3. Kurva Kuantitatif RF & Throughput (Bottleneck Analysis, RSRP vs Jarak, SINR vs MCS) via Chart.js
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
  const chartUrl = `https://quickchart.io/chart?w=800&h=480&bkg=%230b1120&c=${encodeURIComponent(JSON.stringify(chartConfig))}`;
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
 * ----------------------------------------------------
 * GOLDEN TEMPLATES: 3GPP SEMANTIC & MOBILE-FIRST LAYOUT
 * ----------------------------------------------------
 */

/**
 * Template Diagram Arsitektur Berstandar 3GPP (Layout Vertikal Ramah HP WhatsApp)
 */
function getGoldenArchitectureTemplate(topic = '') {
  const t = topic.toLowerCase();

  // 1. O-RAN DISAGGREGATED OPEN RAN ARCHITECTURE
  if (/o-ran|oran|open\s*ran|fronthaul|midhaul|e2|a1|split\s*7/i.test(t)) {
    return `digraph G {
      bgcolor="#0b1120";
      rankdir=TB;
      nodesep=0.5;
      ranksep=0.6;
      fontname="Helvetica,Arial,sans-serif";
      node [shape=box, style="filled,rounded", fontname="Helvetica,Arial,sans-serif", fontsize=12, fontcolor="#ffffff", penwidth=2, margin="0.2,0.12"];
      edge [fontname="Helvetica,Arial,sans-serif", fontsize=10, fontcolor="#e2e8f0"];

      subgraph cluster_smo {
        label="[ LAYER 1: MANAGEMENT & ORCHESTRATION ]";
        style="rounded,dashed"; color="#38bdf8"; fontcolor="#38bdf8"; fontsize=11;
        SMO [label="SMO (Service Management & Orchestration)\\nNon-Real-Time RIC (AI/ML rApps Policy)", fillcolor="#0369a1", color="#38bdf8"];
      }

      subgraph cluster_ric {
        label="[ LAYER 2: NEAR-REAL-TIME CONTROLLER ]";
        style="rounded"; color="#334155"; fontcolor="#a5b4fc"; fontsize=11;
        NearRIC [label="Near-RT RIC (Radio Intelligent Controller)\\nxApps Microservices (<10ms Radio Control Loop)", fillcolor="#4338ca", color="#818cf8"];
      }

      subgraph cluster_oran_cu {
        label="[ LAYER 3: O-RAN CENTRALIZED UNIT (O-CU) ]";
        style="rounded"; color="#334155"; fontcolor="#34d399"; fontsize=11;
        OCUCP [label="O-CU-CP\\n(RRC & PDCP-C Signaling)", fillcolor="#065f46", color="#34d399"];
        OCUUP [label="O-CU-UP\\n(PDCP-U & SDAP User Data)", fillcolor="#0f766e", color="#2dd4bf"];
      }

      subgraph cluster_oran_du_ru {
        label="[ LAYER 4: O-RAN DISTRIBUTED & RADIO UNITS ]";
        style="rounded"; color="#334155"; fontcolor="#34d399"; fontsize=11;
        ODU [label="O-DU (Distributed Unit)\\nHigh-PHY / MAC / RLC Processing", fillcolor="#065f46", color="#34d399"];
        ORU [label="O-RU (Open Radio Unit)\\nLow-PHY / RF Beamforming / Antenna", fillcolor="#065f46", color="#34d399"];
      }

      SMO -> NearRIC [label=" A1 Interface (Guidance & Models) ", style="dashed", color="#38bdf8", penwidth=2];
      NearRIC -> OCUCP [label=" E2 Interface ", style="dashed", color="#818cf8", penwidth=2];
      NearRIC -> OCUUP [label=" E2 Interface ", style="dashed", color="#818cf8", penwidth=2];
      NearRIC -> ODU [label=" E2 Interface (RAN Telemetry) ", style="dashed", color="#818cf8", penwidth=2];

      OCUCP -> OCUUP [label=" E1 Interface (CP-UP Separation) ", style="dashed", color="#f43f5e", penwidth=2];
      OCUCP -> ODU [label=" F1-C Midhaul (Control) ", style="dashed", color="#f43f5e", penwidth=2];
      OCUUP -> ODU [label=" F1-U Midhaul (User Data) ", color="#10b981", penwidth=3];
      ODU -> ORU [label=" Open Fronthaul 7.2x (eCPRI / RoE) ", color="#10b981", fontcolor="#6ee7b7", penwidth=3.5];

      labelloc="b";
      label="\\n[ARSITEKTUR O-RAN ALLIANCE]\\n- Hijau Tebal: User Plane Data (F1-U & Open Fronthaul Split 7.2x)\\n- Garis Putus-Putus Merah/Ungu: Control Plane (E1, F1-C, E2 Interface)\\n- Garis Biru: A1 Policy Interface dari Non-RT RIC";
      fontcolor="#94a3b8"; fontsize=10;
    }`;
  }

  // 2. 5G NSA (NON-STANDALONE OPTION 3X / EN-DC)
  if (/nsa|non-standalone|option\s*3|en-dc|endc|dual\s*conn/i.test(t)) {
    return `digraph G {
      bgcolor="#0b1120";
      rankdir=TB;
      nodesep=0.5;
      ranksep=0.6;
      fontname="Helvetica,Arial,sans-serif";
      node [shape=box, style="filled,rounded", fontname="Helvetica,Arial,sans-serif", fontsize=12, fontcolor="#ffffff", penwidth=2, margin="0.2,0.12"];
      edge [fontname="Helvetica,Arial,sans-serif", fontsize=10, fontcolor="#e2e8f0"];

      subgraph cluster_ue {
        label="[ LAYER 1: DUAL-CONNECTIVITY TERMINAL ]";
        style="rounded,dashed"; color="#38bdf8"; fontcolor="#38bdf8"; fontsize=11;
        UE [label="5G Dual-Mode UE\\n(LTE Anchor + 5G NR Carrier)", fillcolor="#0369a1", color="#38bdf8"];
      }

      subgraph cluster_ran {
        label="[ LAYER 2: E-UTRA-NR DUAL CONNECTIVITY (EN-DC) ]";
        style="rounded"; color="#334155"; fontcolor="#34d399"; fontsize=11;
        MeNB [label="Master eNB (4G LTE Anchor)\\nControl Plane Anchor & RRC Signaling", fillcolor="#065f46", color="#34d399"];
        SgNB [label="Secondary gNB (5G NR Data Booster)\\nHigh-Throughput User Plane Data", fillcolor="#0f766e", color="#2dd4bf"];
      }

      subgraph cluster_core {
        label="[ LAYER 3: 4G CORE NETWORK (EPC) ]";
        style="rounded"; color="#334155"; fontcolor="#a5b4fc"; fontsize=11;
        MME [label="MME (Mobility Management Entity)\\nLTE Control Signaling", fillcolor="#4338ca", color="#818cf8"];
        SGW [label="SGW / PGW-U (User Plane Gateway)\\nPacket Routing & PDN Anchor", fillcolor="#0f766e", color="#2dd4bf"];
      }

      subgraph cluster_dn {
        label="[ LAYER 4: DATA NETWORK ]";
        style="rounded,dashed"; color="#f59e0b"; fontcolor="#fbbf24"; fontsize=11;
        DN [label="Internet / IMS VoLTE Network", fillcolor="#92400e", color="#fbbf24"];
      }

      // Radio Links
      UE -> MeNB [label=" LTE Uu (Radio Control + Data) ", color="#38bdf8", penwidth=2.5];
      UE -> SgNB [label=" NR Uu (High-Speed Data) ", color="#10b981", penwidth=3.5];

      // Inter-Node Coordination
      MeNB -> SgNB [label=" X2-C (Signaling Coordination) ", style="dashed", color="#e2e8f0", penwidth=2];
      SgNB -> MeNB [label=" X2-U (Split Bearer Buffer) ", color="#10b981", penwidth=2];

      // Core Links
      MeNB -> MME [label=" S1-MME (Control Plane) ", style="dashed", color="#f43f5e", penwidth=2];
      MeNB -> SGW [label=" S1-U (LTE Bearer) ", color="#10b981", penwidth=2];
      SgNB -> SGW [label=" S1-U Direct Bearer (Option 3x) ", color="#10b981", fontcolor="#6ee7b7", penwidth=3.5];
      SGW -> DN [label=" SGi Interface ", color="#10b981", penwidth=3];

      labelloc="b";
      label="\\n[ARSITEKTUR 5G NSA OPTION 3X]\\n- Hijau Tebal: S1-U Langsung dari 5G gNB ke EPC SGW (Option 3x)\\n- Merah Putus-Putus: S1-MME Pensinyalan Kontrol via 4G LTE eNB\\n- Putih Putus-Putus: Koordinasi Antar-Radio X2";
      fontcolor="#94a3b8"; fontsize=10;
    }`;
  }

  // 3. CALL FLOW / HANDOVER / REGISTRATION
  if (/call\s*flow|handover|pdu\s*session|attach|registrasi|registration/i.test(t)) {
    return `digraph G {
      bgcolor="#0b1120";
      rankdir=TB;
      nodesep=0.4;
      ranksep=0.5;
      fontname="Helvetica,Arial,sans-serif";
      node [shape=box, style="filled,rounded", fontname="Helvetica,Arial,sans-serif", fontsize=12, fontcolor="#ffffff", penwidth=2, margin="0.2,0.1"];
      edge [fontname="Helvetica,Arial,sans-serif", fontsize=10, fontcolor="#e2e8f0", penwidth=2];

      step1 [label="1. RRC Setup Request\\nUE -> gNB (NR Uu Random Access / Msg3)", fillcolor="#0369a1", color="#38bdf8"];
      step2 [label="2. Registration Request (NAS-MM)\\nUE -> gNB -> AMF via N2 (NG-C Initial UE Message)", fillcolor="#4338ca", color="#818cf8"];
      step3 [label="3. Authentication & Security\\nAMF <-> AUSF/UDM & UE (5G AKA & NAS SMC)", fillcolor="#4338ca", color="#818cf8"];
      step4 [label="4. PDU Session Setup Request\\nUE -> AMF -> SMF (N11 PDU Session Create)", fillcolor="#4338ca", color="#818cf8"];
      step5 [label="5. User Plane Tunnel Establishment\\nSMF -> UPF via N4 (PFCP Session Est) & gNB via N2 (N3 Tunnel Info)", fillcolor="#0f766e", color="#2dd4bf"];
      step6 [label="6. RRC Reconfiguration (DRB Established)\\ngNB -> UE (Radio Data Bearer Aktif)", fillcolor="#065f46", color="#34d399"];
      step7 [label="7. User Data Transfer Active\\nUE <== N3 GTP-U ==> UPF <== N6 ==> Data Network", fillcolor="#065f46", color="#34d399", penwidth=3];

      step1 -> step2 -> step3 -> step4 -> step5 -> step6 -> step7 [color="#10b981", penwidth=2.5];

      labelloc="b";
      label="\\n[CALL FLOW: 5G REGISTRATION & PDU SESSION SETUP]\\nAlur sekuensial pensinyalan dari Radio Access hingga User Plane Data siap.";
      fontcolor="#94a3b8"; fontsize=10;
    }`;
  }

  // 4. 5G STANDALONE (OPTION 2 / 5GC SBA) - DEFAULT
  return `digraph G {
    bgcolor="#0b1120";
    rankdir=TB;
    nodesep=0.5;
    ranksep=0.6;
    fontname="Helvetica,Arial,sans-serif";
    node [shape=box, style="filled,rounded", fontname="Helvetica,Arial,sans-serif", fontsize=12, fontcolor="#ffffff", penwidth=2, margin="0.2,0.12"];
    edge [fontname="Helvetica,Arial,sans-serif", fontsize=10, fontcolor="#e2e8f0"];

    subgraph cluster_ue {
      label="[ LAYER 1: USER EQUIPMENT (UE) ]";
      style="rounded,dashed"; color="#38bdf8"; fontcolor="#38bdf8"; fontsize=11;
      UE [label="5G NR Standalone UE\\n(Modem Qualcomm Snapdragon / Samsung Shannon)", fillcolor="#0369a1", color="#38bdf8"];
    }

    subgraph cluster_ran {
      label="[ LAYER 2: 5G NEXTGEN RAN (NG-RAN) ]";
      style="rounded"; color="#334155"; fontcolor="#34d399"; fontsize=11;
      gNB [label="gNodeB (5G Base Station)\\nCentral Unit (CU) + Distributed Unit (DU)", fillcolor="#065f46", color="#34d399"];
    }

    subgraph cluster_core {
      label="[ LAYER 3: 5G CORE NETWORK (5GC SBA) ]";
      style="rounded"; color="#334155"; fontcolor="#a5b4fc"; fontsize=11;
      AMF [label="AMF\\n(Access & Mobility Control)", fillcolor="#4338ca", color="#818cf8"];
      SMF [label="SMF\\n(Session Management)", fillcolor="#4338ca", color="#818cf8"];
      UPF [label="UPF\\n(User Plane Data Gateway)", fillcolor="#0f766e", color="#2dd4bf"];
    }

    subgraph cluster_dn {
      label="[ LAYER 4: DATA NETWORK (DN) ]";
      style="rounded,dashed"; color="#f59e0b"; fontcolor="#fbbf24"; fontsize=11;
      DN [label="Data Network (DN)\\nInternet / IMS VoNR / Edge Cloud", fillcolor="#92400e", color="#fbbf24"];
    }

    UE -> gNB [label=" NR Uu (Radio Air Interface) ", color="#38bdf8", penwidth=3];
    gNB -> AMF [label=" N2 (NG-C Signaling) ", style="dashed", color="#f43f5e", fontcolor="#fda4af", penwidth=2];
    AMF -> SMF [label=" N11 (SBA Service-Based) ", style="dashed", color="#f43f5e", fontcolor="#fda4af", penwidth=2];
    SMF -> UPF [label=" N4 (PFCP Session Control) ", style="dashed", color="#f43f5e", fontcolor="#fda4af", penwidth=2];

    gNB -> UPF [label=" N3 (NG-U GTP-U Tunnel) ", color="#10b981", fontcolor="#6ee7b7", penwidth=3.5];
    UPF -> DN [label=" N6 (IP Routing) ", color="#10b981", fontcolor="#6ee7b7", penwidth=3.5];

    labelloc="b";
    label="\\n[HIERARKI ANTARMUKA 3GPP]\\n- Jalur Hijau Tebal: User Plane (Trafik Data N3 / N6)\\n- Garis Putus-Putus Merah: Control Plane (Pensinyalan N2 / N4 / N11)\\n- Garis Biru: Antarmuka Udara Radio (NR Uu)";
    fontcolor="#94a3b8"; fontsize=10;
  }`;
}

/**
 * Template Grafik Throughput vs Bottleneck Default (Mobile-First Contrast)
 */
function createDefaultThroughputChart(topic = '5G Throughput vs Bottleneck Factors') {
  return {
    type: 'bar',
    data: {
      labels: ['Radio Ideal (LoS)', 'Rank 4 (Good SINR)', 'PRB High Load', 'Backhaul Limited', 'High BLER (>10%)'],
      datasets: [
        {
          label: 'Throughput Downlink (Mbps)',
          data: [1200, 950, 220, 95, 80],
          backgroundColor: [
            'rgba(56, 189, 248, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderColor: ['#38bdf8', '#22c55e', '#eab808', '#ef4444', '#ef4444'],
          borderWidth: 2
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: `Simulasi Analisis Throughput: ${topic.slice(0, 40)}`,
        fontColor: '#f8fafc',
        fontSize: 16,
        padding: 16
      },
      legend: { labels: { fontColor: '#cbd5e1' } },
      scales: {
        xAxes: [{
          gridLines: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { fontColor: '#cbd5e1', fontSize: 11 }
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
 * Default fallback RF Path Loss & Blocker Curve Chart (High Contrast)
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
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          fill: true,
          tension: 0.3,
          borderWidth: 3
        },
        {
          label: 'RSRP Terhalang Blocker Beton (NLoS)',
          data: [-90, -100, -109, -118, -125, -132, -140],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
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
  const isArchitectureInquiry = /\b(arsitektur|architecture|topologi|topology|diagram|flow|call flow|stack|protokol|protocol|sa|nsa|o-ran|oran|ran|core|5gc|epc|enb|gnb|amf|upf|smf|mme|sgw|node|struktur|elemen|handover|attach|session)\b/i.test(topicContext);

  // 2. Evaluasi tipe simulasi via Gemini
  let simulationPlan = {
    type: isArchitectureInquiry ? 'diagram' : 'chart',
    dot: null,
    chartConfig: null,
    caption: ''
  };

  try {
    const promptPlan = `Analisis topik telekomunikasi berikut dan rancang visualisasi terbaik untuk layar ponsel WhatsApp:
"${topicContext}"

PANDUAN STANDAR VISUAL TELEKOMUNIKASI (MOBILE-FIRST 3GPP):
1. Jika topik menanyakan arsitektur, topologi jaringan, node RAN/Core, call flow, atau perbandingan SA vs NSA:
   PILIH "type": "diagram" dan buatkan kode Graphviz DOT yang VALID & RAPI.
   ATURAN WAJIB GRAPHVIZ:
   - bgcolor="#0b1120"
   - rankdir=TB (Wajib Top-to-Bottom agar tidak mengecil di layar HP vertikal)
   - node [shape=box, style="filled,rounded", fontname="Helvetica,Arial,sans-serif", fontsize=12, fontcolor="#ffffff", penwidth=2, margin="0.2,0.12"]
   - edge [fontname="Helvetica,Arial,sans-serif", fontsize=10, fontcolor="#e2e8f0"]
   - SKEMA WARNA SEMANTIK 3GPP:
     * User Equipment (UE): fillcolor="#0369a1", color="#38bdf8"
     * RAN Nodes (gNB, eNB, DU, RU): fillcolor="#065f46", color="#34d399"
     * Core Control Plane (AMF, SMF, MME): fillcolor="#4338ca", color="#818cf8"
     * Core User Plane (UPF, SGW): fillcolor="#0f766e", color="#2dd4bf"
     * Data Network / Internet: fillcolor="#92400e", color="#fbbf24"
   - TIPE PANAH ANTARMUKA:
     * User Plane Data (N3, N6, F1-U): color="#10b981", penwidth=3
     * Control Plane Signaling (N2, N4, N11, F1-C): style="dashed", color="#f43f5e", penwidth=2
     * Radio Air Interface (Uu): color="#38bdf8", penwidth=2.5
   - JANGAN gunakan emoji unicode di dalam label/nama node Graphviz (gunakan teks bersih seperti [LAYER 1: UE]).
   - Sertakan legend 2 baris di bagian bawah (labelloc="b").

2. Jika topik menanyakan angka/kuantitas (Throughput vs Bottleneck, PRB Loading, Latensi, RSRP vs Jarak):
   PILIH "type": "chart" dan buatkan chartConfig Chart.js (type: line atau bar) dengan tema gelap #0b1120.

Hasilkan HANYA JSON murni (tanpa markdown backticks):
{
  "type": "diagram" atau "chart",
  "dot": "digraph G { ... }",
  "chartConfig": { ... },
  "caption": "*Penjelasan teknis ringkas dalam Bahasa Indonesia (2-3 kalimat tipografi WhatsApp)*"
}`;

    const planRes = await callGeminiModel(promptPlan, 'You are an expert telecom visualizer and 3GPP systems architect. Return ONLY pure JSON.');
    if (planRes && planRes.success && planRes.text) {
      const cleanJson = planRes.text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed && (parsed.type === 'diagram' || parsed.type === 'chart')) {
        simulationPlan = parsed;
        console.log(`💡 [Simulation Service] Berhasil merancang visualisasi bertipe: ${parsed.type}`);
      }
    }
  } catch (planErr) {
    console.warn('⚠️ Gagal mem-parse rencana visual Gemini, menggunakan Golden Template kontekstual:', planErr.message);
  }

  // 3. Eksekusi pembuatan gambar
  let imageBuffer = null;

  // A. Eksekusi Graphviz Diagram jika tipe adalah "diagram" (atau jika topik arsitektur)
  if (simulationPlan.type === 'diagram' || (isArchitectureInquiry && simulationPlan.dot)) {
    try {
      const dotSource = simulationPlan.dot || getGoldenArchitectureTemplate(topicContext);
      imageBuffer = await generateGraphvizBuffer(dotSource);
      console.log('✅ [Simulation Service] Diagram arsitektur Graphviz berhasil dirender.');
    } catch (dotErr) {
      console.warn('⚠️ Gagal merender DOT kustom, beralih ke Golden Template arsitektur:', dotErr.message);
      try {
        imageBuffer = await generateGraphvizBuffer(getGoldenArchitectureTemplate(topicContext));
      } catch (fbErr) {
        console.error('❌ Gagal merender fallback Golden Template:', fbErr.message);
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
          imageBuffer = await generateGraphvizBuffer(getGoldenArchitectureTemplate(topicContext));
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

  // Fallback terakhir: jika arsitektur, buat Golden Template
  if (!imageBuffer && isArchitectureInquiry) {
    try {
      imageBuffer = await generateGraphvizBuffer(getGoldenArchitectureTemplate(topicContext));
    } catch (e) {}
  }

  const defaultCaption = isArchitectureInquiry
    ? '📡 *Diagram Arsitektur Jaringan Telekomunikasi TelcoLearn*\nMenampilkan interkoneksi antarmuka (interfaces) 3GPP berstandar vertikal antara User Equipment (UE), Radio Access Network (RAN), dan Core Network.'
    : '📊 *Visualisasi Analisis Kinerja Telekomunikasi TelcoLearn*';

  return {
    image: imageBuffer,
    caption: simulationPlan.caption || defaultCaption
  };
}
