/**
 * TelcoLearn Standards Mirroring & Ingestion Tool
 * Mirrors official telecom specifications in clean Markdown from the
 * Open-Telco Corpus (HuggingFace datasets: GSMA/3GPP and GSMA/oran)
 *
 * Usage:
 *   node scripts/mirror_standards.js --3gpp
 *   node scripts/mirror_standards.js --oran
 *   node scripts/mirror_standards.js --spec 38331
 *   node scripts/mirror_standards.js --all
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWLEDGE_SOURCES_DIR = path.resolve(__dirname, '..', 'knowledge_sources');
const TARGET_3GPP_DIR = path.join(KNOWLEDGE_SOURCES_DIR, '3gpp', 'mirrored');
const TARGET_ORAN_DIR = path.join(KNOWLEDGE_SOURCES_DIR, 'oran', 'mirrored');

// Daftar spesifikasi 3GPP paling krusial untuk telecommunication engineer
const ESSENTIAL_3GPP_SPECS = [
  // 5G NR Radio Access Network (38 Series)
  {
    rel: 'Rel-17',
    series: '38_series',
    spec: '38331',
    ts: 'TS 38.331',
    title: '5G NR Radio Resource Control (RRC) Protocol Specification',
    category: '5g_nr',
    technology: '5g_nr',
    keywords: 'rrc, signaling, 38.331, timers, t300, t304, t310, t311, information elements, measurement report, rrc connection, handover, rlf',
    extracts: [
      {
        subKey: 'timers',
        title: '3GPP TS 38.331 - 5G NR RRC Timers (T300, T301, T304, T310, T311) & Constants',
        keywords: 't300, t301, t302, t304, t310, t311, t319, n310, n311, rrc timers, radio link failure, rlf, handover failure',
        startPattern: '## 7.1 Timers',
        endPattern: '## 7.3 Constants'
      }
    ]
  },
  {
    rel: 'Rel-17',
    series: '38_series',
    spec: '38300',
    ts: 'TS 38.300',
    title: '5G NR and NG-RAN Overall Description (Stage 2 Architecture)',
    category: '5g_nr',
    technology: '5g_nr',
    keywords: 'nr architecture, ng-ran, 38.300, en-dc, sa, nsa, cu-du split, dual connectivity, gnb, user plane, control plane, srb, drb'
  },
  {
    rel: 'Rel-17',
    series: '38_series',
    spec: '38214',
    ts: 'TS 38.214',
    title: '5G NR Physical Layer Procedures for Data (MCS, CQI, Modulation, MIMO)',
    category: '5g_nr',
    technology: '5g_nr',
    keywords: 'mcs, cqi, 38.214, modulation, 256qam, 64qam, qpsk, link adaptation, olla, csi reporting, pdsch, pusch, csi-rs, tbs',
    extracts: [
      {
        subKey: 'mcs_cqi',
        title: '3GPP TS 38.214 - 5G NR Modulation, MCS Tables & CQI Reporting',
        keywords: 'mcs table, cqi table, 256qam, 64qam, code rate, spectral efficiency, csi reporting, sinr, link adaptation',
        startPattern: '## 5.1.3 Modulation order',
        endPattern: '## 5.3 UE PDSCH processing'
      }
    ]
  },
  {
    rel: 'Rel-17',
    series: '38_series',
    spec: '38321',
    ts: 'TS 38.321',
    title: '5G NR Medium Access Control (MAC) Protocol Specification (RACH, Scheduling, DRX)',
    category: '5g_nr',
    technology: '5g_nr',
    keywords: 'mac, 38.321, rach, random access, rar, bsr, phr, drx, c-drx, harq, scheduling, contention resolution, msg1, msg2, msg3, msg4',
    extracts: [
      {
        subKey: 'rach',
        title: '3GPP TS 38.321 - 5G NR Random Access Procedure (RACH CBRA & CFRA)',
        keywords: 'rach, random access, preamble, msg1, rar, msg2, msg3, msg4, contention resolution, cbra, cfra, 2-step rach',
        startPattern: '## 5.1 Random Access procedure',
        endPattern: '## 5.2 Maintenance of Uplink Time Alignment'
      }
    ]
  },
  {
    rel: 'Rel-17',
    series: '38_series',
    spec: '38211',
    ts: 'TS 38.211',
    title: '5G NR Physical Channels and Modulation (Frame Structure, SCS Numerology, PRB)',
    category: '5g_nr',
    technology: '5g_nr',
    keywords: 'physical channels, 38.211, numerology, subcarrier spacing, scs, frame structure, slot format, prb, ofdm, ssb, pbch, pdcch, pdsch, prach, pusch, pucch'
  },
  {
    rel: 'Rel-17',
    series: '38_series',
    spec: '38213',
    ts: 'TS 38.213',
    title: '5G NR Physical Layer Procedures for Control (Beam Management, PDCCH, PUCCH)',
    category: '5g_nr',
    technology: '5g_nr',
    keywords: 'control procedures, 38.213, beam management, beam failure recovery, bfr, pdcch, pucch, power control, tpc, search space, coreset, bwp'
  },
  {
    rel: 'Rel-17',
    series: '38_series',
    spec: '38401',
    ts: 'TS 38.401',
    title: 'NG-RAN Architecture Description (gNB CU-DU Split, E1 and F1 Interfaces)',
    category: '5g_nr',
    technology: '5g_nr',
    keywords: 'cu-du split, 38.401, f1-c, f1-u, e1 interface, rrc, pdcp, rlc, mac, functional split, open ran, gnb-cu, gnb-du'
  },
  {
    rel: 'Rel-17',
    series: '38_series',
    spec: '38413',
    ts: 'TS 38.413',
    title: 'NG-RAN NG Application Protocol (NGAP) (gNodeB to AMF Signaling Interface)',
    category: 'protocol_qa',
    technology: '5g_nr',
    keywords: 'ngap, 38.413, n2 interface, initial ue message, pdu session resource setup, path switch, ng handover, amf, gnb'
  },

  // 5G Core Network & Non-Access-Stratum (23 & 24 Series - Rel-18 5G-Advanced)
  {
    rel: 'Rel-18',
    series: '24_series',
    spec: '24501',
    ts: 'TS 24.501',
    title: '5G Non-Access-Stratum (NAS) Protocol for 5GS (5GMM & 5GSM Procedures and Cause Codes)',
    category: 'protocol_qa',
    technology: '5gc',
    keywords: 'nas, 24.501, 5gmm, 5gsm, cause code, plmn not allowed, dnn, registration reject, pdu session establishment, n1 mode, n1 nas',
    extracts: [
      {
        subKey: 'cause_codes',
        title: '3GPP TS 24.501 - 5G NAS Cause Values (5GMM Mobility & 5GSM Session Causes)',
        keywords: '5gmm cause, 5gsm cause, cause #3, cause #7, cause #11, cause #12, cause #13, cause #27, cause #31, cause #26, cause #28, plmn not allowed',
        startPattern: '## Annex A (informative): Cause values for 5GS mobility management',
        endPattern: '## Annex C (normative)'
      }
    ]
  },
  {
    rel: 'Rel-18',
    series: '23_series',
    spec: '23501',
    ts: 'TS 23.501',
    title: '5G System Architecture (5GC SBA, AMF, SMF, UPF, Interfaces N2/N3/N4, QoS 5QI)',
    category: '5gc',
    technology: '5gc',
    keywords: '5gc, sba, 23.501, amf, smf, upf, pcf, nrf, udm, ausf, n2, n3, n4, n6, qos flow, 5qi, network slicing, s-nssai, sst, sd',
    extracts: [
      {
        subKey: 'architecture_sba',
        title: '3GPP TS 23.501 - 5G System Architecture Reference Model & Network Functions',
        keywords: 'sba, amf, smf, upf, pcf, udm, ausf, nrf, nssf, nef, n1, n2, n3, n4, n6, n9, service based architecture, reference points',
        startPattern: '## 4.1 General concepts',
        endPattern: '## 5 High level features'
      }
    ]
  },
  {
    rel: 'Rel-18',
    series: '23_series',
    spec: '23502',
    ts: 'TS 23.502',
    title: '5G System Procedures (Registration, PDU Session Setup, Handover Flows)',
    category: '5gc',
    technology: '5gc',
    keywords: '5gc procedures, 23.502, registration flow, pdu session establishment, n4 pfcp, handover, xn handover, n2 handover, amf selection, smf selection',
    extracts: [
      {
        subKey: 'registration_flow',
        title: '3GPP TS 23.502 - 5G Registration Management Procedures (Initial Registration Flow)',
        keywords: 'initial registration, 23.502, registration request, amf, ausf, udm, smf, authentication vector, nas security, pcf',
        startPattern: '## 4.2 Connection, Registration and Mobility Management procedures',
        endPattern: '## 4.3 Session Management procedures'
      }
    ]
  },

  // Multi-RAT & 4G LTE (37 & 36 Series)
  {
    rel: 'Rel-17',
    series: '37_series',
    spec: '37340',
    ts: 'TS 37.340',
    title: 'Multi-connectivity Overall Description (Stage 2) (EN-DC Option 3x / NGEN-DC)',
    category: '5g_nr',
    technology: '5g_nr',
    keywords: 'en-dc, 37.340, option 3x, dual connectivity, menb, sgnb, split bearer, mcg, scg, secondary node addition, x2-c, x2-u'
  },
  {
    rel: 'Rel-17',
    series: '36_series',
    spec: '36331',
    ts: 'TS 36.331',
    title: '4G LTE E-UTRA Radio Resource Control (RRC) Protocol Specification',
    category: '4g_lte',
    technology: '4g_lte',
    keywords: 'lte rrc, 36.331, 4g signaling, initial attach, lte timers, t300, t304, t310, t311, s1ap, rrc connection setup, rrc connection re-establishment'
  },
  {
    rel: 'Rel-17',
    series: '36_series',
    spec: '36300',
    ts: 'TS 36.300',
    title: '4G LTE E-UTRA and E-UTRAN Overall Description (Stage 2 Architecture)',
    category: '4g_lte',
    technology: '4g_lte',
    keywords: '4g architecture, 36.300, e-utran, epc, enodeb, s1-mme, s1-u, x2-c, x2-u, default bearer, dedicated bearer, qci'
  }
];

// Daftar spesifikasi O-RAN paling krusial
const ESSENTIAL_ORAN_SPECS = [
  {
    wg: 'WG1',
    docFolder: 'O-RAN.WG1.TS.OAD-R005-v16.00',
    docKey: 'oran_wg1_oad_architecture',
    title: 'O-RAN WG1 Architecture Description (OAD) (SMO, Non-RT RIC, Near-RT RIC, O-CU, O-DU, O-RU)',
    category: 'o_ran',
    technology: 'o_ran',
    keywords: 'o-ran architecture, oad, wg1, smo, non-rt ric, near-rt ric, o-cu, o-du, o-ru, a1 interface, o1 interface, e2 interface, open fronthaul, 7.2x'
  },
  {
    wg: 'WG3',
    docFolder: 'O-RAN.WG3.TS.RICARCH-R005-v08.00',
    docKey: 'oran_wg3_near_rt_ric_arch',
    title: 'O-RAN WG3 Near-Real-Time RAN Intelligent Controller (Near-RT RIC) Architecture',
    category: 'o_ran',
    technology: 'o_ran',
    keywords: 'near-rt ric, wg3, xapp, ric architecture, e2 node, database sdl, message bus, conflict mitigation, telemetry'
  },
  {
    wg: 'WG3',
    docFolder: 'O-RAN.WG3.TS.E2AP-R004-v07.00',
    docKey: 'oran_wg3_e2ap_protocol',
    title: 'O-RAN WG3 E2 Application Protocol (E2AP) Specification',
    category: 'o_ran',
    technology: 'o_ran',
    keywords: 'e2ap, wg3, e2 subscription, e2 indication, e2 control, e2 setup, ric service update, e2sm, kpm, rc'
  },
  {
    wg: 'WG4',
    docFolder: 'O-RAN.WG4.TS.CUS.0-R005-v20.00',
    docKey: 'oran_wg4_open_fronthaul_split_7_2x',
    title: 'O-RAN WG4 Open Fronthaul Control, User and Synchronization (CUS) Plane (Split 7.2x)',
    category: 'o_ran',
    technology: 'o_ran',
    keywords: 'open fronthaul, wg4, split 7.2x, cus plane, ecpri, o-du, o-ru, iq compression, synchronization, prb allocation, beamforming'
  }
];

// Helper aman mengunduh berkas teks dari HuggingFace (menggunakan ArrayBuffer & Buffer untuk menghindari bug alokasi undici V8 di Windows)
async function downloadHfRaw(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('utf8');
}

/**
 * Membersihkan naskah spesifikasi dengan memotong tabel Contents (TOC) raksasa
 * dan mengambil bagian substansi teknis (Scope, Definitions, Architecture, Procedures)
 */
