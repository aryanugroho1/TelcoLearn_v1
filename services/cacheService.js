/**
 * TelcoLearn Dynamic Response Cache Service
 * Dual-Driver Storage:
 * 1. Primary: PostgreSQL (Coolify db-telcolearn via DATABASE_URL / POSTGRES_URL)
 * 2. Fallback: SQLite Local (database/telcolearn.db)
 *
 * Mengeliminasi latency & pemborosan kuota API untuk pertanyaan berulang:
 * - Sub-10ms response time
 * - 0 Token consumption
 * - Anti-timeout guarantee
 */

import crypto from 'crypto';
import { getDb } from '../database/db.js';
import { getPgPool, isPostgresConnected } from '../database/postgres.js';

export { getPgPool, isPostgresConnected };

/**
 * Memastikan tabel cache ada di SQLite lokal (Fallback Driver)
 */
function ensureSqliteCacheTable() {
  try {
    const db = getDb();
    db.exec(`
      CREATE TABLE IF NOT EXISTS llm_response_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query_hash TEXT UNIQUE NOT NULL,
        query_text TEXT NOT NULL,
        response_text TEXT NOT NULL,
        model_name TEXT DEFAULT 'gemini-flash-lite-latest',
        prompt_tokens INTEGER DEFAULT 0,
        output_tokens INTEGER DEFAULT 0,
        total_tokens INTEGER DEFAULT 0,
        hit_count INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME
      );
      CREATE INDEX IF NOT EXISTS idx_response_cache_hash ON llm_response_cache(query_hash);
      CREATE INDEX IF NOT EXISTS idx_response_cache_expires ON llm_response_cache(expires_at);
    `);
  } catch (e) {
    // Ignore jika sudah ada
  }
}

ensureSqliteCacheTable();

/**
 * Normalisasi query pengguna agar variasi spasi / huruf besar-kecil / tanda baca tetap cocok
 */
