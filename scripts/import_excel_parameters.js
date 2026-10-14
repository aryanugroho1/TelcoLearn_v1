/**
 * TelcoLearn Excel Parameter Importer Tool
 * Mengonversi berkas Excel (.xlsx / .xls) mapping parameter vendor (Huawei, Ericsson, Nokia SRAN)
 * menjadi berkas Markdown (.md) ber-frontmatter standar RAG TelcoLearn, lalu otomatis meng-ingest.
 *
 * Penggunaan:
 *   node scripts/import_excel_parameters.js <path-ke-file.xlsx>
 * Atau otomatis memindai file .xlsx di knowledge_sources/vendors/:
 *   node scripts/import_excel_parameters.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';
import { runIngestion } from './ingest_knowledge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VENDORS_DIR = path.resolve(__dirname, '..', 'knowledge_sources', 'vendors');
const MAPPINGS_TARGET_DIR = path.join(VENDORS_DIR, 'mappings');

/**
 * Membersihkan string untuk topic_key
 */
function sanitizeKey(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Format baris data sheet menjadi tabel Markdown
 */
function rowsToMarkdownTable(rows) {
  if (!rows || rows.length === 0) return '';

  const headers = Object.keys(rows[0]);
  if (headers.length === 0) return '';

  let tableMd = `| ${headers.join(' | ')} |\n`;
  tableMd += `| ${headers.map(() => '---').join(' | ')} |\n`;

  for (const row of rows) {
    const values = headers.map(h => {
      const val = row[h] !== undefined && row[h] !== null ? String(row[h]).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ') : '-';
      return val.trim();
    });
    tableMd += `| ${values.join(' | ')} |\n`;
  }

  return tableMd;
}

/**
 * Ekstraksi kata kunci dari data baris (parameter names, MOs, feature names)
 */
function extractKeywordsFromRows(rows, sheetName = '') {
  const keywordSet = new Set();
  if (sheetName) {
    sheetName.toLowerCase().split(/[\s_-]+/).forEach(k => {
      if (k.length >= 2) keywordSet.add(k);
    });
  }

  for (const row of rows) {
    for (const [key, val] of Object.entries(row)) {
      const strVal = String(val || '').trim();
      // Tangkap parameter name atau MO (kata camelCase atau ALL_CAPS dengan panjang >= 3)
      const matches = strVal.match(/\b[A-Za-z0-9_]{3,35}\b/g);
      if (matches) {
        matches.slice(0, 5).forEach(m => {
          if (!/^\d+$/.test(m)) keywordSet.add(m.toLowerCase());
        });
      }
    }
  }

  return Array.from(keywordSet).slice(0, 25).join(', ');
}

/**
 * Proses berkas Excel tunggal
 */
export async function processExcelFile(filePath) {
  console.log(`\n📊 [Membaca Excel] ${path.basename(filePath)}...`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Berkas tidak ditemukan: ${filePath}`);
    return false;
  }

  let workbook;
  try {
    workbook = XLSX.readFile(filePath);
  } catch (err) {
    console.error(`❌ Gagal membuka berkas Excel: ${err.message}`);
    return false;
  }

  const baseFileName = path.basename(filePath, path.extname(filePath));
  const isHuawei = /huawei/i.test(baseFileName);
  const isEricsson = /ericsson/i.test(baseFileName);
  const isNokia = /nokia/i.test(baseFileName);
  const isMapping = /mapping/i.test(baseFileName) || (isHuawei && isEricsson);

  let targetDir = MAPPINGS_TARGET_DIR;
  let sourceVendor = 'multi_vendor';
  if (isMapping) {
    targetDir = MAPPINGS_TARGET_DIR;
    sourceVendor = 'multi_vendor';
  } else if (isNokia) {
    targetDir = path.join(VENDORS_DIR, 'nokia');
    sourceVendor = 'nokia';
  } else if (isHuawei) {
    targetDir = path.join(VENDORS_DIR, 'huawei');
    sourceVendor = 'huawei';
  } else if (isEricsson) {
    targetDir = path.join(VENDORS_DIR, 'ericsson');
    sourceVendor = 'ericsson';
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let totalSheetsProcessed = 0;

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    // Konversi sheet ke array of objects
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '-' });

    if (!jsonData || jsonData.length === 0) {
      console.log(`   ⚠️ Sheet "${sheetName}" kosong, dilewati.`);
      continue;
    }

    console.log(`   📄 Memproses Sheet: "${sheetName}" (${jsonData.length} baris data)...`);

    const sanitizedSheet = sanitizeKey(sheetName);
    const sanitizedFile = sanitizeKey(baseFileName);
    const topicKey = `param_${sanitizedFile}_${sanitizedSheet}`;
    const targetFile = path.join(targetDir, `${topicKey}.md`);

    const markdownTable = rowsToMarkdownTable(jsonData);
    const keywords = extractKeywordsFromRows(jsonData, `${baseFileName} ${sheetName}`);

    let titlePrefix = 'Vendor Parameter Reference';
    if (isMapping) titlePrefix = 'Cross-Vendor Parameter Mapping (Huawei vs Ericsson vs Nokia)';
    else if (isNokia) titlePrefix = 'Nokia SRAN Parameter Reference';
    else if (isHuawei) titlePrefix = 'Huawei RAN Parameter Reference';
    else if (isEricsson) titlePrefix = 'Ericsson RAN Parameter Reference';

    const title = `${titlePrefix} - ${sheetName}`;
    const summary = `Tabel pemetaan dan acuan parameter ${sheetName} untuk vendor telekomunikasi (${baseFileName}) yang diekstrak dari dokumen spreadsheet internal.`;

    const markdownOutput = `---
topic_key: ${topicKey}
title: ${title}
source_vendor: ${sourceVendor}
doc_type: parameter_mapping
technology: 4g_5g
category: parameter_tuning
keywords: parameter, mapping, ${keywords}
summary: ${summary}
---

# ${title}

${summary}

${markdownTable}
`;

    fs.writeFileSync(targetFile, markdownOutput, 'utf8');
    console.log(`   ✅ Tersimpan naskah RAG: ${path.relative(process.cwd(), targetFile)}`);
    totalSheetsProcessed++;
  }

  return totalSheetsProcessed > 0;
}

async function main() {
  console.log('========================================================');
  console.log('📑 TELCOLEARN EXCEL PARAMETER IMPORTER');
  console.log('========================================================\n');

  const args = process.argv.slice(2);
  let filesToProcess = [];

  if (args.length > 0) {
    // Mode argumen berkas spesifik
    filesToProcess = args.map(a => path.resolve(process.cwd(), a));
  } else {
    // Mode pindai otomatis folder knowledge_sources/vendors/
    console.log(`🔍 Memindai berkas .xlsx dan .xls di: ${VENDORS_DIR}...\n`);
    function scanExcel(dir) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir);
      for (const e of entries) {
        const full = path.join(dir, e);
        if (fs.statSync(full).isDirectory()) {
          scanExcel(full);
        } else {
          const lower = e.toLowerCase();
          if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv')) {
            filesToProcess.push(full);
          }
        }
      }
    }
    scanExcel(VENDORS_DIR);
  }

  if (filesToProcess.length === 0) {
    console.log('ℹ️ Tidak ada berkas Excel yang ditemukan.');
    console.log('💡 Cara Penggunaan:');
    console.log('   1. Salin berkas .xlsx Anda ke:');
    console.log('      👉 telcolearn-engine/knowledge_sources/vendors/ (atau subfolder huawei/ericsson/nokia)');
    console.log('   2. Jalankan:');
    console.log('      👉 node scripts/import_excel_parameters.js');
    console.log('   Atau langsung sebutkan path berkasnya:');
    console.log('      👉 node scripts/import_excel_parameters.js "C:\\path\\ke\\file_mapping.xlsx"');
    return;
  }

  let successCount = 0;
  for (const fp of filesToProcess) {
    const ok = await processExcelFile(fp);
    if (ok) successCount++;
  }

  if (successCount > 0) {
    console.log('\n========================================================');
    console.log(`🎉 Berhasil memproses ${successCount} berkas Excel!`);
    console.log('💡 Menjalankan Ingestion otomatis ke database TelcoLearn...\n');
    await runIngestion();
  }
}

if (process.argv[1] && process.argv[1].endsWith('import_excel_parameters.js')) {
  main().catch(console.error);
}