function extractCleanSpecContent(rawContent, maxChars = 45000) {
  const scopePatterns = [
    /\n##?\s+1\s+Scope/i,
    /\n##?\s+1\s+Overview/i,
    /\n##?\s+1\s+Introduction/i,
    /\n##?\s+1\s+/i,
    /\n##?\s+Scope/i
  ];

  let bodyStartIndex = -1;
  for (const pat of scopePatterns) {
    const idx = rawContent.search(pat);
    if (idx !== -1) {
      bodyStartIndex = idx;
      break;
    }
  }

  // Jika tidak ditemukan Scope, cari Clause 4 (General Architecture)
  if (bodyStartIndex === -1) {
    const genIdx = rawContent.search(/\n##?\s+4\s+General/i);
    if (genIdx !== -1) bodyStartIndex = genIdx;
  }

  // Jika tetap tidak ditemukan, potong tabel Contents
  if (bodyStartIndex === -1) {
    const contentsIdx = rawContent.indexOf('# Contents');
    if (contentsIdx !== -1) {
      bodyStartIndex = Math.min(rawContent.length - 1000, contentsIdx + 40000);
    } else {
      bodyStartIndex = 0;
    }
  }

  const technicalBody = rawContent.slice(bodyStartIndex).trim();
  if (technicalBody.length <= maxChars) {
    return technicalBody;
  }

  return technicalBody.slice(0, maxChars) + '\n\n*(Catatan: Naskah spesifikasi teknis lengkap bersambung pada rilis standar resmi 3GPP/O-RAN di Open-Telco Corpus...)*';
}

/**
 * Mengekstrak sub-bagian spesifik bernilai tinggi (misal: Tabel Timers, Cause Codes, MCS Tables, RACH flow)
 */
function extractSubSection(rawContent, startPattern, endPattern, maxChars = 45000) {
  const startIdx = typeof startPattern === 'string' 
    ? rawContent.indexOf(startPattern) 
    : rawContent.search(startPattern);
  if (startIdx === -1) return null;

  let endIdx = -1;
  if (endPattern) {
    endIdx = typeof endPattern === 'string'
      ? rawContent.indexOf(endPattern, startIdx + (typeof startPattern === 'string' ? startPattern.length : 10))
      : rawContent.slice(startIdx + 10).search(endPattern);
    if (endIdx !== -1 && typeof endPattern !== 'string') {
      endIdx += startIdx + 10;
    }
  }

  let subText = endIdx !== -1 
    ? rawContent.slice(startIdx, endIdx).trim()
    : rawContent.slice(startIdx, startIdx + maxChars).trim();

  if (subText.length > maxChars) {
    subText = subText.slice(0, maxChars) + '\n\n*(Catatan: Rincian tabel bersambung pada rilis spesifikasi resmi...)*';
  }

  return subText;
}

/**
 * Mirror 3GPP Specification
 */
async function mirror3gppSpec(specInfo) {
  const hfUrl = `https://huggingface.co/datasets/GSMA/3GPP/resolve/main/marked/${specInfo.rel}/${specInfo.series}/${specInfo.spec}/raw.md`;
  console.log(`⬇️ [Mirroring 3GPP] ${specInfo.ts} (${specInfo.title})...`);
  console.log(`   URL: ${hfUrl}`);

  try {
    const rawContent = await downloadHfRaw(hfUrl);
    console.log(`   ✅ Berhasil diunduh (${(rawContent.length / 1024).toFixed(1)} KB)`);

    if (!fs.existsSync(TARGET_3GPP_DIR)) {
      fs.mkdirSync(TARGET_3GPP_DIR, { recursive: true });
    }

    // 1. Simpan dokumen spesifikasi utama (bersih dari TOC)
    const sanitizedTopicKey = `3gpp_${specInfo.spec}_${specInfo.rel.toLowerCase().replace('-', '_')}`;
    const targetFile = path.join(TARGET_3GPP_DIR, `${sanitizedTopicKey}.md`);
    const cleanContent = extractCleanSpecContent(rawContent);

    const mainFileOutput = `---
topic_key: ${sanitizedTopicKey}
title: 3GPP ${specInfo.ts} (${specInfo.rel}) - ${specInfo.title}
source_vendor: 3gpp
doc_type: specification
technology: ${specInfo.technology || '5g_nr'}
category: ${specInfo.category || '5g_nr'}
keywords: ${specInfo.keywords}
summary: Salinan dokumen spesifikasi resmi 3GPP ${specInfo.ts} (${specInfo.rel}) dari repositori GSMA/3GPP Open-Telco Corpus.
---

${cleanContent}
`;

    fs.writeFileSync(targetFile, mainFileOutput, 'utf8');
    console.log(`   📁 Tersimpan spesifikasi utama: ${path.relative(process.cwd(), targetFile)}`);

    // 2. Ekstrak sub-bagian bernilai tinggi jika dikonfigurasi (misal: Timers, Cause Codes, MCS)
    if (specInfo.extracts && Array.isArray(specInfo.extracts)) {
      for (const ext of specInfo.extracts) {
        const extractedText = extractSubSection(rawContent, ext.startPattern, ext.endPattern);
        if (extractedText && extractedText.length > 200) {
          const extKey = `3gpp_${specInfo.spec}_${ext.subKey}`;
          const extFile = path.join(TARGET_3GPP_DIR, `${extKey}.md`);
          const extOutput = `---
topic_key: ${extKey}
title: ${ext.title}
source_vendor: 3gpp
doc_type: specification_clause
technology: ${specInfo.technology || '5g_nr'}
category: ${specInfo.category || '5g_nr'}
keywords: ${ext.keywords}
summary: Ekstraksi klausul teknis penting ${ext.title} dari 3GPP ${specInfo.ts}.
---

${extractedText}
`;
          fs.writeFileSync(extFile, extOutput, 'utf8');
          console.log(`   ⭐ Tersimpan klausul teknis fokus: ${path.relative(process.cwd(), extFile)}`);
        }
      }
    }

    console.log('');
    return true;
  } catch (err) {
    console.error(`   ❌ Gagal mengunduh ${specInfo.ts}:`, err.message, '\n');
    return false;
  }
}

/**
 * Mirror O-RAN Specification
 */
async function mirrorOranSpec(spec) {
  const rawUrl = `https://huggingface.co/datasets/GSMA/oran/resolve/main/marked/${spec.wg}/${spec.docFolder}/raw.md`;
  console.log(`⬇️ [Mirroring O-RAN] ${spec.wg} - ${spec.title}...`);
  console.log(`   URL: ${rawUrl}`);

  try {
    const rawContent = await downloadHfRaw(rawUrl);
    console.log(`   ✅ Berhasil diunduh (${(rawContent.length / 1024).toFixed(1)} KB)`);

    if (!fs.existsSync(TARGET_ORAN_DIR)) {
      fs.mkdirSync(TARGET_ORAN_DIR, { recursive: true });
    }

    const targetFile = path.join(TARGET_ORAN_DIR, `${spec.docKey}.md`);
    const cleanContent = extractCleanSpecContent(rawContent);

    const fileOutput = `---
topic_key: ${spec.docKey}
title: ${spec.title}
source_vendor: o_ran
doc_type: specification
technology: ${spec.technology || 'o_ran'}
category: ${spec.category || 'o_ran'}
keywords: ${spec.keywords}
summary: Salinan spesifikasi resmi O-RAN ${spec.wg} (${spec.docFolder}) dari repositori GSMA/oran Open-Telco Corpus.
---

${cleanContent}
`;

    fs.writeFileSync(targetFile, fileOutput, 'utf8');
    console.log(`   📁 Tersimpan: ${path.relative(process.cwd(), targetFile)}\n`);
    return true;
  } catch (err) {
    console.error(`   ❌ Gagal mengunduh O-RAN ${spec.title}:`, err.message, '\n');
    return false;
  }
}

async function main() {
  console.log('========================================================');
  console.log('🌐 TELCOLEARN STANDARDS MIRRORING (GSMA/3GPP & GSMA/oran)');
  console.log('========================================================\n');

  const args = process.argv.slice(2);
  const specArgIdx = args.indexOf('--spec');
  const targetSpecId = specArgIdx !== -1 && args[specArgIdx + 1] ? args[specArgIdx + 1].trim() : null;

  const doAll = (args.includes('--all') || args.length === 0) && !targetSpecId;
  const do3gpp = doAll || args.includes('--3gpp') || !!targetSpecId;
  const doOran = (doAll || args.includes('--oran')) && !targetSpecId;

  let successCount = 0;

  if (do3gpp) {
    const specsToProcess = targetSpecId
      ? ESSENTIAL_3GPP_SPECS.filter(s => s.spec === targetSpecId || s.ts.toLowerCase().includes(targetSpecId.toLowerCase()))
      : ESSENTIAL_3GPP_SPECS;

    console.log(`📋 Memulai sinkronisasi ${specsToProcess.length} spesifikasi 3GPP...\n`);
    for (const spec of specsToProcess) {
      const ok = await mirror3gppSpec(spec);
      if (ok) successCount++;
    }
  }

  if (doOran) {
    console.log(`📋 Memulai sinkronisasi ${ESSENTIAL_ORAN_SPECS.length} spesifikasi O-RAN kunci...\n`);
    for (const o of ESSENTIAL_ORAN_SPECS) {
      const ok = await mirrorOranSpec(o);
      if (ok) successCount++;
    }
  }

  console.log('========================================================');
  console.log(`🎉 Mirroring Selesai! Berhasil memproses: ${successCount} spesifikasi.`);
  console.log('💡 Menjalankan Ingestion otomatis ke database TelcoLearn...\n');

  // Trigger auto-ingestion langsung
  const { runIngestion } = await import('./ingest_knowledge.js');
  await runIngestion();
}

main().catch(console.error);
