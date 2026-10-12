/**
 * TelcoLearn SQLite Database Connection & CRUD Helpers
 * Supports native node:sqlite (Node 22+) and better-sqlite3 interchangeably.
 * Zero-ops, sub-millisecond local queries.
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_PATH 
  ? path.resolve(__dirname, '..', process.env.DATABASE_PATH)
  : path.join(__dirname, 'telcolearn.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

import { DatabaseSync } from 'node:sqlite';

let dbInstance = null;

export function getDb() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(dbPath);
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    dbInstance.exec('PRAGMA foreign_keys = ON;');
    dbInstance.exec('PRAGMA synchronous = NORMAL;');
  }
  return dbInstance;
}

/**
 * ----------------------------------------------------
 * USER HELPERS
 * ----------------------------------------------------
 */

export function getUserByJid(jid) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM users WHERE jid = ?');
  return stmt.get(jid) || null;
}

export function createUser({ jid, phone_number, display_name = 'Pelajar Telco', focus_track = 'protocol_qa', reminder_preference = 'all', current_state = 'IDLE' }) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO users (jid, phone_number, display_name, focus_track, reminder_preference, current_state)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(jid) DO UPDATE SET
      display_name = excluded.display_name,
      updated_at = CURRENT_TIMESTAMP
  `);
  stmt.run(jid, phone_number, display_name, focus_track, reminder_preference, current_state);
  return getUserByJid(jid);
}

export function updateUserState(jid, state, payload = null) {
  const db = getDb();
  const payloadStr = payload ? (typeof payload === 'string' ? payload : JSON.stringify(payload)) : null;
  const stmt = db.prepare(`
    UPDATE users 
    SET current_state = ?, state_payload = ?, updated_at = CURRENT_TIMESTAMP
    WHERE jid = ?
  `);
  stmt.run(state, payloadStr, jid);
}

export function updateUserPreferences(jid, { focus_track, reminder_preference, display_name }) {
  const db = getDb();
  const updates = [];
  const params = [];

  if (focus_track) {
    updates.push('focus_track = ?');
    params.push(focus_track);
  }
  if (reminder_preference) {
    updates.push('reminder_preference = ?');
    params.push(reminder_preference);
  }
  if (display_name) {
    updates.push('display_name = ?');
    params.push(display_name);
  }

  if (updates.length === 0) return;

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(jid);

  const query = `UPDATE users SET ${updates.join(', ')} WHERE jid = ?`;
  db.prepare(query).run(...params);
}

export function updateUserStreak(jid, isCorrect) {
  const db = getDb();
  const user = getUserByJid(jid);
  if (!user) return 0;

  const today = new Date().toISOString().slice(0, 10);
  let newStreak = user.streak_count || 0;

  if (isCorrect) {
    if (!user.last_active_date) {
      newStreak = 1;
    } else if (user.last_active_date === today) {
      newStreak = Math.max(1, newStreak);
    } else {
      const lastDate = new Date(user.last_active_date);
      const todayDate = new Date(today);
      const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }
  }

  const stmt = db.prepare(`
    UPDATE users 
    SET streak_count = ?, last_active_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE jid = ?
  `);
  stmt.run(newStreak, today, jid);
  return newStreak;
}

export function getActiveUsersForSlot(slot) {
  const db = getDb();
  // slot: 'morning', 'afternoon', 'night'
  const stmt = db.prepare(`
    SELECT * FROM users 
    WHERE reminder_preference IN ('all', ?)
  `);
  return stmt.all(slot);
}

/**
 * ----------------------------------------------------
 * MODULE & PROGRESS HELPERS
 * ----------------------------------------------------
 */

export function getModuleById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM modules WHERE id = ?').get(id) || null;
}

export function getNextModuleForUser(userId) {
  const db = getDb();
  
  // Ambil preferensi track user jika tersedia
  const user = db.prepare('SELECT focus_track FROM users WHERE id = ?').get(userId);
  const track = user?.focus_track || 'protocol_qa';

  // 1. Coba ambil modul belum dibaca yang sesuai prioritas track
  let trackCondition = '';
  if (track === 'ml_telco') {
    trackCondition = "CASE WHEN m.category = 'ml' THEN 0 ELSE 1 END,";
  } else if (track === 'drive_test') {
    trackCondition = "CASE WHEN m.category IN ('architecture', 'logfile') THEN 0 ELSE 1 END,";
  } else {
    // protocol_qa
    trackCondition = "CASE WHEN m.category IN ('callflow', 'logfile') THEN 0 ELSE 1 END,";
  }

  const stmt = db.prepare(`
    SELECT m.* 
    FROM modules m
    LEFT JOIN user_module_progress p ON m.id = p.module_id AND p.user_id = ?
    WHERE m.is_active = 1 AND p.id IS NULL
    ORDER BY ${trackCondition} m.sequence_order ASC
    LIMIT 1
  `);
  const nextMod = stmt.get(userId);
  if (nextMod) return nextMod;

  // 2. Jika semua sudah pernah dikirim, kembalikan modul pertama untuk pengulangan
  return db.prepare('SELECT * FROM modules WHERE is_active = 1 ORDER BY sequence_order ASC LIMIT 1').get() || null;
}

export function markModuleProgress(userId, moduleId, status = 'SENT') {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO user_module_progress (user_id, module_id, status, completed_at)
    VALUES (?, ?, ?, CASE WHEN ? = 'COMPLETED' THEN CURRENT_TIMESTAMP ELSE NULL END)
    ON CONFLICT(user_id, module_id) DO UPDATE SET
      status = excluded.status,
      completed_at = CASE WHEN excluded.status = 'COMPLETED' THEN CURRENT_TIMESTAMP ELSE user_module_progress.completed_at END
  `);
  stmt.run(userId, moduleId, status, status);
}

