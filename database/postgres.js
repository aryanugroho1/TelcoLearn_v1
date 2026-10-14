/**
 * TelcoLearn PostgreSQL Client & Pool Manager (Coolify db-telcolearn)
 * Menyediakan koneksi terpusat ke database PostgreSQL eksternal/Coolify.
 */

import pg from 'pg';

const { Pool } = pg;

const POSTGRES_URL = process.env.DATABASE_URL || 
                     process.env.POSTGRES_URL || 
                     process.env.CACHE_DATABASE_URL || 
                     null;

let pgPool = null;
let isPostgresReady = false;
let isInitializing = false;
let lastAttemptTime = 0;

export async function initPostgres() {
  if (isPostgresReady) return true;
  if (isInitializing) return false;

  const now = Date.now();
  // Throttle retry attempts to at most once every 10 seconds if it failed previously
  if (now - lastAttemptTime < 10000) {
    return false;
  }
  lastAttemptTime = now;

  if (!POSTGRES_URL) {
    return false;
  }

  isInitializing = true;
  try {
    if (!pgPool) {
      pgPool = new Pool({
        connectionString: POSTGRES_URL,
        ssl: POSTGRES_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      });

      pgPool.on('error', (err) => {
        console.warn('⚠️ [PostgreSQL Pool Error]:', err.message);
      });
    }

    const client = await pgPool.connect();
    try {
      // 1. Tabel Cache
      await client.query(`
        CREATE TABLE IF NOT EXISTS llm_response_cache (
          id SERIAL PRIMARY KEY,
          query_hash VARCHAR(64) UNIQUE NOT NULL,
          query_text TEXT NOT NULL,
          response_text TEXT NOT NULL,
          model_name VARCHAR(64) DEFAULT 'gemini-flash-lite-latest',
          prompt_tokens INT DEFAULT 0,
          output_tokens INT DEFAULT 0,
          total_tokens INT DEFAULT 0,
          hit_count INT DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP WITH TIME ZONE
        );
        CREATE INDEX IF NOT EXISTS idx_response_cache_hash ON llm_response_cache(query_hash);
        CREATE INDEX IF NOT EXISTS idx_response_cache_expires ON llm_response_cache(expires_at);

        -- 2. Tabel Masukan Pengguna (User Feedbacks)
        CREATE TABLE IF NOT EXISTS user_feedbacks (
          id SERIAL PRIMARY KEY,
          feedback_text TEXT NOT NULL,
          category VARCHAR(64) DEFAULT 'general',
          status VARCHAR(32) DEFAULT 'PENDING',
          admin_notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON user_feedbacks(status);
      `);
      isPostgresReady = true;
      console.log('🐘 [PostgreSQL Manager] Terhubung sukses ke Coolify db-telcolearn (Tabel cache & user_feedbacks aktif).');
    } finally {
      client.release();
    }
    return true;
  } catch (err) {
    console.warn(`⚠️ [PostgreSQL Manager] Gagal inisialisasi (${err.message}). Beralih mulus ke SQLite lokal.`);
    isPostgresReady = false;
    return false;
  } finally {
    isInitializing = false;
  }
}

// Inisialisasi pool di background
initPostgres().catch(() => {});

export function getPgPool() {
  if (!isPostgresReady && !isInitializing) {
    // Coba re-koneksi di background jika sebelumnya gagal
    initPostgres().catch(() => {});
  }
  return isPostgresReady ? pgPool : null;
}

export function isPostgresConnected() {
  return isPostgresReady;
}
