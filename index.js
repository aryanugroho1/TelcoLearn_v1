/**
 * TelcoLearn Baileys Native Engine Entrypoint
 * WhatsApp WebSocket Protocol Gateway & Worker Daemon
 * Berdasarkan Master PRD v3.0.0
 */

import 'dotenv/config';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers
} from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';

import { initializeDatabase } from './database/init.js';
import { handleIncomingMessage } from './services/routerService.js';
import { initScheduler, stopScheduler, isOutboundSchedulerPaused } from './services/schedulerService.js';
import { getStoredMessage, saveMessageToStore, isSocketReady } from './services/antiBanService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Self-Healing: Jika volume persistent storage Coolify di-mount menimpa /app/database,
// pastikan seluruh file kode JavaScript & SQL terbaru tetap ada di folder database volume tersebut
try {
  const dbDir = path.join(__dirname, 'database');
  const dbCoreDir = path.join(__dirname, 'database_core');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Sync from database_core if running inside Docker container with volume mount
  if (fs.existsSync(dbCoreDir)) {
    const coreFiles = fs.readdirSync(dbCoreDir);
    for (const file of coreFiles) {
      if (file.endsWith('.js') || file.endsWith('.sql')) {
        fs.copyFileSync(path.join(dbCoreDir, file), path.join(dbDir, file));
      }
    }
  }

  const sourcePostgres = path.join(__dirname, 'services', 'postgres.js');
  const targetPostgres = path.join(dbDir, 'postgres.js');
  if (!fs.existsSync(targetPostgres) && fs.existsSync(sourcePostgres)) {
    fs.copyFileSync(sourcePostgres, targetPostgres);
    console.log('🔄 [Self-Healing] Berhasil menyalin postgres.js ke volume persistent database.');
  }
} catch (e) {}

// Inisialisasi basis data SQLite saat startup
initializeDatabase();

// Auto-Ingest materi telekomunikasi baru dari knowledge_sources saat startup
try {
  const { runIngestion } = await import('./scripts/ingest_knowledge.js');
  await runIngestion();
} catch (ingestBootErr) {
  console.warn('ℹ️ [Startup Ingest]:', ingestBootErr.message);
}

const authFolder = path.join(__dirname, 'auth_info_baileys');
if (!fs.existsSync(authFolder)) {
  fs.mkdirSync(authFolder, { recursive: true });
}

// Konfigurasi Logger (minimal output agar terminal rapi)
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname'
    }
  }
});

import {
  isCooldownActive,
  activateCooldown,
  clearCooldown,
  calculateBackoff
} from './services/antiBanService.js';

let sockInstance = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Web Gateway state variables (untuk live QR portal di browser Coolify)
let latestQRDataUrl = null;
let latestPairingCode = null;
let botConnectionStatus = 'connecting'; // 'connecting' | 'qr_ready' | 'connected' | 'cooldown'
let botConnectedPhone = null;
let botCooldownInfo = null;

