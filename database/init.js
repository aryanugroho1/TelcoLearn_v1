/**
 * Database Initializer & Migration Runner
 * Run with: npm run init-db
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb } from './db.js';
import { applyBilingualMigrations } from '../scripts/migrate_bilingual.js';
import { seedPmpTrack } from '../scripts/seed_pmp_track.js';
import { backupDatabase } from '../scripts/db_backup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function initializeDatabase() {
  console.log('🔄 Menginisialisasi basis data SQLite TelcoLearn...');
  const db = getDb();

  // Buat snapshot backup otomatis sebelum migrasi skema diterapkan
  try {
    const tableCheck = db.prepare("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='users'").get();
    if (tableCheck && tableCheck.count > 0) {
      backupDatabase('pre-migration');
    }
  } catch (bErr) {
    console.warn('⚠️ [Pre-Migration Backup Warning]:', bErr.message);
  }

  // 0. Pre-Migration: Pastikan kolom baru ada pada tabel lama sebelum indeks dibuat
  try {
    const userInfo = db.prepare("PRAGMA table_info(users)").all();
    const userCols = userInfo.map(col => col.name);
    if (userCols.length > 0 && !userCols.includes('preferred_language')) {
      db.exec("ALTER TABLE users ADD COLUMN preferred_language TEXT DEFAULT 'id';");
    }
  } catch (uErr) {}

  try {
    const kbInfo = db.prepare("PRAGMA table_info(knowledge_base)").all();
    const kbCols = kbInfo.map(col => col.name);
    if (kbCols.length > 0) {
      if (!kbCols.includes('source_vendor')) {
        db.exec("ALTER TABLE knowledge_base ADD COLUMN source_vendor TEXT DEFAULT '3gpp';");
      }
      if (!kbCols.includes('doc_type')) {
        db.exec("ALTER TABLE knowledge_base ADD COLUMN doc_type TEXT DEFAULT 'general';");
      }
      if (!kbCols.includes('technology')) {
        db.exec("ALTER TABLE knowledge_base ADD COLUMN technology TEXT DEFAULT '5g_nr';");
      }
    }
  } catch (preErr) {}

  // 1. Jalankan schema.sql
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
    console.log('✅ Skema tabel (7 tabel & indeks) berhasil diterapkan.');
  } else {
    console.error('❌ Berkas schema.sql tidak ditemukan.');
  }

  // 2. Jalankan seed.sql
  const seedPath = path.join(__dirname, 'seed.sql');
  if (fs.existsSync(seedPath)) {
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    db.exec('PRAGMA foreign_keys = OFF;');
    db.exec(seedSql);
    db.exec('PRAGMA foreign_keys = ON;');
    console.log('✅ Data awal (Modul Kurikulum & Kuis) berhasil di-seed.');
  } else {
    console.warn('⚠️ Berkas seed.sql tidak ditemukan.');
  }

  // 3. Jalankan seed_knowledge.sql (ShareTechNote Knowledge Base)
  const kbSeedPath = path.join(__dirname, 'seed_knowledge.sql');
  if (fs.existsSync(kbSeedPath)) {
    const kbSeedSql = fs.readFileSync(kbSeedPath, 'utf8');
    db.exec(kbSeedSql);
    console.log('✅ Knowledge Base ShareTechNote (Hybrid RAG) berhasil di-seed.');
  }

  // 3.5. Jalankan migrasi dan penyemaian konten modul & kuis dwibahasa (Bilingual English)
  try {
    applyBilingualMigrations(db);
  } catch (biErr) {
    console.warn('ℹ️ Migrasi bilingual modules/quizzes dilewati:', biErr.message);
  }

  // 3.6. Jalankan penyemaian materi & kuis Telecom Project Management (PMP)
  try {
    seedPmpTrack();
  } catch (pmpErr) {
    console.warn('ℹ️ Penyemaian PMP track dilewati:', pmpErr.message);
  }

  // 4. Migrasi Kolom Token Tracking & Model Name pada llm_conversation_logs
  try {
    const tableInfo = db.prepare("PRAGMA table_info(llm_conversation_logs)").all();
    const columnNames = tableInfo.map(col => col.name);
    if (!columnNames.includes('prompt_tokens')) {
      db.exec("ALTER TABLE llm_conversation_logs ADD COLUMN prompt_tokens INTEGER DEFAULT 0;");
    }
    if (!columnNames.includes('output_tokens')) {
      db.exec("ALTER TABLE llm_conversation_logs ADD COLUMN output_tokens INTEGER DEFAULT 0;");
    }
    if (!columnNames.includes('total_tokens')) {
      db.exec("ALTER TABLE llm_conversation_logs ADD COLUMN total_tokens INTEGER DEFAULT 0;");
    }
    if (!columnNames.includes('model_name')) {
      db.exec("ALTER TABLE llm_conversation_logs ADD COLUMN model_name TEXT DEFAULT 'gemini-3.8-flash';");
    }
  } catch (migErr) {
    console.warn('ℹ️ Migrasi kolom token tracking dilewati:', migErr.message);
  }

  // 5. Pastikan tabel user_feedbacks ada (Confidential & Anonymous)
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_feedbacks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        feedback_text TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        status TEXT DEFAULT 'PENDING',
        admin_notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON user_feedbacks(status);
    `);
  } catch (fbErr) {
    console.warn('ℹ️ Tabel user_feedbacks check:', fbErr.message);
  }

  // 6. Migrasi Kolom Metadata Vendor & Tipe Dokumen pada knowledge_base
  try {
    const kbInfo = db.prepare("PRAGMA table_info(knowledge_base)").all();
    const kbCols = kbInfo.map(col => col.name);
    if (!kbCols.includes('source_vendor')) {
      db.exec("ALTER TABLE knowledge_base ADD COLUMN source_vendor TEXT DEFAULT '3gpp';");
    }
    if (!kbCols.includes('doc_type')) {
      db.exec("ALTER TABLE knowledge_base ADD COLUMN doc_type TEXT DEFAULT 'general';");
    }
    if (!kbCols.includes('technology')) {
      db.exec("ALTER TABLE knowledge_base ADD COLUMN technology TEXT DEFAULT '5g_nr';");
    }
    db.exec("CREATE INDEX IF NOT EXISTS idx_kb_vendor ON knowledge_base(source_vendor, technology);");
    db.exec("CREATE INDEX IF NOT EXISTS idx_kb_doc_type ON knowledge_base(doc_type);");
  } catch (kbMigErr) {
    console.warn('ℹ️ Migrasi kolom knowledge_base metadata dilewati:', kbMigErr.message);
  }

  const moduleCount = db.prepare('SELECT COUNT(*) as count FROM modules').get().count;
  const quizCount = db.prepare('SELECT COUNT(*) as count FROM quizzes').get().count;
  const kbCount = db.prepare('SELECT COUNT(*) as count FROM knowledge_base').get().count;
  const fbCount = db.prepare('SELECT COUNT(*) as count FROM user_feedbacks').get()?.count || 0;
  console.log(`📊 Status Database: ${moduleCount} Modul Aktif, ${quizCount} Soal Kuis, ${kbCount} Topik RAG, ${fbCount} Masukan Pengguna.`);
}

// If run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase();
}
