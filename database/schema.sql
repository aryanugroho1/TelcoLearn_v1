-- 1. TABEL PENGGUNA (users)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jid TEXT NOT NULL UNIQUE,                  -- WhatsApp JID: "6281234567890@s.whatsapp.net"
    phone_number TEXT NOT NULL,                -- Nomor murni: "6281234567890"
    display_name TEXT DEFAULT 'Pelajar Telco',
    focus_track TEXT DEFAULT 'protocol_qa',     -- 'protocol_qa', 'drive_test', 'ml_telco'
    reminder_preference TEXT DEFAULT 'all',     -- 'morning', 'afternoon', 'night', 'all', 'off'
    custom_morning_time TEXT DEFAULT '07:30',   -- Format HH:MM (WIB)
    custom_afternoon_time TEXT DEFAULT '12:30', -- Format HH:MM (WIB)
    custom_night_time TEXT DEFAULT '20:30',     -- Format HH:MM (WIB)
    current_state TEXT DEFAULT 'IDLE',          -- 'IDLE', 'AWAITING_QUIZ_ANSWER', 'AWAITING_CUSTOM_NOTE', 'ONBOARDING_TRACK', 'ONBOARDING_REMINDER'
    state_payload TEXT,                         -- JSON string data: e.g. {"active_quiz_id": 1}
    streak_count INTEGER DEFAULT 0,
    last_active_date TEXT,                      -- Format YYYY-MM-DD
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_jid ON users(jid);
CREATE INDEX IF NOT EXISTS idx_users_reminder ON users(reminder_preference, current_state);

-- 2. TABEL KURIKULUM & MATERI (modules)
CREATE TABLE IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_code TEXT NOT NULL UNIQUE,           -- e.g. "MOD-5G-SA-01"
    category TEXT NOT NULL,                     -- 'architecture', 'callflow', 'logfile', 'ml'
    level TEXT DEFAULT 'Menengah',              -- 'Dasar', 'Menengah', 'Lanjutan'
    title TEXT NOT NULL,
    tags TEXT,                                  -- "RRC,NAS,SBA,AMF"
    summary TEXT NOT NULL,
    wa_text_body TEXT NOT NULL,                 -- Pesan lengkap terformat tipografi WhatsApp
    sequence_order INTEGER NOT NULL,            -- Urutan modul harian (1, 2, 3...)
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_modules_sequence ON modules(sequence_order, is_active);
CREATE INDEX IF NOT EXISTS idx_modules_category ON modules(category);

-- 3. PROGRES PELAJAR TERHADAP MODUL (user_module_progress)
CREATE TABLE IF NOT EXISTS user_module_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    module_id INTEGER NOT NULL,
    status TEXT DEFAULT 'SENT',                 -- 'SENT', 'READ', 'COMPLETED'
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    UNIQUE(user_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON user_module_progress(user_id, status);

-- 4. BANK SOAL KUIS (quizzes)
CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER,
    category TEXT NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option TEXT NOT NULL,               -- 'A', 'B', 'C', atau 'D'
    explanation TEXT NOT NULL,
    difficulty INTEGER DEFAULT 2,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_quizzes_cat ON quizzes(category, is_active);

-- 5. RIWAYAT EVALUASI KUIS (quiz_logs)
CREATE TABLE IF NOT EXISTS quiz_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    quiz_id INTEGER NOT NULL,
    selected_option TEXT NOT NULL,
    is_correct INTEGER NOT NULL,                -- 1 = Benar, 0 = Salah
    answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quiz_logs_user ON quiz_logs(user_id, is_correct);

-- 6. CATATAN PRIBADI USER DARI WHATSAPP (custom_user_notes)
CREATE TABLE IF NOT EXISTS custom_user_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'logfile',
    note_body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. AUDIT LOG INTERAKSI LLM (llm_conversation_logs)
CREATE TABLE IF NOT EXISTS llm_conversation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    incoming_query TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    latency_ms INTEGER DEFAULT 0,
    prompt_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    model_name TEXT DEFAULT 'gemini-3.8-flash',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 8. KNOWLEDGE BASE REFERENSI SHARETECHNOTE (knowledge_base)
CREATE TABLE IF NOT EXISTS knowledge_base (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_key TEXT NOT NULL UNIQUE,       -- 'lte_call_flow', 'ue_signal_acquisition', 'rach_rar', 'oran_ric'
    title TEXT NOT NULL,
    keywords TEXT NOT NULL,               -- comma-separated: 'call flow, attach, lte, initial attach, s1ap, rrc'
    category TEXT NOT NULL,               -- '4g_lte', '5g_nr', 'o_ran', 'protocol_qa'
    summary TEXT NOT NULL,
    core_content TEXT NOT NULL,           -- Structured ShareTechNote deep technical reference content
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_kb_topic ON knowledge_base(topic_key);
CREATE INDEX IF NOT EXISTS idx_kb_category ON knowledge_base(category);

-- 9. TABEL MASUKAN & SARAN PENGGUNA (user_feedbacks)
CREATE TABLE IF NOT EXISTS user_feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_jid TEXT NOT NULL,
    phone_number TEXT,
    feedback_text TEXT NOT NULL,
    category TEXT DEFAULT 'general',           -- 'general', 'feature_request', 'bug_report', 'curriculum'
    status TEXT DEFAULT 'PENDING',              -- 'PENDING', 'REVIEWED', 'IMPLEMENTED'
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_feedbacks_user ON user_feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON user_feedbacks(status);

