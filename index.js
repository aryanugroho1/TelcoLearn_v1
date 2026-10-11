/**
 * TelcoLearn Baileys Native Engine Entrypoint
 * WhatsApp WebSocket Protocol Gateway & Worker Daemon
 * Berdasarkan Master PRD v3.0.0
 */

import 'dotenv/config';
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
import { initScheduler, stopScheduler } from './services/schedulerService.js';
import { getStoredMessage, saveMessageToStore } from './services/antiBanService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inisialisasi basis data SQLite saat startup
initializeDatabase();

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
  } else {
    const cooldown = isCooldownActive();
    if (cooldown) {
      console.warn('\n🛑 ========================================================');
      console.warn('🛑 [CIRCUIT BREAKER AKTIF] ENGINE DITANGGUHKAN SEMENTARA!');
      console.warn(`🛑 Alasan: ${cooldown.reason}`);
      console.warn(`🛑 Sisa Waktu Cooldown: ${cooldown.remainingMinutes} Menit (${(cooldown.remainingMinutes / 60).toFixed(1)} Jam)`);
      console.warn(`🛑 Waktu Buka Otomatis: ${new Date(cooldown.cooldownUntil).toLocaleString('id-ID')}`);
      console.warn('🛑 Tindakan: Engine menolak menyentuh WhatsApp API agar nomor Anda tidak terblokir permanen.');
      console.warn('🛑 Cara Reset Instan di Coolify: Tambahkan Environment Variable:');
      console.warn('🛑   FORCE_START=true');
      console.warn('🛑 Lalu deploy / restart aplikasi di Coolify.');
      console.warn('🛑 ========================================================\n');
      // Biarkan proses idle agar container tidak crash-loop me-restart setiap detik di Coolify
      await new Promise(resolve => setTimeout(resolve, 30000));
      return startBot();
    }
  }

  const { state, saveCreds } = await useMultiFileAuthState(authFolder);
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`📦 Menggunakan Baileys Protocol v${version.join('.')}, isLatest: ${isLatest}`);

  const usePairingCode = (process.env.USE_PAIRING_CODE || 'true').toLowerCase() === 'true';
  const pairingNumber = (process.env.PHONE_NUMBER_FOR_PAIRING || process.env.BOT_PHONE_NUMBER || '').replace(/\D/g, '');

  const browserTuple = ['Windows', 'Desktop', '10.0.22631'];

  const sock = makeWASocket({
    version,
    auth: state,
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

  // 1. Logika 8-Digit Pairing Code (Jika belum terdaftar)
  if (usePairingCode && !sock.authState.creds.registered) {
    if (!pairingNumber || pairingNumber === '6281234567890' || pairingNumber.length < 9) {
      console.warn('\n⚠️ ========================================================');
      console.warn('⚠️ PERINGATAN: NOMOR WHATSAPP PAIRING MASIH KOSONG ATAU MENGGUNAKAN NOMOR CONTOH!');
      console.warn(`⚠️ Nomor terbaca: "${pairingNumber || 'KOSONG'}"`);
      console.warn('⚠️ Server WhatsApp akan langsung menolak (401 / 428) jika menggunakan nomor contoh 6281234567890.');
      console.warn('⚠️ ');
      console.warn('⚠️ CARA MENGATASINYA DI COOLIFY:');
      console.warn('⚠️ 1. Buka Coolify > Project > Environment Variables');
      console.warn('⚠️ 2. Ganti PHONE_NUMBER_FOR_PAIRING dengan nomor WhatsApp bot Anda (misal: 628158722770)');
      console.warn('⚠️ 3. Format: Kode negara tanpa spasi atau tanda + (contoh: 628xxx)');
      console.warn('⚠️ 4. ATAU ubah USE_PAIRING_CODE=false jika Anda lebih suka login via Scan QR Code di logs.');
      console.warn('⚠️ ========================================================\n');
      await new Promise(resolve => setTimeout(resolve, 30000));
      return startBot();
    } else {
      console.log(`\n⏳ Meminta 8-Digit Pairing Code untuk nomor: ${pairingNumber}...`);
      setTimeout(async () => {
        try {
          const rawCode = await sock.requestPairingCode(pairingNumber);
          const formattedCode = rawCode?.match(/.{1,4}/g)?.join('-') || rawCode;
          console.log('\n========================================================');
          console.log('📱 TELCOLEARN 8-DIGIT PAIRING CODE:');
          console.log(`👉   ${rawCode}   (Format: ${formattedCode})   👈`);
          console.log('========================================================');
          console.log('Panduan Login di Ponsel WhatsApp Anda:');
          console.log('1. Buka Setelan WhatsApp > Perangkat Tertaut (Linked Devices)');
          console.log('2. Pilih "Tautkan Perangkat" (Link a Device)');
          console.log('3. Ketuk opsi bawah: "Tautkan dengan nomor telepon saja"');
          console.log(`4. Masukkan kode: ${rawCode} atau ${formattedCode}`);
          console.log('========================================================\n');
        } catch (pairErr) {
          console.error('❌ Gagal menghasilkan Pairing Code:', pairErr?.message || pairErr);
        }
      }, 3000);
    }
  }

  // 2. Simpan kredensial multi-file auth
  sock.ev.on('creds.update', saveCreds);

  // 3. Status Koneksi & Anti-Ban Circuit Breaker
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !usePairingCode) {
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

    if (connection === 'close') {
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
        console.error('\n🛑 [CRITICAL] Terdeteksi penolakan otorisasi (401 Unauthorized / Logged Out).');
        console.error('🛑 Kemungkinan akun sedang dalam masa restriksi spam oleh WhatsApp.');
        console.error('🛑 MENGHENTIKAN SEMUA PERCOBAAN REKONEKSI UNTUK KEAMANAN AKUN.\n');
        activateCooldown(5, 'Deteksi restriksi 401 Unauthorized oleh server WhatsApp');
        return;
      }

      // KASUS 3: Status Code 515 (restartRequired) menandakan handshake baru selesai
      if (statusCode === DisconnectReason.restartRequired || statusCode === 515) {
        console.log('\n========================================================');
        console.log('🎉 Handshake berhasil! Menyelesaikan sesi (Status 515)...');
        console.log('========================================================\n');
        reconnectAttempts = 0;
        // Tutup listener socket lama sebelum membuka sesi yang baru
        try {
          sock.ev.removeAllListeners();
          sock.ws?.close();
        } catch (e) {}
        setTimeout(startBot, 1500);
        return;
      }

      // KASUS 3: Gangguan jaringan biasa -> gunakan Exponential Backoff dengan Jitter
      reconnectAttempts++;
      if (reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
        console.error(`\n❌ Batas maksimal rekoneksi (${MAX_RECONNECT_ATTEMPTS}x) tercapai.`);
        console.error('Menghentikan engine demi keamanan nomor WhatsApp.\n');
        activateCooldown(1, `Batas maksimal rekoneksi jaringan tercapai (${MAX_RECONNECT_ATTEMPTS}x percobaan)`);
        return;
      }

      const backoffDelay = calculateBackoff(reconnectAttempts);
      console.log(`🔄 Percobaan rekoneksi ke-${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} dalam ${Math.round(backoffDelay / 1000)} detik...`);
      setTimeout(startBot, backoffDelay);

    } else if (connection === 'open') {
      reconnectAttempts = 0;
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

      // Aktifkan scheduler pengiriman materi harian
      initScheduler(sock);
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

// Jalankan Bot
startBot().catch((err) => {
  console.error('❌ Fatal error saat inisialisasi TelcoLearn Engine:', err);
});
