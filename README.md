# TelcoLearn Engine 📡🤖

> Platform Bot WhatsApp Micro-Learning & Protocol Diagnostic Companion (4G/5G Radio, 3GPP Signaling, OTA Log Triage & Applied Telco ML) menggunakan **Baileys WebSocket Native** dan **Google Gemini 3 Flash**.

---

## 🏗️ Arsitektur Sistem

- **WhatsApp Engine**: `@whiskeysockets/baileys` (Multi-file auth, 8-Digit Pairing Code support tanpa scan QR).
- **Database**: SQLite (`DatabaseSync` / Zero-Ops single file `database/telcolearn.db`).
- **Cognitive Engine**: `@google/genai` (Gemini 3 Flash / 2.5 Flash, 3GPP Rel-15 s/d Rel-18 + ML Reasoning).
- **Scheduler**: `node-cron` (Pengiriman otomatis slot 07:30, 12:30, dan 20:30 WIB).

---

## 📂 Struktur Direktori

```text
telcolearn-engine/
├── package.json               # Dependensi & NPM scripts
├── .env.example               # Template environment variables
├── .env                       # Konfigurasi aktif (API key, nomor pairing, dll.)
├── auth_info_baileys/         # Kredensial autentikasi Baileys (auto-generated)
├── index.js                   # Entrypoint daemon Baileys socket & event listener
├── config/
│   └── constants.js           # Pesan template, regex detector, prompt Gemini
├── database/
│   ├── db.js                  # SQLite connection & CRUD helpers
│   ├── schema.sql             # Skema DDL 7 tabel & indeks
│   ├── seed.sql               # Data modul 3GPP & bank soal kuis awal
│   └── init.js                # Database migration/init runner
├── services/
│   ├── geminiService.js       # Adapter Gemini AI (OTA Log Decoder & QA)
│   ├── routerService.js       # State machine, slash commands & message router
│   └── schedulerService.js    # Outbound micro-dose cron worker
├── test-engine.js             # Test suite verifikasi fungsi engine & DB
└── test-gemini.js             # Test suite verifikasi koneksi adapter Gemini
```

---

## 🚀 Panduan Memulai Cepat (Quick Start)

### 1. Konfigurasi Environment (`.env`)
Salin berkas `.env.example` ke `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi pada berkas `.env`:
```env
# Kunci API Google Gemini (Dapatkan di https://aistudio.google.com/)
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-3.8-flash
GEMINI_TIMEOUT_MS=30000

# Konfigurasi Pairing WhatsApp
USE_PAIRING_CODE=true
PHONE_NUMBER_FOR_PAIRING=6281234567890
BOT_PHONE_NUMBER=6281234567890

# Zona waktu cron scheduler
TIMEZONE=Asia/Jakarta
```

### 2. Inisialisasi Database
```bash
npm run init-db
```

### 3. Jalankan Pengujian Verifikasi
```bash
node test-engine.js
node test-gemini.js
```

### 4. Jalankan Bot & Tautkan WhatsApp (8-Digit Pairing Code)
Jalankan bot:
```bash
npm start
```
Terminal akan mencetak **8-Digit Pairing Code** (contoh: `K3XP-9MA2`):
1. Buka aplikasi WhatsApp di ponsel Anda.
2. Buka menu **Setelan (Settings) > Perangkat Tertaut (Linked Devices)**.
3. Pilih **Tautkan Perangkat (Link a Device)**.
4. Pilih opsi: **"Tautkan dengan nomor telepon saja" (Link with phone number instead)**.
5. Masukkan 8 digit kode yang muncul di terminal.
6. Kredensial tersimpan secara aman di folder `auth_info_baileys/`. Sesi selanjutnya akan otomatis terhubung tanpa perlu pairing ulang.

---

## 🔄 Menjalankan 24/7 di Background Menggunakan PM2

```bash
# Pasang PM2 global jika belum ada
npm install -g pm2

# Jalankan worker daemon
pm2 start index.js --name telcolearn-bot

# Simpan proses agar otomatis aktif setelah server reboot
pm2 startup
pm2 save
```

Perintah pemantauan PM2:
- Cek log bot: `pm2 logs telcolearn-bot`
- Cek status: `pm2 status`
- Restart bot: `pm2 restart telcolearn-bot`
- Hentikan bot: `pm2 stop telcolearn-bot`

---

## 📱 Perintah Interaktif WhatsApp

- `/menu` : Menu navigasi utama.
- `/belajar` (atau `/learn`) : Mengambil materi micro-learning berikutnya.
- `/quiz` : Menjawab kuis kognitif 60 detik & menambah streak.
- `/simulasi` (atau `/sim`) : Menghasilkan grafik simulasi RF & diagram visual topik aktif.
- `/lang [en/id]` : Mengganti bahasa bot (English / Bahasa Indonesia).
- `/batal` : Membatalkan sesi kuis atau pencatatan yang sedang aktif.
- `/streak` : Melihat rekor hari belajar berturut-turut & pencapaian.
- `/track [1/2/3/4]` : Mengubah fokus materi (4G/5G QA, Drive Test, ML Telco, Log Analysis).
- `/jadwal [1/2/3]` : Mengubah waktu pengingat materi harian.
- `/catat [isi]` : Menyimpan catatan teknis ke database lokal.
- `/notes` : Melihat daftar catatan pribadi yang tersimpan.
- `/profil` : Menampilkan jalur fokus, bahasa, & preferensi waktu belajar.
- `/reset` : Mengatur ulang profil belajar dari awal.
- `/bantuan` (atau `/help`) : Petunjuk lengkap penggunaan bot.

**Diagnostik AI Otomatis:**
Pengguna dapat langsung mengirimkan potongan error log seperti:
```text
RRCConnectionReject waitTime: 16
5GMM cause = 11 (PLMN not allowed)
```
Bot akan otomatis mendeteksi pola log radio dan menyajikan **Root Cause Analysis (RCA)**, **Dampak pada Modem UE**, serta **Langkah Pengujian di Laboratorium** via Gemini 3 Flash.

---

## 📄 Publikasi Ilmiah & Technical Whitepaper

Dokumentasi arsitektur komprehensif berstandar jurnal ilmiah (IEEE/ACM format) tersedia pada:
👉 **[docs/TELCOLEARN_SCIENTIFIC_WHITEPAPER.md](docs/TELCOLEARN_SCIENTIFIC_WHITEPAPER.md)**

**Topik Riset yang Dibahas:**
1. **Dual-Tier Hybrid RAG**: Harmonisasi standar resmi 3GPP (22 spesifikasi Rel-15 s/d Rel-18) dengan ensiklopedia praktis ShareTechNote.
2. **Multi-Vendor Parameter Reconciliation**: Matriks padanan parameter radio lintas vendor (Ericsson MOM, Huawei MML, dan Nokia SRAN Rel-25R2).
3. **Dynamic Chameleon Perspective Adaptation**: Penyesuaian persona teknis dinamis (Core SBA, RAN Optimization, O-RAN Cloud-Native, CEM/SOC, Field Drive Test).
4. **Context Isolation & Disjoint Topic Shift Detection**: Algoritma pencegahan halusinasi silang topik percakapan multi-turn.
5. **Channel Security & Anti-Ban Architecture**: Randomisasi entropi fingerprint SHA-256, exponential backoff, circuit breaker cooldown, dan sandbox egress guardrail.
6. **Empirical Evaluation**: Validasi 100% pada 12 modul test suite otomatis.