export function normalizeQuery(query) {
  if (!query || typeof query !== 'string') return '';
  return query
    .toLowerCase()
    .replace(/[?!.,;:_"'“”‘’()\[\]{}#*~`\-\\\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Menghitung SHA-256 hash dari query ternormalisasi
 */
export function hashQuery(query) {
  const normalized = normalizeQuery(query);
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Mengambil respon dari cache (PostgreSQL primary -> SQLite fallback)
 */
export async function getCachedResponse(query) {
  if (!query || typeof query !== 'string') return null;
  const normalized = normalizeQuery(query);
  if (normalized.length < 5) return null; // Jangan cache query terlalu pendek seperti 'halo'

  const queryHash = hashQuery(query);

  // 1. Coba via PostgreSQL (Coolify db-telcolearn)
  const pool = getPgPool();
  if (pool) {
    try {
      const res = await pool.query(`
        SELECT response_text, model_name, prompt_tokens, output_tokens, total_tokens, hit_count, created_at
        FROM llm_response_cache
        WHERE query_hash = $1 AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
        LIMIT 1
      `, [queryHash]);

      if (res.rows.length > 0) {
        const row = res.rows[0];
        // Asynchronously update hit count
        pool.query(`
          UPDATE llm_response_cache 
          SET hit_count = hit_count + 1 
          WHERE query_hash = $1
        `, [queryHash]).catch(() => {});

        return {
          hit: true,
          text: row.response_text,
          modelName: row.model_name,
          usage: {
            promptTokens: 0, // 0 token karena dari cache
            outputTokens: 0,
            totalTokens: 0,
            originalTokens: row.total_tokens || 0,
            modelName: `${row.model_name} (Cached)`
          },
          hitCount: (row.hit_count || 1) + 1,
          driver: 'PostgreSQL (Coolify)',
          cachedAt: row.created_at
        };
      }
    } catch (pgErr) {
      console.warn('⚠️ [Postgres Cache Read Error] Beralih ke SQLite:', pgErr.message);
    }
  }

  // 2. Fallback via SQLite Lokal
  try {
    const db = getDb();
    const row = db.prepare(`
      SELECT response_text, model_name, prompt_tokens, output_tokens, total_tokens, hit_count, created_at
      FROM llm_response_cache
      WHERE query_hash = ? AND (expires_at IS NULL OR expires_at > datetime('now'))
      LIMIT 1
    `).get(queryHash);

    if (row) {
      try {
        db.prepare('UPDATE llm_response_cache SET hit_count = hit_count + 1 WHERE query_hash = ?').run(queryHash);
      } catch (uErr) {}

      return {
        hit: true,
        text: row.response_text,
        modelName: row.model_name,
        usage: {
          promptTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          originalTokens: row.total_tokens || 0,
          modelName: `${row.model_name} (Cached)`
        },
        hitCount: (row.hit_count || 1) + 1,
        driver: 'SQLite (Local)',
        cachedAt: row.created_at
      };
    }
  } catch (sqErr) {
    console.error('⚠️ [SQLite Cache Read Error]:', sqErr.message);
  }

  return null;
}

/**
 * Menyimpan respon jawaban ke cache
 */
export async function setCachedResponse(query, responseText, usage = {}, ttlHours = 24) {
  if (!query || !responseText) return false;
  const normalized = normalizeQuery(query);
  if (normalized.length < 5) return false;
  
  // Jangan cache jika respon berupa pesan error / timeout
  if (
    responseText.includes('Server AI sedang mengalami antrean') ||
    responseText.includes('The AI server is experiencing high traffic') ||
    responseText.includes('Kunci API Gemini belum dikonfigurasi') ||
    responseText.includes('mengalami antrean beban tinggi sementara')
  ) {
    return false;
  }

  const queryHash = hashQuery(query);
  const modelName = usage.modelName || 'gemini-flash-lite-latest';
  const pTokens = usage.promptTokens || 0;
  const oTokens = usage.outputTokens || 0;
  const tTokens = usage.totalTokens || (pTokens + oTokens);

  // 1. Simpan ke PostgreSQL jika tersedia
  const pool = getPgPool();
  if (pool) {
    try {
      await pool.query(`
        INSERT INTO llm_response_cache (query_hash, query_text, response_text, model_name, prompt_tokens, output_tokens, total_tokens, hit_count, expires_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 1, CURRENT_TIMESTAMP + ($8 || ' hours')::INTERVAL)
        ON CONFLICT (query_hash) DO UPDATE SET
          response_text = EXCLUDED.response_text,
          model_name = EXCLUDED.model_name,
          prompt_tokens = EXCLUDED.prompt_tokens,
          output_tokens = EXCLUDED.output_tokens,
          total_tokens = EXCLUDED.total_tokens,
          expires_at = EXCLUDED.expires_at
      `, [queryHash, query.slice(0, 500), responseText, modelName, pTokens, oTokens, tTokens, ttlHours]);
      return true;
    } catch (pgErr) {
      console.warn('⚠️ [Postgres Cache Write Error]:', pgErr.message);
    }
  }

  // 2. Simpan ke SQLite Lokal
  try {
    const db = getDb();
    const expiresAt = new Date(Date.now() + ttlHours * 3600 * 1000).toISOString().replace('T', ' ').slice(0, 19);
    db.prepare(`
      INSERT OR REPLACE INTO llm_response_cache (query_hash, query_text, response_text, model_name, prompt_tokens, output_tokens, total_tokens, hit_count, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(queryHash, query.slice(0, 500), responseText, modelName, pTokens, oTokens, tTokens, expiresAt);
    return true;
  } catch (sqErr) {
    console.error('⚠️ [SQLite Cache Write Error]:', sqErr.message);
    return false;
  }
}

/**
 * Mengambil ringkasan metrik cache untuk dashboard /admin
 */
export async function getCacheMetrics() {
  let pgStats = null;
  const pool = getPgPool();
  if (pool) {
    try {
      const res = await pool.query(`
        SELECT 
          COUNT(*) as total_entries,
          COALESCE(SUM(hit_count), 0) as total_hits,
          COALESCE(SUM((hit_count - 1) * total_tokens), 0) as saved_tokens
        FROM llm_response_cache
      `);
      if (res.rows.length > 0) {
        pgStats = {
          totalEntries: parseInt(res.rows[0].total_entries, 10),
          totalHits: parseInt(res.rows[0].total_hits, 10),
          savedTokens: parseInt(res.rows[0].saved_tokens, 10),
          driver: 'PostgreSQL (Coolify db-telcolearn)'
        };
      }
    } catch (e) {}
  }

  let sqliteStats = null;
  try {
    const db = getDb();
    const row = db.prepare(`
      SELECT 
        COUNT(*) as total_entries,
        COALESCE(SUM(hit_count), 0) as total_hits,
        COALESCE(SUM((hit_count - 1) * total_tokens), 0) as saved_tokens
      FROM llm_response_cache
    `).get();
    sqliteStats = {
      totalEntries: row?.total_entries || 0,
      totalHits: row?.total_hits || 0,
      savedTokens: row?.saved_tokens || 0,
      driver: 'SQLite (Local)'
    };
  } catch (e) {
    sqliteStats = { totalEntries: 0, totalHits: 0, savedTokens: 0, driver: 'SQLite (Local)' };
  }

  return pgStats || sqliteStats;
}
