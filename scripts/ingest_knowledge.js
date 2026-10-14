/**
 * TelcoLearn Knowledge Ingestion Pipeline
 * Memindai berkas Markdown (.md dengan frontmatter) dan JSON di folder knowledge_sources/
 * lalu meng-upsert ke tabel knowledge_base di SQLite dan PostgreSQL Coolify.
 *
 * Jalankan: node scripts/ingest_knowledge.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb } from '../database/db.js';
import { getPgPool } from '../services/postgres.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const KNOWLEDGE_SOURCES_DIR = path.resolve(__dirname, '..', 'knowledge_sources');

/**
 * Parser YAML Frontmatter Sederhana (Zero-Dependency)
 */
function parseMarkdownWithFrontmatter(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: fileContent.trim() };
  }

  const rawFrontmatter = match[1];
  const content = match[2].trim();
  const frontmatter = {};

  const lines = rawFrontmatter.split(/\r?\n/);
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      // Hapus tanda petik jika ada
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      frontmatter[key] = val;
    }
  }

  return { frontmatter, content };
}

/**
 * Rekursif mencari semua berkas .md dan .json di dalam direktori
 */
function getAllDocFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllDocFiles(fullPath, arrayOfFiles);
    } else {
      const lower = file.toLowerCase();
      if ((lower.endsWith('.md') || lower.endsWith('.json')) && lower !== 'readme.md') {
        arrayOfFiles.push(fullPath);
      }
    }
  }

  return arrayOfFiles;
}

async function runIngestion() {
  console.log('========================================================');
  console.log('📚 TELCOLEARN KNOWLEDGE INGESTION PIPELINE');
  console.log('========================================================\n');

  if (!fs.existsSync(KNOWLEDGE_SOURCES_DIR)) {
    console.error(`❌ Direktori tidak ditemukan: ${KNOWLEDGE_SOURCES_DIR}`);
    process.exit(1);
  }

  const docFiles = getAllDocFiles(KNOWLEDGE_SOURCES_DIR);
  console.log(`🔍 Ditemukan ${docFiles.length} berkas sumber pengetahuan untuk di-ingest.\n`);

  if (docFiles.length === 0) {
    console.log('⚠️ Belum ada berkas materi di knowledge_sources/ (silakan tambahkan berkas .md atau .json).');
    return;
  }

  const db = getDb();
  let successCount = 0;
  let skipCount = 0;

  // Persiapan SQLite Statement
  const upsertSqlite = db.prepare(`
    INSERT INTO knowledge_base (topic_key, title, keywords, category, source_vendor, doc_type, technology, summary, core_content)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(topic_key) DO UPDATE SET
      title = excluded.title,
      keywords = excluded.keywords,
      category = excluded.category,
      source_vendor = excluded.source_vendor,
      doc_type = excluded.doc_type,
      technology = excluded.technology,
      summary = excluded.summary,
      core_content = excluded.core_content,
      created_at = CURRENT_TIMESTAMP
  `);

  // Inisialisasi PostgreSQL jika ada
  const pgPool = getPgPool();
  if (pgPool) {
    try {
      await pgPool.query(`
        CREATE TABLE IF NOT EXISTS knowledge_base (
          id SERIAL PRIMARY KEY,
          topic_key VARCHAR(128) UNIQUE NOT NULL,
          title TEXT NOT NULL,
          keywords TEXT NOT NULL,
          category VARCHAR(64) NOT NULL,
          source_vendor VARCHAR(64) DEFAULT '3gpp',
          doc_type VARCHAR(64) DEFAULT 'general',
          technology VARCHAR(64) DEFAULT '5g_nr',
          summary TEXT NOT NULL,
          core_content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_pg_kb_topic ON knowledge_base(topic_key);
        CREATE INDEX IF NOT EXISTS idx_pg_kb_vendor ON knowledge_base(source_vendor, technology);
      `);
      console.log('🐘 [PostgreSQL] Skema knowledge_base terverifikasi di PostgreSQL Coolify.');
    } catch (pgInitErr) {
      console.warn('⚠️ [PostgreSQL Init Warning]:', pgInitErr.message);
    }
  }

  for (const filePath of docFiles) {
    const relPath = path.relative(KNOWLEDGE_SOURCES_DIR, filePath);
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      let entry = null;

      if (filePath.endsWith('.json')) {
        entry = JSON.parse(raw);
      } else {
        const { frontmatter, content } = parseMarkdownWithFrontmatter(raw);
        entry = {
          ...frontmatter,
          core_content: content
        };
      }

      if (!entry.topic_key || !entry.title || !entry.core_content) {
        console.warn(`⚠️ [Lewati] ${relPath}: Field wajib (topic_key, title, core_content) tidak lengkap.`);
        skipCount++;
        continue;
      }

      const topic_key = entry.topic_key.trim();
      const title = entry.title.trim();
      const keywords = (entry.keywords || '').trim();
      const category = (entry.category || entry.technology || '5g_nr').trim();
      const source_vendor = (entry.source_vendor || '3gpp').trim().toLowerCase();
      const doc_type = (entry.doc_type || 'general').trim().toLowerCase();
      const technology = (entry.technology || '5g_nr').trim().toLowerCase();
      const summary = (entry.summary || title).trim();
      const core_content = entry.core_content.trim();

      // 1. Simpan ke SQLite
      upsertSqlite.run(
        topic_key,
        title,
        keywords,
        category,
        source_vendor,
        doc_type,
        technology,
        summary,
        core_content
      );

      // 2. Simpan ke PostgreSQL jika aktif
      if (pgPool) {
        try {
          await pgPool.query(`
            INSERT INTO knowledge_base (topic_key, title, keywords, category, source_vendor, doc_type, technology, summary, core_content)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (topic_key) DO UPDATE SET
              title = EXCLUDED.title,
              keywords = EXCLUDED.keywords,
              category = EXCLUDED.category,
              source_vendor = EXCLUDED.source_vendor,
              doc_type = EXCLUDED.doc_type,
              technology = EXCLUDED.technology,
              summary = EXCLUDED.summary,
              core_content = EXCLUDED.core_content,
              created_at = CURRENT_TIMESTAMP
          `, [topic_key, title, keywords, category, source_vendor, doc_type, technology, summary, core_content]);
        } catch (pgErr) {
          console.warn(`⚠️ [PostgreSQL Sync Warning] ${topic_key}:`, pgErr.message);
        }
      }

      console.log(`✅ [Ingested] [${source_vendor.toUpperCase()}] ${title} (${topic_key})`);
      successCount++;
    } catch (fileErr) {
      console.error(`❌ [Error] Gagal memproses ${relPath}:`, fileErr.message);
      skipCount++;
    }
  }

  const finalTotal = db.prepare('SELECT COUNT(*) as count FROM knowledge_base').get().count;
  console.log('========================================================');
  console.log(`🎉 Ingestion Selesai! Berhasil: ${successCount} berkas, Dilewati: ${skipCount} berkas.`);
  console.log(`📊 Total Entri Knowledge Base Saat Ini: ${finalTotal} topik aktif.`);
  console.log('========================================================\n');
  return { successCount, skipCount, finalTotal };
}

export { runIngestion };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runIngestion().catch(err => {
    console.error('❌ Ingestion Pipeline Fatal Error:', err);
  });
}