/**
 * ----------------------------------------------------
 * QUIZ & LOG HELPERS
 * ----------------------------------------------------
 */

export function getQuizById(quizId) {
  const db = getDb();
  return db.prepare('SELECT * FROM quizzes WHERE id = ?').get(quizId) || null;
}

export function getNextQuizForUser(userId, preferredModuleId = null) {
  const db = getDb();

  // 1. Jika ada modul spesifik yang baru dipelajari, coba cari kuis modul tersebut
  if (preferredModuleId) {
    const modQuiz = db.prepare(`
      SELECT q.* FROM quizzes q
      LEFT JOIN (
        SELECT quiz_id, MAX(is_correct) as answered_correctly 
        FROM quiz_logs WHERE user_id = ? GROUP BY quiz_id
      ) l ON q.id = l.quiz_id
      WHERE q.module_id = ? AND q.is_active = 1 AND (l.answered_correctly IS NULL OR l.answered_correctly = 0)
      LIMIT 1
    `).get(userId, preferredModuleId);
    if (modQuiz) return modQuiz;
  }

  // 2. Utamakan kuis yang belum pernah dijawab dengan benar
  const stmt = db.prepare(`
    SELECT q.* 
    FROM quizzes q
    LEFT JOIN (
      SELECT quiz_id, MAX(is_correct) as answered_correctly 
      FROM quiz_logs 
      WHERE user_id = ? 
      GROUP BY quiz_id
    ) l ON q.id = l.quiz_id
    WHERE q.is_active = 1 AND (l.answered_correctly IS NULL OR l.answered_correctly = 0)
    ORDER BY RANDOM()
    LIMIT 1
  `);
  const quiz = stmt.get(userId);
  if (quiz) return quiz;

  // 3. Fallback ke random active quiz
  return db.prepare('SELECT * FROM quizzes WHERE is_active = 1 ORDER BY RANDOM() LIMIT 1').get() || null;
}

export function recordQuizLog(userId, quizId, selectedOption, isCorrect) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO quiz_logs (user_id, quiz_id, selected_option, is_correct)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(userId, quizId, selectedOption, isCorrect ? 1 : 0);
}