async function startBot() {
  console.log('\n========================================================');
  console.log('🚀 MEMULAI TELCOLEARN ENGINE (BAILEYS NATIVE GATEWAY)');
  console.log('========================================================');

  // 0. Bersihkan socket lama jika masih ada (mencegah Stream Conflict koneksi ganda)
  if (sockInstance) {
    try {
      console.log('🧹 Membersihkan instance socket lama...');
      sockInstance.ev.removeAllListeners();
      sockInstance.ws?.terminate?.();
      sockInstance.end?.();
    } catch (cleanErr) {}
    sockInstance = null;
  }

  // 0. Cek Circuit Breaker Cooldown Lock
  const forceStart = process.argv.includes('--force') || 
                     process.env.FORCE_START === 'true' || 
                     process.env.RESET_COOLDOWN === 'true';

  if (forceStart) {
    clearCooldown();
    botCooldownInfo = null;
  } else {
    const cooldown = isCooldownActive();
    if (cooldown) {
      botCooldownInfo = cooldown;
      botConnectionStatus = 'cooldown';
      console.warn('\n🛑 ========================================================');
      console.warn('🛑 [CIRCUIT BREAKER AKTIF] ENGINE DITANGGUHKAN SEMENTARA!');
      console.warn(`🛑 Alasan: ${cooldown.reason}`);
      console.warn(`🛑 Sisa Waktu Cooldown: ${cooldown.remainingMinutes} Menit (${(cooldown.remainingMinutes / 60).toFixed(1)} Jam)`);
      console.warn('🛑 ========================================================\n');
      await new Promise(resolve => setTimeout(resolve, 10000));
      return startBot();
    }
  }
  botCooldownInfo = null;

  const { state, saveCreds } = await useMultiFileAuthState(authFolder);
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`📦 Menggunakan Baileys Protocol v${version.join('.')}, isLatest: ${isLatest}`);

  let usePairingCode = (process.env.USE_PAIRING_CODE || 'false').toLowerCase() === 'true';
  const pairingNumber = (process.env.PHONE_NUMBER_FOR_PAIRING || process.env.BOT_PHONE_NUMBER || '').replace(/\D/g, '');

  // Otomatis beralih ke QR Code jika nomor kosong atau nomor contoh
  if (usePairingCode && (!pairingNumber || pairingNumber === '6281234567890' || pairingNumber.length < 9)) {
    console.log(`ℹ️ Nomor pairing tidak disetel / bernilai contoh (${pairingNumber || 'kosong'}). Mengalihkan otomatis ke QR Code.`);
    usePairingCode = false;
  }

  const browserTuple = ['Windows', 'Desktop', '10.0.22631'];

  const sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger)
    },
    logger: pino({ level: 'silent' }),
    printQRInTerminal: !usePairingCode,
    browser: browserTuple,
    syncFullHistory: false,
    generateHighQualityLinkPreview: false,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 60000,
    keepAliveIntervalMs: 25000,
    markOnlineOnConnect: true,
    getMessage: async () => ({ conversation: '' })
  });

  sockInstance = sock;

  // 1. Logika 8-Digit Pairing Code (Jika mode pairing aktif)
  if (usePairingCode && !sock.authState.creds.registered) {
    console.log(`\n⏳ Meminta 8-Digit Pairing Code untuk nomor: ${pairingNumber}...`);
    setTimeout(async () => {
      try {
        const rawCode = await sock.requestPairingCode(pairingNumber);
        const formattedCode = rawCode?.match(/.{1,4}/g)?.join('-') || rawCode;
        latestPairingCode = formattedCode;
        console.log('\n========================================================');
        console.log('📱 TELCOLEARN 8-DIGIT PAIRING CODE:');
        console.log(`👉   ${rawCode}   (Format: ${formattedCode})   👈`);
        console.log('========================================================');
      } catch (pairErr) {
        console.error('❌ Gagal menghasilkan Pairing Code:', pairErr?.message || pairErr);
      }
    }, 3000);
  }

  // 2. Simpan kredensial multi-file auth
  sock.ev.on('creds.update', saveCreds);

  // 3. Status Koneksi & Anti-Ban Circuit Breaker
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      botConnectionStatus = 'qr_ready';
      try {
        latestQRDataUrl = await QRCode.toDataURL(qr, { width: 340, margin: 2 });
      } catch (e) {}

      if (!usePairingCode) {
        console.log('📲 Pindai QR Code berikut menggunakan WhatsApp Anda:');
        qrcode.generate(qr, { small: true });

        const qrPngPath = path.join(__dirname, 'qrcode.png');
        try {
          await QRCode.toFile(qrPngPath, qr, { width: 500, margin: 2 });
          console.log(`\n📷 QR Code PNG resolusi tinggi berhasil disimpan ke:\n   👉 ${qrPngPath}\n`);
        } catch (qrErr) {
          console.error('Gagal menyimpan file qrcode.png:', qrErr);
        }
      }
    }

    if (connection === 'close') {
      botConnectionStatus = 'connecting';
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const errorMsg = lastDisconnect?.error?.message || '';

      console.warn(`⚠️ Koneksi terputus (Status Code: ${statusCode}). Detail: ${errorMsg}`);

      // KASUS 1: Stream Conflict (Koneksi ganda yang saling mendahului)
      // Ini BUKAN ban/restriksi, melainkan bentrok socket lama vs baru. Jangan picu cooldown 5 jam!
      if (errorMsg.toLowerCase().includes('conflict')) {
        console.warn('⚠️ Terdeteksi Stream Conflict (koneksi ganda). Menutup socket lama dan merefresh koneksi tunggal dalam 3 detik...');
        if (sockInstance) {
          try {
            sockInstance.ev.removeAllListeners();
            sockInstance.ws?.terminate?.();
            sockInstance.end?.();
          } catch (e) {}
          sockInstance = null;
        }
        setTimeout(startBot, 3000);
        return;
      }

      // KASUS 2: Status Code 401 (Unauthorized / Logged Out murni dari WhatsApp)
      if (statusCode === 401 || statusCode === DisconnectReason.loggedOut) {
        botConnectionStatus = 'cooldown';
        console.error('\n🛑 [CRITICAL] Terdeteksi penolakan otorisasi (401 Unauthorized / Logged Out).');
        console.error('🛑 Kemungkinan sesi telah dikeluarkan dari perangkat WhatsApp atau akun terkena restriksi.');
        console.error('🛑 MENGHENTIKAN SEMUA PERCOBAAN REKONEKSI UNTUK KEAMANAN AKUN.\n');
        activateCooldown(5, 'Deteksi restriksi 401 Unauthorized oleh server WhatsApp');

        // Memicu Notifikasi Alarm Darurat ke Admin (Email / Webhook)
        try {
          const { sendAdminCriticalAlert } = await import('./services/reportingService.js');
          await sendAdminCriticalAlert({
            title: 'Sesi WhatsApp Bot Terputus (401 Logged Out)',
            reason: 'Sesi WhatsApp di-logout dari perangkat HP pengguna atau dicabut oleh server WhatsApp.',
            actionUrl: 'http://100.122.15.96:3005/reset'
          });
        } catch (alertErr) {
          console.warn('⚠️ Gagal memicu alarm admin:', alertErr.message);
        }

        return;
      }

      // KASUS 3: Status Code 515 (restartRequired) menandakan handshake baru selesai
      if (statusCode === DisconnectReason.restartRequired || statusCode === 515) {
        console.log('\n========================================================');
        console.log('🎉 Handshake berhasil! Menyelesaikan sesi (Status 515)...');
        console.log('========================================================\n');
        reconnectAttempts = 0;
        try {
          sock.ev.removeAllListeners();
          sock.ws?.close();
        } catch (e) {}
        setTimeout(startBot, 1500);
        return;
      }

      // KASUS 4: Gangguan jaringan / WebSocket timeout biasa -> JANGAN picu cooldown fatal!
      // Terus lakukan rekoneksi otomatis dengan Exponential Backoff + Jitter dibatasi maksimal 60 detik
      reconnectAttempts++;
      const backoffDelay = calculateBackoff(Math.min(reconnectAttempts, 6), 3000, 60000);
      console.log(`🔄 [Auto-Reconnect] Percobaan rekoneksi ke-${reconnectAttempts} dalam ${Math.round(backoffDelay / 1000)} detik...`);
      setTimeout(startBot, backoffDelay);

    } else if (connection === 'open') {
      reconnectAttempts = 0;
      botConnectionStatus = 'connected';
      botConnectedPhone = sock.user?.id ? sock.user.id.split(':')[0].replace(/@.*/, '') : 'Aktif';
      latestQRDataUrl = null;
      latestPairingCode = null;
      console.log('\n========================================================');
      console.log('✅ TelcoLearn Bot BERHASIL TERHUBUNG ke WhatsApp Protocol!');
      console.log(`👤 JID Akun: ${sock.user?.id || 'Connected'}`);
      console.log('🛡️ Modul Anti-Spam & Ingress Router AKTIF.');
      console.log('========================================================\n');

      // Periksa status server Reachout Timelock WhatsApp
      try {
        const timelock = await sock.fetchAccountReachoutTimelock();
        if (timelock?.isActive) {
          const endsAt = new Date(timelock.timeEnforcementEnds);
          const remainingMinutes = Math.max(0, Math.round((endsAt - Date.now()) / 60000));
          console.warn('⚠️ ========================================================');
          console.warn('⚠️ [WHATSAPP SERVER REACHOUT TIMELOCK AKTIF]');
          console.warn(`⚠️ Jenis Restriksi: ${timelock.enforcementType}`);
          console.warn(`⚠️ Berakhir Pada  : ${endsAt.toLocaleString('id-ID')} (${remainingMinutes} menit lagi)`);
          console.warn('⚠️ Keterangan     : Server WhatsApp memberlakukan RESTRICT_ALL_COMPANIONS.');
          console.warn('⚠️                  Pesan keluar dari bot ke nomor lain ditolak sementara oleh server (Error 463).');
          console.warn('⚠️                  Pesan ke diri sendiri (Message Yourself) berfungsi 100%.');
          console.warn('⚠️ ========================================================\n');
        } else {
          console.log('🛡️ Status Akun Bersih: Tidak ada Reachout Timelock di server WhatsApp.');
        }
      } catch (e) {
        console.warn('ℹ️ Gagal memeriksa Reachout Timelock:', e.message);
      }

      // Aktifkan scheduler pengiriman materi harian dengan dynamic socket getter
      initScheduler(() => sockInstance);
    }
  });

  // 4. Listener Pesan Masuk (Inbound Worker)
  // Menangkap baik 'notify' (pesan orang lain) maupun 'append' (pesan ke diri sendiri)
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    for (const msg of messages) {
      if (msg.key?.id) {
        saveMessageToStore(msg.key.id, msg);
      }
      try {
        await handleIncomingMessage(sock, msg);
      } catch (msgErr) {
        console.error('❌ Gagal memproses pesan masuk:', msgErr);
      }
    }
  });

  // 5. Monitor Status Pengiriman Pesan (Delivery ACK & Error Tracking)
  sock.ev.on('messages.update', (updates) => {
    for (const update of updates) {
      if (update.update?.messageStubParameters?.includes('463')) {
        console.warn(`🛑 [WhatsApp Error 463] Pesan ID: ${update.key?.id} ditolak oleh WhatsApp Server karena masa Reachout Timelock masih aktif.`);
      } else if (update.update?.status) {
        const statusMap = {
          1: 'PENDING (Menunggu Server)',
          2: 'SERVER_ACK (Diterima Server WhatsApp)',
          3: 'DELIVERY_ACK (Terkirim ke WhatsApp HP Pengguna)',
          4: 'READ (Dibaca oleh Pengguna / Centang Biru)',
          5: 'PLAYED (Media Diputar)'
        };
        const statusLabel = statusMap[update.update.status] || `Status ${update.update.status}`;
        console.log(`📊 [Status Pesan WA] ID: ${update.key.id} -> ${statusLabel}`);
      } else {
        console.log(`📊 [Raw Message Update] ID: ${update.key?.id} -> ${JSON.stringify(update.update)}`);
      }
      if (update.update?.error) {
        console.warn(`⚠️ [Delivery Error] ID: ${update.key.id} -> Gagal dikirim ke HP:`, update.update.error);
      }
    }
  });
}

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('\n🛑 Menghentikan proses TelcoLearn Engine (SIGINT)...');
  stopScheduler();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Menghentikan proses TelcoLearn Engine (SIGTERM)...');
  stopScheduler();
  process.exit(0);
});

