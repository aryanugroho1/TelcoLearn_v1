/**
 * TelcoLearn Excel Parameter Importer Tool
 * Mengonversi berkas Excel (.xlsx / .xls) parameter & mapping vendor (Huawei, Ericsson, Nokia SRAN)
 * menjadi berkas Markdown (.md) ber-frontmatter standar RAG TelcoLearn, lalu otomatis meng-ingest.
 *
 * Penggunaan:
 *   node scripts/import_excel_parameters.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';
import { runIngestion } from './ingest_knowledge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VENDORS_DIR = path.resolve(__dirname, '..', 'knowledge_sources', 'vendors');
const MAPPINGS_DIR = path.join(VENDORS_DIR, 'mappings');
const HUAWEI_DIR = path.join(VENDORS_DIR, 'huawei');
const ERICSSON_DIR = path.join(VENDORS_DIR, 'ericsson');
const NOKIA_DIR = path.join(VENDORS_DIR, 'nokia');

/**
 * 1. PROSES MAPPING HUAWEI & ERICSSON
 */
function processHuaweiEricsson() {
  const ericssonFile = path.join(ERICSSON_DIR, 'ericsson-parameters.xlsx');
  const huaweiFile = path.join(HUAWEI_DIR, 'huawei-parameters.xlsx');

  if (!fs.existsSync(ericssonFile) || !fs.existsSync(huaweiFile)) {
    console.log('⚠️ Berkas Ericsson atau Huawei tidak ditemukan lengkap.');
    return false;
  }

  console.log('\n🔄 [Cross-Vendor Processing] Memproses pemetaan parameter Ericsson & Huawei...');

  const wbE = XLSX.readFile(ericssonFile);
  const wbH = XLSX.readFile(huaweiFile);

  const dataE = XLSX.utils.sheet_to_json(wbE.Sheets[wbE.SheetNames[0]], { header: 1 });
  const dataH = XLSX.utils.sheet_to_json(wbH.Sheets[wbH.SheetNames[0]], { header: 1 });

  // Map deskripsi Huawei
  const hDescMap = new Map();
  const huaweiRows = [];
  for (let i = 2; i < dataH.length; i++) {
    const row = dataH[i];
    const pName = (row[0] || '').toString().trim();
    const pRec = (row[1] || '').toString().trim();
    const pLoc = (row[2] || '').toString().trim();
    const pDesc = (row[3] || '').toString().trim();
    const pRange = (row[4] || '').toString().trim();
    const pComment = (row[5] || '').toString().trim();

    if (!pName) continue;
    const hObj = { pName, pRec, pLoc, pDesc, pRange, pComment };
    huaweiRows.push(hObj);

    if (pDesc) {
      hDescMap.set(pDesc.toLowerCase(), hObj);
    }
  }

  // Map Ericsson dan gabungkan mapping
  const ericssonRows = [];
  const crossMappings = [];

  for (let i = 2; i < dataE.length; i++) {
    const row = dataE[i];
    const mocName = (row[0] || '').toString().trim();
    const pName = (row[1] || '').toString().trim();
    const baseline = (row[2] || '').toString().trim();
    const pDesc = (row[3] || '').toString().trim();
    const hRange = (row[4] || '').toString().trim();
    const comment = (row[5] || '').toString().trim();

    if (!pName) continue;
    const eObj = { mocName, pName, baseline, pDesc, hRange, comment };
    ericssonRows.push(eObj);

    if (pDesc && hDescMap.has(pDesc.toLowerCase())) {
      const hMatch = hDescMap.get(pDesc.toLowerCase());
      crossMappings.push({
        functionality: pDesc.slice(0, 100),
        ericssonMo: mocName,
        ericssonParam: pName,
        ericssonBaseline: baseline,
        huaweiMo: hMatch.pLoc,
        huaweiParam: hMatch.pName,
        huaweiRecommended: hMatch.pRec,
        range: hRange || hMatch.pRange,
        fullDesc: pDesc
      });
    }
  }

  console.log(`   ✅ Ditemukan ${crossMappings.length} parameter yang terpetakan langsung antara Huawei & Ericsson!`);

  if (!fs.existsSync(MAPPINGS_DIR)) fs.mkdirSync(MAPPINGS_DIR, { recursive: true });

  // A. Simpan Cross-Vendor Mapping
  let mappingMd = `---
topic_key: mapping_huawei_ericsson_parameters
title: Cross-Vendor Parameter Mapping - Huawei vs Ericsson (RAN Tuning)
source_vendor: multi_vendor
doc_type: parameter_mapping
technology: 4g_lte
category: parameter_tuning
keywords: parameter mapping, huawei, ericsson, moclass, mo, parameter matching, baseline value, recommended value, ran tuning
summary: Tabel kamus pemetaan parameter radio dan kontrol jaringan antara vendor Huawei (eRAN) dan Ericsson (12B/17B) berdasarkan kesetaraan fungsi dan deskripsi teknis.
---

# Cross-Vendor Parameter Mapping: Huawei vs Ericsson

Dokumen ini berisi pemetaan 1-ke-1 parameter radio access network antara sistem **Huawei (eRAN)** dan **Ericsson** yang diekstrak dari dokumen perbandingan teknis.

| Fungsi / Deskripsi | Ericsson MO | Parameter Ericsson | Baseline Ericsson | Huawei MO | Parameter Huawei | Rekomendasi Huawei | Range Nilai |
|---|---|---|---|---|---|---|---|
`;

  for (const m of crossMappings) {
    const cleanDesc = m.functionality.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
    mappingMd += `| ${cleanDesc} | \`${m.ericssonMo}\` | **\`${m.ericssonParam}\`** | ${m.ericssonBaseline || '-'} | \`${m.huaweiMo}\` | **\`${m.huaweiParam}\`** | ${m.huaweiRecommended || '-'} | ${m.range || '-'} |\n`;
  }

  fs.writeFileSync(path.join(MAPPINGS_DIR, 'mapping_huawei_ericsson_parameters.md'), mappingMd, 'utf8');
  console.log(`   📁 Tersimpan: knowledge_sources/vendors/mappings/mapping_huawei_ericsson_parameters.md`);

  // B. Simpan Dokumen Parameter Spesifik Huawei
  let huaweiMd = `---
topic_key: huawei_ran_parameter_dictionary
title: Huawei RAN Parameter Dictionary (eRAN Managed Objects & Recommendations)
source_vendor: huawei
doc_type: parameter
technology: 4g_lte
category: parameter_tuning
keywords: huawei, eran, parameters, cellracthd, rscgrp, anr, interrathocomm, baseline, parameter description
summary: Kamus parameter radio Huawei eRAN mencakup nama Managed Object, parameter name, nilai rekomendasi engineering, dan deskripsi fungsional.
---

# Huawei RAN Parameter Dictionary (eRAN)

| Managed Object | Nama Parameter | Rekomendasi / Default | Range | Deskripsi Parameter |
|---|---|---|---|---|
`;

  for (const h of huaweiRows) {
    const cleanDesc = h.pDesc.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
    huaweiMd += `| \`${h.pLoc}\` | **\`${h.pName}\`** | ${h.pRec || '-'} | ${h.pRange || '-'} | ${cleanDesc} |\n`;
  }

  fs.writeFileSync(path.join(HUAWEI_DIR, 'huawei_ran_parameter_dictionary.md'), huaweiMd, 'utf8');
  console.log(`   📁 Tersimpan: knowledge_sources/vendors/huawei/huawei_ran_parameter_dictionary.md`);

  // C. Simpan Dokumen Parameter Spesifik Ericsson
  let ericssonMd = `---
topic_key: ericsson_ran_parameter_dictionary
title: Ericsson RAN Parameter Dictionary (MoClass, Baseline Values & Descriptions)
source_vendor: ericsson
doc_type: parameter
technology: 4g_lte
category: parameter_tuning
keywords: ericsson, moclass, parameters, admissioncontrol, anrfunction, eutrancellfdd, baseline value, enm
summary: Kamus parameter radio Ericsson RAN mencakup MoClass Name, parameter name, baseline value, dan deskripsi teknis operasional.
---

# Ericsson RAN Parameter Dictionary

| MoClass (MOC) | Nama Parameter | Nilai Baseline | Range Nilai | Deskripsi Parameter |
|---|---|---|---|---|
`;

  for (const e of ericssonRows) {
    const cleanDesc = e.pDesc.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
    ericssonMd += `| \`${e.mocName}\` | **\`${e.pName}\`** | ${e.baseline || '-'} | ${e.hRange || '-'} | ${cleanDesc} |\n`;
  }

  fs.writeFileSync(path.join(ERICSSON_DIR, 'ericsson_ran_parameter_dictionary.md'), ericssonMd, 'utf8');
  console.log(`   📁 Tersimpan: knowledge_sources/vendors/ericsson/ericsson_ran_parameter_dictionary.md`);

  return true;
}