/**
 * ----------------------------------------------------
 * USER NOTES HELPERS
 * ----------------------------------------------------
 */

export function saveUserNote(userId, title, noteBody, category = 'logfile') {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO custom_user_notes (user_id, title, category, note_body)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(userId, title, category, noteBody);
  return info.lastInsertRowid;
}

export function getUserNotes(userId) {
  const db = getDb();
  return db.prepare('SELECT * FROM custom_user_notes WHERE user_id = ? ORDER BY created_at DESC LIMIT 5').all(userId);
}

/**
 * ----------------------------------------------------
 * LLM AUDIT LOG HELPERS
 * ----------------------------------------------------
 */

export function logLlmConversation(userId, incomingQuery, aiResponse, latencyMs = 0, usage = {}) {
  const db = getDb();
  let validUserId = null;
  if (userId && Number(userId) > 0) {
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (user) validUserId = user.id;
  }

  const promptTokens = usage.promptTokens || Math.round((incomingQuery.length + 150) / 3.8);
  const outputTokens = usage.outputTokens || Math.round((aiResponse.length) / 3.8);
  const totalTokens = usage.totalTokens || (promptTokens + outputTokens);
  const modelName = usage.modelName || 'gemini-3.8-flash';

  try {
    const stmt = db.prepare(`
      INSERT INTO llm_conversation_logs (user_id, incoming_query, ai_response, latency_ms, prompt_tokens, output_tokens, total_tokens, model_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(validUserId, incomingQuery, aiResponse, latencyMs, promptTokens, outputTokens, totalTokens, modelName);
  } catch (err) {
    // Fallback jika kolom baru belum termigrasi
    const fallbackStmt = db.prepare(`
      INSERT INTO llm_conversation_logs (user_id, incoming_query, ai_response, latency_ms)
      VALUES (?, ?, ?, ?)
    `);
    fallbackStmt.run(validUserId, incomingQuery, aiResponse, latencyMs);
  }
}

export function getRecentLlmConversation(userId, limit = 5) {
  const db = getDb();
  if (!userId || Number(userId) <= 0) return [];
  try {
    return db.prepare(`
      SELECT incoming_query, ai_response, created_at
      FROM llm_conversation_logs
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT ?
    `).all(userId, limit).reverse();
  } catch (e) {
    return [];
  }
}

/**
 * Mengambil ringkasan metrik penggunaan token & request harian
 */
export function getDailyTokenMetrics(targetDate = null) {
  const db = getDb();
  const dateClause = targetDate ? "DATE(?)" : "DATE('now', 'localtime')";
  const dateParam = targetDate ? [targetDate] : [];

  const row = db.prepare(`
    SELECT 
      COUNT(*) as total_requests,
      COALESCE(SUM(prompt_tokens), 0) as total_prompt_tokens,
      COALESCE(SUM(output_tokens), 0) as total_output_tokens,
      COALESCE(SUM(total_tokens), 0) as total_tokens,
      COUNT(DISTINCT user_id) as active_users,
      COALESCE(AVG(latency_ms), 0) as avg_latency
    FROM llm_conversation_logs
    WHERE DATE(created_at, 'localtime') = ${dateClause}
  `).get(...dateParam);

  const totalRequests = row.total_requests || 0;
  const freeTierLimit = 1500;
  const quotaUsedPct = Number(((totalRequests / freeTierLimit) * 100).toFixed(1));
  const remainingRequests = Math.max(0, freeTierLimit - totalRequests);

  // Perhitungan estimasi biaya jika menggunakan Paid Tier Gemini 3.8 Flash
  // Input: $0.075 / 1M token, Output: $0.30 / 1M token, Kurs: Rp 16.000 / USD
  const costPromptUsd = (row.total_prompt_tokens / 1000000) * 0.075;
  const costOutputUsd = (row.total_output_tokens / 1000000) * 0.30;
  const totalCostUsd = costPromptUsd + costOutputUsd;
  const totalCostIdr = Math.round(totalCostUsd * 16000);

  // Rekomendasi Keputusan (Verdict)
  let verdict = 'STAY_FREE_TIER';
  let verdictMessage = '✅ Kapasitas Free Tier AMAN. Tetap gunakan Free Tier.';
  if (totalRequests >= 1500) {
    verdict = 'MOVE_TO_PAID';
    verdictMessage = '🚨 Kebutuhan sudah melampaui 1.500 RPD! Waktunya beralih ke Paid Tier Pay-As-You-Go.';
  } else if (totalRequests >= 1200) {
    verdict = 'WARNING_APPROACHING_LIMIT';
    verdictMessage = '⚠️ Penggunaan mencapai >80% kuota gratis. Siapkan kartu kredit di Google Cloud console.';
  }

  // Statistik Database Terkini (Jumlah data yang tersimpan / ter-setor di database)
  const totalLogs = db.prepare('SELECT COUNT(*) as count FROM llm_conversation_logs').get().count;
  const totalModules = db.prepare('SELECT COUNT(*) as count FROM modules').get().count;
  const totalQuizzes = db.prepare('SELECT COUNT(*) as count FROM quizzes').get().count;
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const totalNotes = db.prepare('SELECT COUNT(*) as count FROM custom_user_notes').get().count;
  const totalKb = db.prepare('SELECT COUNT(*) as count FROM knowledge_base').get().count;
  const totalFeedbacks = db.prepare('SELECT COUNT(*) as count FROM user_feedbacks').get()?.count || 0;
  const pendingFeedbacks = db.prepare("SELECT COUNT(*) as count FROM user_feedbacks WHERE status = 'PENDING'").get()?.count || 0;
  const newUsersToday = db.prepare(`SELECT COUNT(*) as count FROM users WHERE DATE(created_at, 'localtime') = ${dateClause}`).get(...dateParam).count;
  const newNotesToday = db.prepare(`SELECT COUNT(*) as count FROM custom_user_notes WHERE DATE(created_at, 'localtime') = ${dateClause}`).get(...dateParam).count;
  const newFeedbacksToday = db.prepare(`SELECT COUNT(*) as count FROM user_feedbacks WHERE DATE(created_at, 'localtime') = ${dateClause}`).get(...dateParam)?.count || 0;

  return {
    date: targetDate || new Date().toISOString().split('T')[0],
    total_requests: totalRequests,
    free_tier_limit: freeTierLimit,
    quota_used_pct: quotaUsedPct,
    remaining_requests: remainingRequests,
    total_prompt_tokens: row.total_prompt_tokens,
    total_output_tokens: row.total_output_tokens,
    total_tokens: row.total_tokens,
    active_users: row.active_users,
    avg_latency_ms: Math.round(row.avg_latency),
    estimated_cost_usd: totalCostUsd.toFixed(4),
    estimated_cost_idr: totalCostIdr,
    verdict,
    verdict_message: verdictMessage,
    db_stats: {
      new_conversations_today: totalRequests,
      total_conversations_all_time: totalLogs,
      new_users_today: newUsersToday,
      total_users: totalUsers,
      total_modules: totalModules,
      total_quizzes: totalQuizzes,
      new_notes_today: newNotesToday,
      total_notes: totalNotes,
      total_kb: totalKb,
      total_feedbacks: totalFeedbacks,
      pending_feedbacks: pendingFeedbacks,
      new_feedbacks_today: newFeedbacksToday
    }
  };
}

/**
 * Mengambil riwayat tren penggunaan token 7 hari terakhir
 */
export function getWeeklyTokenTrend() {
  const db = getDb();
  return db.prepare(`
    SELECT 
      DATE(created_at, 'localtime') as log_date,
      COUNT(*) as requests,
      COALESCE(SUM(total_tokens), 0) as tokens,
      COUNT(DISTINCT user_id) as users
    FROM llm_conversation_logs
    GROUP BY DATE(created_at, 'localtime')
    ORDER BY log_date DESC
    LIMIT 7
  `).all().reverse();
}

/**
 * ----------------------------------------------------
 * SHARETECHNOTE KNOWLEDGE BASE HELPERS (HYBRID RAG)
 * ----------------------------------------------------
 */

export function searchKnowledgeBase(query) {
  if (!query || typeof query !== 'string') return null;
  const db = getDb();
  const clean = query.toLowerCase();

  // Ekstraksi token kata kunci penting
  const tokens = clean
    .replace(/[^a-zA-Z0-9_\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2);

  if (tokens.length === 0) return null;

  const allTopics = db.prepare('SELECT * FROM knowledge_base').all();
  let bestMatch = null;
  let highestScore = 0;

  for (const topic of allTopics) {
    let score = 0;
    const topicKey = topic.topic_key.toLowerCase();
    const title = topic.title.toLowerCase();
    const keywords = (topic.keywords || '').toLowerCase().split(',').map(k => k.trim());
    const content = topic.core_content.toLowerCase();

    // 1. Kecocokan frasa kunci langsung di kolom keywords
    if (keywords.some(k => clean.includes(k) || k.includes(clean))) {
      score += 30;
    }

    // 2. Pembobotan kecocokan token
    for (const token of tokens) {
      if (topicKey.includes(token)) score += 15;
      if (title.includes(token)) score += 8;
      if (keywords.some(k => k.includes(token))) score += 6;
      if (content.includes(token)) score += 1;
    }

    if (score > highestScore && score >= 8) {
      highestScore = score;
      bestMatch = topic;
    }
  }

  return bestMatch;
}

export function getAllKnowledgeTopics() {
  const db = getDb();
  return db.prepare('SELECT id, topic_key, title, category, summary FROM knowledge_base ORDER BY id ASC').all();
}

/**
 * ----------------------------------------------------
 * USER FEEDBACK HELPERS (/masukan)
 * ----------------------------------------------------
 */

export function saveUserFeedback({ userId, userJid, phoneNumber, feedbackText, category = 'general' }) {
  const db = getDb();
  let validUserId = null;
  if (userId && Number(userId) > 0) {
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (user) validUserId = user.id;
  }

  const stmt = db.prepare(`
    INSERT INTO user_feedbacks (user_id, user_jid, phone_number, feedback_text, category, status)
    VALUES (?, ?, ?, ?, ?, 'PENDING')
  `);
  const result = stmt.run(validUserId, userJid, phoneNumber || '', feedbackText.trim(), category);
  return result.lastInsertRowid;
}

export function getAllFeedbacks({ limit = 10, offset = 0, status = null } = {}) {
  const db = getDb();
  let query = `
    SELECT f.*, u.display_name 
    FROM user_feedbacks f
    LEFT JOIN users u ON f.user_id = u.id
  `;
  const params = [];
  if (status) {
    query += ' WHERE f.status = ?';
    params.push(status);
  }
  query += ' ORDER BY f.created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit) || 10, Number(offset) || 0);
  return db.prepare(query).all(...params);
}

export function getFeedbackMetrics() {
  const db = getDb();
  const total = db.prepare('SELECT COUNT(*) as count FROM user_feedbacks').get()?.count || 0;
  const pending = db.prepare("SELECT COUNT(*) as count FROM user_feedbacks WHERE status = 'PENDING'").get()?.count || 0;
  return { total, pending };
}

export function updateFeedbackStatus(feedbackId, status, adminNotes = null) {
  const db = getDb();
  const stmt = db.prepare(`
    UPDATE user_feedbacks 
    SET status = ?, admin_notes = COALESCE(?, admin_notes)
    WHERE id = ?
  `);
  stmt.run(status, adminNotes, feedbackId);
  return db.prepare('SELECT * FROM user_feedbacks WHERE id = ?').get(feedbackId);
}