// ----------------------------------------------------
// 6. Web Gateway Portal (Live QR Code & Healthcheck UI)
// ----------------------------------------------------
function startWebServer() {
  const HTTP_PORT = process.env.PORT || 3000;
  const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, 'http://localhost');
    const pathname = parsedUrl.pathname;

    if (pathname === '/health' || pathname === '/api/status') {
      const isWsOpen = sockInstance ? isSocketReady(sockInstance) : false;
      const effectiveStatus = (botConnectionStatus === 'connected' && sockInstance && !isWsOpen) ? 'disconnected' : botConnectionStatus;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: effectiveStatus,
        wsReadyState: sockInstance?.ws?.socket?.readyState ?? sockInstance?.ws?.readyState ?? (isWsOpen ? 1 : null),
        phone: botConnectedPhone,
        cooldown: botCooldownInfo,
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Endpoint Ekspor Data Log & Analytics (Terproteksi Secret Key)
    if (pathname === '/api/export-logs' || pathname === '/api/export-data') {
      const authHeader = req.headers['authorization'] || '';
      const secretQuery = parsedUrl.searchParams.get('secret') || parsedUrl.searchParams.get('key');
      const expectedSecret = process.env.ADMIN_EXPORT_SECRET || 'telcolearn-export-key-2026';

      if (secretQuery !== expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized. Invalid secret key.' }));
        return;
      }

      try {
        const { getDb } = await import('./database/db.js');
        const { getPgPool } = await import('./services/postgres.js');
        const db = getDb();

        const conversationLogs = db.prepare(`
          SELECT l.id, l.user_id, u.display_name, u.phone_number, l.incoming_query, l.ai_response, l.latency_ms, l.prompt_tokens, l.output_tokens, l.total_tokens, l.model_name, l.created_at
          FROM llm_conversation_logs l
          LEFT JOIN users u ON l.user_id = u.id
          ORDER BY l.id DESC
        `).all();

        const feedbacksSqlite = db.prepare(`SELECT * FROM user_feedbacks ORDER BY id DESC`).all();

        let pgCache = [];
        let pgFeedbacks = [];
        const pool = getPgPool();
        if (pool) {
          try {
            const cacheRes = await pool.query(`SELECT id, query_hash, query_text, response_text, model_name, hit_count, created_at FROM llm_response_cache ORDER BY hit_count DESC LIMIT 100`);
            pgCache = cacheRes.rows;
            const fbRes = await pool.query(`SELECT * FROM user_feedbacks ORDER BY id DESC LIMIT 100`);
            pgFeedbacks = fbRes.rows;
          } catch (pgErr) {
            console.warn('⚠️ [Export API] Gagal membaca PG:', pgErr.message);
          }
        }

        const users = db.prepare(`SELECT id, phone_number, display_name, focus_track, current_state, streak_count, last_active_date, created_at FROM users ORDER BY id DESC`).all();

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          server_time: new Date().toISOString(),
          stats: {
            total_logs: conversationLogs.length,
            total_users: users.length,
            total_feedbacks_sqlite: feedbacksSqlite.length,
            total_cache_pg: pgCache.length,
            total_feedbacks_pg: pgFeedbacks.length
          },
          conversation_logs: conversationLogs,
          feedbacks: {
            sqlite: feedbacksSqlite,
            postgres: pgFeedbacks
          },
          cached_queries: pgCache,
          users: users
        }, null, 2));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // Endpoint Download SQLite Database File Langsung
    if (pathname === '/api/download-db') {
      const authHeader = req.headers['authorization'] || '';
      const secretQuery = parsedUrl.searchParams.get('secret') || parsedUrl.searchParams.get('key');
      const expectedSecret = process.env.ADMIN_EXPORT_SECRET || 'telcolearn-export-key-2026';

      if (secretQuery !== expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized. Invalid secret key.' }));
        return;
      }

      const legacyDbPath = path.join(__dirname, 'database', 'telcolearn.db');
      const dataDirDbPath = path.resolve(__dirname, 'data', 'telcolearn.db');
      const dbPath = process.env.DATABASE_PATH 
        ? path.resolve(__dirname, process.env.DATABASE_PATH)
        : (fs.existsSync(dataDirDbPath) ? dataDirDbPath : legacyDbPath);
      if (fs.existsSync(dbPath)) {
        res.writeHead(200, {
          'Content-Type': 'application/x-sqlite3',
          'Content-Disposition': 'attachment; filename="telcolearn-coolify.db"'
        });
        fs.createReadStream(dbPath).pipe(res);
        return;
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Database file not found.' }));
        return;
      }
    }

    // Endpoint Broadcast Pengumuman / Permohonan Maaf Satu Kali (Anti-Ban Serial)
    if (pathname.startsWith('/api/admin/broadcast')) {
      const authHeader = req.headers['authorization'] || '';
      const secretQuery = parsedUrl.searchParams.get('secret') || parsedUrl.searchParams.get('key');
      const expectedSecret = process.env.ADMIN_EXPORT_SECRET || 'telcolearn-export-key-2026';

      if (secretQuery !== expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized. Invalid secret key.' }));
        return;
      }

      try {
        const { 
          getBroadcastPreview, 
          getBroadcastState, 
          startSerialBroadcast, 
          pauseBroadcast, 
          resetBroadcastState 
        } = await import('./services/broadcastService.js');

        const action = parsedUrl.searchParams.get('action') || (pathname.split('/')[4] || 'status');

        if (req.method === 'GET') {
          if (action === 'preview') {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(getBroadcastPreview(), null, 2));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            status: getBroadcastState(),
            preview: getBroadcastPreview()
          }, null, 2));
          return;
        }

        if (req.method === 'POST') {
          let postBody = {};
          try {
            const chunks = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            if (chunks.length > 0) {
              const raw = Buffer.concat(chunks).toString('utf-8');
              if (raw.trim().startsWith('{')) {
                postBody = JSON.parse(raw);
              }
            }
          } catch (e) {}

          const options = {
            preset: postBody.preset || parsedUrl.searchParams.get('preset') || 'apology_recovery',
            targetFilter: postBody.targetFilter || parsedUrl.searchParams.get('filter') || 'all',
            customTextId: postBody.customTextId || parsedUrl.searchParams.get('text_id') || null,
            customTextEn: postBody.customTextEn || parsedUrl.searchParams.get('text_en') || null,
            forceReset: postBody.forceReset === true || parsedUrl.searchParams.get('forceReset') === 'true'
          };

          if (action === 'start' || action === 'resume') {
            const result = await startSerialBroadcast(() => sockInstance, options);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result, null, 2));
            return;
          }
          if (action === 'pause') {
            const result = pauseBroadcast();
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result, null, 2));
            return;
          }
          if (action === 'reset') {
            const result = resetBroadcastState();
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result, null, 2));
            return;
          }
        }

        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Unknown action: ${action}` }));
        return;
      } catch (bcErr) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: bcErr.message }));
        return;
      }
    }

    // Endpoint Antarmuka Menu Broadcast Admin
    if (pathname === '/broadcast' || pathname === '/admin/broadcast') {
      const { renderBroadcastHtml } = await import('./services/broadcastUi.js');
      const expectedSecret = process.env.ADMIN_EXPORT_SECRET || 'telcolearn-export-key-2026';
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderBroadcastHtml({
        botConnectedPhone: botConnectedPhone || '628158722770',
        isConnected: botConnectionStatus === 'connected',
        secretKey: expectedSecret
      }));
      return;
    }

    // Endpoint API Kontrol Scheduler (status, pause, resume)
    if (pathname === '/api/admin/scheduler') {
      const action = parsedUrl.searchParams.get('action') || 'status';
      const {
        getSchedulerStatus,
        pauseOutboundScheduler,
        resumeOutboundScheduler
      } = await import('./services/schedulerService.js');

      if (action === 'pause') {
        const resObj = pauseOutboundScheduler();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(resObj, null, 2));
        return;
      }
      if (action === 'resume') {
        const resObj = resumeOutboundScheduler();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(resObj, null, 2));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(getSchedulerStatus(), null, 2));
      return;
    }

    // Endpoint reconnect cepat (tanpa hapus file sesi / tanpa scan QR ulang)
    if (pathname === '/reconnect' || pathname === '/api/reconnect') {
      console.log('🔄 [Web Portal] Tindakan Rekoneksi Cepat dipicu via browser. Merefresh socket WhatsApp...');
      clearCooldown();
      botCooldownInfo = null;
      botConnectionStatus = 'connecting';
      if (sockInstance) {
        try {
          sockInstance.ev.removeAllListeners();
          sockInstance.ws?.terminate?.();
          sockInstance.end?.();
        } catch (e) {}
        sockInstance = null;
      }
      setTimeout(startBot, 1000);
      res.writeHead(302, { Location: '/' });
      res.end();
      return;
    }

    // Endpoint reset / force QR baru
    if (pathname === '/reset' || pathname === '/api/reset' || req.url === '/reset' || req.url === '/api/reset') {
      console.log('🔄 [Web Portal] Tindakan Reset dipicu via web browser! Membersihkan lock dan sesi lama...');
      clearCooldown();
      botCooldownInfo = null;
      botConnectionStatus = 'connecting';
      latestQRDataUrl = null;
      latestPairingCode = null;
      try {
        if (fs.existsSync(authFolder)) {
          const files = fs.readdirSync(authFolder);
          for (const f of files) {
            fs.unlinkSync(path.join(authFolder, f));
          }
        }
      } catch (e) {}

      if (sockInstance) {
        try {
          sockInstance.ev.removeAllListeners();
          sockInstance.ws?.terminate?.();
          sockInstance.end?.();
        } catch (e) {}
        sockInstance = null;
      }
      setTimeout(startBot, 500);
      res.writeHead(302, { Location: '/' });
      res.end();
      return;
    }

    if (req.url === '/qr.png' && latestQRDataUrl) {
      const base64Data = latestQRDataUrl.replace(/^data:image\/png;base64,/, '');
      const imgBuffer = Buffer.from(base64Data, 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': imgBuffer.length
      });
      res.end(imgBuffer);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    const isConnected = botConnectionStatus === 'connected';
    const isCooldown = botConnectionStatus === 'cooldown';
    const isSchedulerPaused = typeof isOutboundSchedulerPaused === 'function' ? isOutboundSchedulerPaused() : true;
    const refreshSec = isConnected ? 60 : (isCooldown ? 15 : 6);
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TelcoLearn WhatsApp Gateway</title>
  <meta http-equiv="refresh" content="${refreshSec}">
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { background: #1e293b; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); padding: 36px; max-width: 480px; width: 100%; text-align: center; border: 1px solid #334155; }
    h1 { margin-top: 0; font-size: 24px; color: #38bdf8; letter-spacing: -0.5px; }
    .badge { display: inline-block; padding: 8px 16px; border-radius: 9999px; font-size: 13px; font-weight: 700; margin-bottom: 24px; letter-spacing: 0.5px; }
    .badge-connecting { background: #854d0e; color: #fef08a; }
    .badge-cooldown { background: #991b1b; color: #fecaca; }
    .badge-qr { background: #0369a1; color: #e0f2fe; }
    .badge-connected { background: #15803d; color: #dcfce7; }
    .qr-box { background: white; padding: 16px; border-radius: 16px; display: inline-block; margin: 12px auto; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
    .qr-box img { display: block; max-width: 280px; width: 100%; height: auto; border-radius: 8px; }
    .code-box { background: #0f172a; border: 2px dashed #38bdf8; border-radius: 12px; padding: 18px; margin: 20px 0; font-size: 30px; font-family: monospace; letter-spacing: 6px; color: #38bdf8; font-weight: bold; }
    .btn { display: inline-block; padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none; transition: background 0.2s; }
    .btn-primary { background: #0284c7; color: white; box-shadow: 0 4px 14px rgba(2,132,199,0.4); }
    .btn-secondary { background: #334155; color: #cbd5e1; font-size: 12px; padding: 8px 14px; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 12px 0; }
    .instructions { text-align: left; background: #0f172a; padding: 16px; border-radius: 12px; margin-top: 20px; border: 1px solid #334155; }
    .instructions ol { margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 13px; line-height: 1.8; }
    .footer { margin-top: 24px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <h1>📡 TelcoLearn WhatsApp Gateway</h1>
    ${isConnected ? `
      <div class="badge badge-connected">🟢 BOT ONLINE & SIAP</div>
      <p style="font-size: 18px; color: #f8fafc; font-weight: 600;">Nomor Bot: +${botConnectedPhone}</p>
      <p>TelcoLearn engine aktif dan siap menjawab pertanyaan telekomunikasi, modul kurikulum, kuis, serta analisis RAG.</p>
      <div style="margin-top: 18px;">
        <a href="/reconnect" class="btn btn-primary" style="margin-right: 8px;">
          🔄 Refresh Koneksi WhatsApp
        </a>
        <a href="/reset" class="btn btn-secondary" onclick="return confirm('Peringatan: Opsi ini akan menghapus sesi WhatsApp dan meminta Scan QR Code ulang. Lanjutkan?');">
          ⚠️ Hapus Sesi & Scan QR Baru
        </a>
      </div>
      <div style="margin-top: 24px; padding: 16px; background: #0f172a; border-radius: 12px; border: 1px solid #334155; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <strong style="color: #38bdf8; font-size: 13px;">📢 One-Time Serial Broadcast</strong>
          <span style="font-size: 10px; padding: 2px 8px; border-radius: 6px; background: #334155; color: #94a3b8; font-weight: 600;">ANTI-BAN SERIAL</span>
        </div>
        <p style="font-size: 12px; margin: 4px 0 12px 0; color: #cbd5e1; line-height: 1.5;">Kirim pesan permohonan maaf koneksi & update kebijakan 14 hari ke seluruh pengguna secara aman (serial pacing).</p>
        <div style="display: flex; gap: 8px;">
          <a href="/api/admin/broadcast?action=preview&secret=telcolearn-export-key-2026" target="_blank" class="btn btn-secondary" style="flex: 1; text-align: center; font-size: 12px;">🔍 Cek Preview</a>
          <button onclick="if(confirm('Mulai kirim broadcast serial ke seluruh pengguna? Estimasi selesai ~60 menit secara serial aman.')){fetch('/api/admin/broadcast?action=start&secret=telcolearn-export-key-2026',{method:'POST'}).then(r=>r.json()).then(d=>alert(d.message)).then(()=>location.reload())}" class="btn btn-primary" style="flex: 1; text-align: center; font-size: 12px; cursor: pointer; border: none;">🚀 Mulai Kirim</button>
        </div>
      </div>
    ` : isCooldown ? `
      <div class="badge badge-cooldown">🛑 PROTEKSI COOLDOWN AKTIF</div>
      <p style="color: #fca5a5;">Engine mendeteksi penolakan otorisasi 401 sebelumnya.<br>Sisa waktu proteksi otomatis: <strong>${botCooldownInfo?.remainingMinutes || 60} menit</strong>.</p>
      <div style="margin: 20px 0;">
        <a href="/reconnect" class="btn btn-primary" style="margin-right: 8px;">
          🔓 Coba Rekoneksi Sekarang
        </a>
        <a href="/reset" class="btn btn-secondary">
          ⚡ Buat QR Code Baru
        </a>
      </div>
      <p style="font-size: 12px; color: #94a3b8;">Klik tombol di atas untuk mereset kunci pengaman dan mencoba menyambungkan kembali ke WhatsApp.</p>
    ` : latestQRDataUrl ? `
      <div class="badge badge-qr">📲 SCAN QR CODE WHATSAPP</div>
      <p>Pindai QR Code di bawah menggunakan kamera WhatsApp di ponsel Anda:</p>
      <div class="qr-box">
        <img src="${latestQRDataUrl}" alt="WhatsApp QR Code">
      </div>
      <div class="instructions">
        <ol>
          <li>Buka WhatsApp di ponsel Anda</li>
          <li>Ketuk <strong>Titik Tiga</strong> (atau Pengaturan) &gt; <strong>Perangkat Tertaut</strong></li>
          <li>Pilih <strong>Tautkan Perangkat</strong> lalu arahkan kamera ke QR Code di atas</li>
        </ol>
      </div>
      <div style="margin-top: 16px;">
        <a href="/reset" class="btn btn-secondary">
          🔄 QR Code Expired? Klik untuk QR Baru
        </a>
      </div>
      <p style="font-size: 12px; color: #64748b; margin-top: 8px;">Halaman me-refresh otomatis setiap 6 detik.</p>
    ` : latestPairingCode ? `
      <div class="badge badge-qr">📱 KODE PAIRING 8-DIGIT</div>
      <p>Masukkan kode berikut di WhatsApp ponsel Anda:</p>
      <div class="code-box">${latestPairingCode}</div>
      <div class="instructions">
        <ol>
          <li>Buka WhatsApp &gt; <strong>Perangkat Tertaut</strong> &gt; <strong>Tautkan Perangkat</strong></li>
          <li>Pilih opsi bawah: <strong>"Tautkan dengan nomor telepon saja"</strong></li>
          <li>Masukkan 8-digit kode di atas</li>
        </ol>
      </div>
      <div style="margin-top: 16px;">
        <a href="/reset" class="btn btn-secondary">
          🔄 Ganti ke Scan QR Code
        </a>
      </div>
    ` : `
      <div class="badge badge-connecting">⏳ MENGHUBUNGKAN KE WHATSAPP...</div>
      <p>Sedang memuat protokol Baileys. Kode QR atau Pairing Code akan muncul di sini secara otomatis dalam beberapa detik...</p>
      <div style="margin-top: 20px;">
        <a href="/reconnect" class="btn btn-primary" style="margin-right: 8px;">
          🔄 Coba Rekoneksi
        </a>
        <a href="/reset" class="btn btn-secondary">
          ⚡ Paksa Buat QR Code Baru
        </a>
      </div>
    `}
    <div style="margin-top: 20px; padding: 14px; background: #0f172a; border-radius: 12px; border: 1px solid #334155; text-align: left;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <strong style="color: #38bdf8; font-size: 13px;">⏰ Outbound Cron Scheduler</strong>
        <span style="font-size: 10px; padding: 2px 8px; border-radius: 6px; background: ${isSchedulerPaused ? '#991b1b' : '#15803d'}; color: ${isSchedulerPaused ? '#fecaca' : '#dcfce7'}; font-weight: 600;">
          ${isSchedulerPaused ? '🛑 DIJEDA SEMENTARA' : '🟢 AKTIF BERJALAN'}
        </span>
      </div>
      <p style="font-size: 12px; margin: 4px 0 10px 0; color: #cbd5e1; line-height: 1.5;">
        ${isSchedulerPaused 
          ? 'Safety Mode: Push materi otomatis (Pagi 07:30, Siang 12:30, Streak 20:00, Malam 20:30) dijeda untuk melindungi nomor dari ban Meta. Bot beroperasi dalam mode Inbound On-Demand.' 
          : 'Jadwal push materi otomatis harian aktif (Pagi, Siang, Streak Rescue, Malam).'}
      </p>
      <div style="display: flex; gap: 8px;">
        ${isSchedulerPaused ? `
          <button onclick="if(confirm('Aktifkan kembali jadwal push materi otomatis harian?')){fetch('/api/admin/scheduler?action=resume').then(r=>r.json()).then(d=>alert(d.message)).then(()=>location.reload())}" class="btn btn-secondary" style="flex: 1; text-align: center; font-size: 12px; cursor: pointer; border: none;">▶️ Aktifkan Kembali</button>
        ` : `
          <button onclick="if(confirm('Jeda seluruh pengiriman push materi terjadwal sekarang?')){fetch('/api/admin/scheduler?action=pause').then(r=>r.json()).then(d=>alert(d.message)).then(()=>location.reload())}" class="btn btn-secondary" style="flex: 1; text-align: center; font-size: 12px; cursor: pointer; border: none; color: #fca5a5;">⏸️ Jeda Scheduler</button>
        `}
      </div>
    </div>
    <div class="footer">TelcoLearn Engine v3.7.0 &bull; Powered by Baileys & Gemini 3 Flash</div>
  </div>
</body>
</html>`;
    res.end(html);
  });

  server.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log(`🌐 [Web Gateway] TelcoLearn Web Portal aktif di: http://0.0.0.0:${HTTP_PORT}`);
  });
}

// Jalankan Web Portal Portal Port 3000
startWebServer();

// Jalankan Bot
startBot().catch((err) => {
  console.error('❌ Fatal error saat inisialisasi TelcoLearn Engine:', err);
});

// 7. Watchdog Deteksi Zombie Socket (Otomatis Rekoneksi jika socket terputus)
setInterval(() => {
  const cooldown = isCooldownActive();
  if (cooldown) return;

  if (botConnectionStatus === 'connected' && sockInstance) {
    const ws = sockInstance.ws;
    const wsState = ws?.readyState;
    // 0: CONNECTING, 1: OPEN, 2: CLOSING, 3: CLOSED
    if (wsState === 2 || wsState === 3 || (wsState === undefined && !sockInstance.user)) {
      console.warn(`⚠️ [Socket Watchdog] Terdeteksi socket WhatsApp non-aktif (readyState: ${wsState}). Memicu pemulihan otomatis...`);
      botConnectionStatus = 'connecting';
      if (sockInstance) {
        try {
          sockInstance.ev.removeAllListeners();
          sockInstance.ws?.terminate?.();
          sockInstance.end?.();
        } catch (e) {}
        sockInstance = null;
      }
      setTimeout(startBot, 2000);
    }
  }
}, 25000);