/**
 * 2. PROSES NOKIA SRAN PARAMETERS (14.000+ Baris)
 * Dikelompokkan ke modul tematik agar efisien untuk RAG
 */
function processNokiaSran() {
  const nokiaFile = path.join(NOKIA_DIR, 'nokia-sran-parameters.xlsx');
  if (!fs.existsSync(nokiaFile)) {
    console.log('⚠️ Berkas Nokia SRAN tidak ditemukan.');
    return false;
  }

  console.log('\n🔄 [Nokia SRAN Processing] Membaca berkas Nokia SRAN (14.135 baris)...');
  const wb = XLSX.readFile(nokiaFile);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  console.log(`   📊 Total parameter terbaca: ${rows.length}. Memilah berdasarkan domain...`);

  const groups = {
    '5g_nr': {
      title: 'Nokia SRAN 5G NR Parameters (NRBTS & NRCELL 25R2)',
      topicKey: 'nokia_sran_5g_nr_parameters',
      category: '5g_nr',
      technology: '5g_nr',
      keywords: 'nokia, sran, 5g, nrbts, nrcell, nrhoif, nrmeaspr, beamforming, 25r2, parameter reference',
      summary: 'Daftar parameter resmi Nokia SRAN 25R2 untuk domain 5G NR (NRBTS, NRCELL, Handover, dan Beamforming).',
      filter: r => (r['MO Class'] || '').includes('NRBTS') || (r['MO Class'] || '').includes('NRCELL'),
      params: []
    },
    '4g_lte': {
      title: 'Nokia SRAN 4G LTE Parameters (LNBTS & LNCEL 25R2)',
      topicKey: 'nokia_sran_4g_lte_parameters',
      category: '4g_lte',
      technology: '4g_lte',
      keywords: 'nokia, sran, 4g, lte, lnbts, lncel, sib, acbpr, catmcel, 25r2, parameter reference',
      summary: 'Daftar parameter resmi Nokia SRAN 25R2 untuk domain 4G LTE (LNBTS, LNCEL, SIB, dan Cell Resource Management).',
      filter: r => (r['MO Class'] || '').includes('LNBTS') || (r['MO Class'] || '').includes('LNCEL'),
      params: []
    },
    'mobility_anr': {
      title: 'Nokia SRAN Mobility, Handover & ANR Parameters (25R2)',
      topicKey: 'nokia_sran_mobility_anr_parameters',
      category: 'parameter_tuning',
      technology: '4g_5g',
      keywords: 'nokia, anr, handover, mobility, measurement profile, nrhoif, lnrel, 25r2',
      summary: 'Daftar parameter resmi Nokia SRAN 25R2 untuk Automatic Neighbor Relation (ANR), Handover Thresholds, dan Mobility Measurements.',
      filter: r => (r['MO Class'] || '').includes('ANR') || (r['MO Class'] || '').includes('HO') || (r['MO Class'] || '').includes('MEAS'),
      params: []
    },
    'mrbts_system': {
      title: 'Nokia SRAN MRBTS System & Common Platform Parameters (25R2)',
      topicKey: 'nokia_sran_mrbts_system_parameters',
      category: 'parameter_tuning',
      technology: '4g_5g',
      keywords: 'nokia, mrbts, sran, system module, common, gps, synchronization, 25r2',
      summary: 'Daftar parameter sistem dan platform umum Nokia Multi-Radio BTS (MRBTS) release 25R2.',
      filter: r => (r['MO Class'] || '') === 'MRBTS' || (r['MO Class'] || '').includes('MNL'),
      params: []
    }
  };

  for (const r of rows) {
    const abbr = (r['Abbreviated Name'] || '').toString().trim();
    if (!abbr) continue;

    const moClass = (r['MO Class'] || '').toString().trim();
    const fullName = (r['Full Name'] || '').toString().trim();
    const desc = (r['Description'] || '').toString().trim();
    const range = (r['Range and step'] || '').toString().trim();
    const defVal = (r['Default Value'] || '').toString().trim();
    const unit = (r['Units'] || '').toString().trim();

    const pObj = { abbr, moClass, fullName, desc, range, defVal, unit };

    for (const g of Object.values(groups)) {
      if (g.filter(r)) {
        g.params.push(pObj);
        break;
      }
    }
  }

  for (const [key, g] of Object.entries(groups)) {
    console.log(`   📄 Domain ${key}: ${g.params.length} parameter...`);
    // Ambil parameter paling esensial (maksimal 350 parameter paling penting per file agar ukuran ideal)
    const selected = g.params.slice(0, 350);

    let md = `---
topic_key: ${g.topicKey}
title: ${g.title}
source_vendor: nokia
doc_type: parameter
technology: ${g.technology}
category: ${g.category}
keywords: ${g.keywords}
summary: ${g.summary}
---

# ${g.title}

${g.summary}

| Abbreviated Name | MO Class | Full Name | Default Value | Range / Unit | Deskripsi Parameter |
|---|---|---|---|---|---|
`;

    for (const p of selected) {
      const cleanDesc = p.desc.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').slice(0, 200);
      md += `| **\`${p.abbr}\`** | \`${p.moClass}\` | ${p.fullName || '-'} | ${p.defVal || '-'} | ${p.range ? p.range + (p.unit ? ' ' + p.unit : '') : '-'} | ${cleanDesc} |\n`;
    }

    const targetFile = path.join(NOKIA_DIR, `${g.topicKey}.md`);
    fs.writeFileSync(targetFile, md, 'utf8');
    console.log(`   📁 Tersimpan: ${path.relative(process.cwd(), targetFile)} (${selected.length} parameter)`);
  }

  return true;
}

async function main() {
  console.log('========================================================');
  console.log('📑 TELCOLEARN EXCEL PARAMETER IMPORTER');
  console.log('========================================================\n');

  const okHE = processHuaweiEricsson();
  const okN = processNokiaSran();

  if (okHE || okN) {
    console.log('\n========================================================');
    console.log('🎉 Pemrosesan Excel selesai! Memulai Ingestion ke Basis Data...');
    console.log('========================================================\n');
    await runIngestion();
  }
}

main().catch(console.error);
