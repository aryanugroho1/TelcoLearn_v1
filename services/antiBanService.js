/**
 * TelcoLearn Anti-Detect & Anti-Spam Security Module
 * Melindungi nomor WhatsApp dari restriksi / ban dengan menerapkan:
 * 1. Circuit Breaker & Cooldown Lockfile (mencegah loop rekoneksi saat status 401/restricted)
 * 2. Exponential Backoff dengan Jitter untuk rekoneksi jaringan
 * 3. Human Presence Simulator (mark read, composing state, dynamic typing delay)
 * 4. Content Fingerprint Randomizer (invisible zero-width hash perturbation)
 * 5. Outbound Sequential Queue & Rate Limiting (mencegah bulk messaging spike)
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCK_FILE_PATH = path.join(__dirname, '..', 'cooldown_lock.json');

/**
 * In-Memory Message Store untuk melayani Baileys getMessage retry callback
 * Menyimpan pesan masuk dan keluar terbaru agar handshake retry Signal Protocol berhasil
 */
export const messageStore = new Map();
const MAX_MESSAGE_STORE = 1000;

export function saveMessageToStore(id, msg) {
  if (!id || !msg) return;
  if (messageStore.size >= MAX_MESSAGE_STORE) {
    const oldestKey = messageStore.keys().next().value;
    messageStore.delete(oldestKey);
  }
  messageStore.set(id, msg);
}

export function getStoredMessage(id) {
  const item = messageStore.get(id);
  return item?.message || item;
}

/**
 * Anti-Loop Outbound Tracker
 * Melacak ID pesan yang dikirim oleh bot agar tidak diproses kembali sebagai pesan masuk (anti feedback-loop)
 */
export const sentMessageIds = new Set();

export function recordSentMessageId(id) {
  if (!id) return;
  sentMessageIds.add(id);
  setTimeout(() => sentMessageIds.delete(id), 180000); // Evict setelah 3 menit
}

/**
 * ----------------------------------------------------
 * 1. CIRCUIT BREAKER & COOLDOWN LOCK
 * ----------------------------------------------------
 */

export function isCooldownActive() {
  if (!fs.existsSync(LOCK_FILE_PATH)) return false;
  try {
    const raw = fs.readFileSync(LOCK_FILE_PATH, 'utf-8');
    const data = JSON.parse(raw);
    const now = Date.now();
    if (data.cooldownUntil && now < data.cooldownUntil) {
      const remainingMinutes = Math.ceil((data.cooldownUntil - now) / 60000);
      return {
        active: true,
        remainingMinutes,
        reason: data.reason || 'Restriksi terdeteksi oleh WhatsApp',
        cooldownUntil: new Date(data.cooldownUntil).toISOString()
      };
    }
    // Cooldown sudah kedaluwarsa, hapus file lock
    fs.unlinkSync(LOCK_FILE_PATH);
    return false;
  } catch (err) {
    console.error('⚠️ Gagal membaca cooldown_lock.json:', err.message);
    return false;
  }
}

export function activateCooldown(hours = 5, reason = 'Restricted / 401 Unauthorized') {
  const cooldownUntil = Date.now() + hours * 3600 * 1000;
  const payload = {
    activatedAt: new Date().toISOString(),
    cooldownHours: hours,
    cooldownUntil,
    reason
  };
  fs.writeFileSync(LOCK_FILE_PATH, JSON.stringify(payload, null, 2), 'utf-8');
  console.warn(`\n🛑 [CIRCUIT BREAKER AKTIF] Engine memasuki masa cooldown selama ${hours} jam!`);
  console.warn(`Alasan: ${reason}`);
  console.warn(`Waktu dibuka kembali: ${new Date(cooldownUntil).toLocaleString('id-ID')}\n`);
}

export function clearCooldown() {
  if (fs.existsSync(LOCK_FILE_PATH)) {
    fs.unlinkSync(LOCK_FILE_PATH);
    console.log('🔓 [CIRCUIT BREAKER] Cooldown lock berhasil direset.');
  }
}

/**
 * ----------------------------------------------------
 * 2. EXPONENTIAL BACKOFF CALCULATOR
 * ----------------------------------------------------
 */
export function calculateBackoff(attempt, baseDelayMs = 5000, maxDelayMs = 60000) {
  const expDelay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
  // Berikan jitter acak ±20% agar tidak terdeteksi sebagai pola teratur
  const jitter = expDelay * (0.8 + Math.random() * 0.4);
  return Math.round(jitter);
}

/**
 * ----------------------------------------------------
 * 3. CONTENT FINGERPRINT RANDOMIZER (Safe Whitespace)
 * ----------------------------------------------------
 */
// Variasi whitespace tak kasat mata yang 100% aman bagi seluruh parser WhatsApp mobile
export function randomizeMessageContent(text) {
  if (!text || typeof text !== 'string') return text;

  // Berikan variasi spasi acak di akhir teks (1-4 spasi acak) agar hash SHA-256 selalu unik
  // tanpa merusak render teks di aplikasi WhatsApp Android maupun iOS
  const count = Math.floor(Math.random() * 4) + 1;
  const trailingWhitespace = ' '.repeat(count);
  return text + trailingWhitespace;
}

/**
 * Hitung SHA-256 hash dari teks untuk verifikasi perbedaan hash
 */
export function getMessageHash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * ----------------------------------------------------
 * 4. HUMAN PRESENCE & TYPING SIMULATOR
 * ----------------------------------------------------
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function simulateHumanPresence(sock, jid, incomingMsgKey = null, textLength = 50) {
  if (!sock) return;

  try {
    // 1. Centang biru / tandai telah dibaca (hanya untuk pesan orang lain, bukan pesan sendiri)
    if (incomingMsgKey && !incomingMsgKey.fromMe) {
      await sock.readMessages([incomingMsgKey]).catch(() => {});
    }

    // 2. Jeda manusia saat membaca pesan (300 - 600ms)
    const readingDelay = Math.floor(300 + Math.random() * 300);
    await sleep(readingDelay);

    // 3. Kirim status 'composing' (sedang mengetik...)
    await sock.sendPresenceUpdate('composing', jid).catch(() => {});

    // 4. Durasi mengetik dinamis proporsional (800ms - 1800ms)
    const typingDuration = Math.min(1800, Math.max(800, textLength * 12));
    await sleep(typingDuration);

    // 5. Berhenti mengetik (paused) sesaat sebelum kirim
    await sock.sendPresenceUpdate('paused', jid).catch(() => {});
    await sleep(100);
  } catch (err) {
    console.warn('⚠️ Gagal mengirim simulasi presence:', err.message);
  }
}

/**
 * ----------------------------------------------------
 * 4.5. SECURITY GUARDRAIL: VALIDASI EGRESS KELUAR
 * ----------------------------------------------------
 * Memverifikasi bahwa payload HANYA berupa teks murni.
 * Menolak keras pengiriman gambar, video, dokumen, audio, kontak, atau file host.
 */
export const DISALLOWED_EGRESS_KEYS = [
  'image',
  'video',
  'document',
  'audio',
  'sticker',
  'contact',
  'contacts',
  'location',
  'liveLocation',
  'file',
  'url'
];

export function validateEgressPayload(content) {
  if (!content || typeof content !== 'object') {
    return { valid: false, reason: 'Payload harus berupa object dengan properti text.' };
  }

  // Cek apakah ada key terlarang (media, dokumen, audio, dll)
  for (const key of DISALLOWED_EGRESS_KEYS) {
    if (key in content) {
      return {
        valid: false,
        reason: `Pengiriman media/file terlarang ('${key}') ditolak oleh Security Guardrail TelcoLearn.`
      };
    }
  }

  // Wajib memiliki properti text berupa string
  if (typeof content.text !== 'string' || content.text.trim().length === 0) {
    return { valid: false, reason: 'Konten keluar wajib berupa string teks non-kosong.' };
  }

  return { valid: true };
}

/**
 * ----------------------------------------------------
 * 5. OUTBOUND SEQUENTIAL QUEUE & RATE LIMITER
 * ----------------------------------------------------
 */
class OutboundQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.lastSentTimestamp = 0;
    this.sentCountLastMinute = 0;
    this.minuteWindowStart = Date.now();
    this.MAX_PER_MINUTE = 12; // Maksimal 12 pesan per menit global
    this.MIN_DELAY_BETWEEN_MESSAGES = 4000; // Minimal 4 detik jeda antar pesan normal
    this.MAX_DELAY_BETWEEN_MESSAGES = 7500; // Maksimal 7.5 detik jeda normal
  }

  /**
   * Masukkan pesan ke dalam antrean
   * priority: 'HIGH' (balasan chat pengguna) atau 'NORMAL' (scheduler pengingat)
   */
  enqueue({ sock, jid, content, incomingMsg = null, priority = 'NORMAL', resolve, reject }) {
    const item = { sock, jid, content, incomingMsg, priority, resolve, reject, addedAt: Date.now() };

    if (priority === 'HIGH') {
      // Masukkan di depan antrean normal, tapi setelah antrean prioritas tinggi lainnya
      const firstNormalIdx = this.queue.findIndex((q) => q.priority !== 'HIGH');
      if (firstNormalIdx === -1) {
        this.queue.push(item);
      } else {
        this.queue.splice(firstNormalIdx, 0, item);
      }
    } else {
      this.queue.push(item);
    }

    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();

      try {
        // 0. SECURITY GUARDRAIL: Strict Text-Only Egress Policy
        // Menjamin bot TIDAK PERNAH mengunggah file, gambar, video, dokumen, atau kontak
        const egressValidation = validateEgressPayload(item.content);
        if (!egressValidation.valid) {
          const violationMsg = `🛑 [SECURITY EGRESS BLOCKED] ${egressValidation.reason} Target: ${item.jid}`;
          console.error(violationMsg);
          if (item.reject) item.reject(new Error(egressValidation.reason));
          continue;
        }

        // 1. Cek Rate Limiter Window (1 menit)
        const now = Date.now();
        if (now - this.minuteWindowStart > 60000) {
          this.minuteWindowStart = now;
          this.sentCountLastMinute = 0;
        }

        if (this.sentCountLastMinute >= this.MAX_PER_MINUTE) {
          const waitTime = 60000 - (now - this.minuteWindowStart) + 1000;
          console.log(`⏳ [Rate Limiter] Batas 12 pesan/menit tercapai. Menunggu ${Math.ceil(waitTime / 1000)}s...`);
          await sleep(waitTime);
          this.minuteWindowStart = Date.now();
          this.sentCountLastMinute = 0;
        }

        // 2. Berikan jeda adaptif: HIGH priority (1-2s), NORMAL priority (4-7.5s)
        const elapsedSinceLast = Date.now() - this.lastSentTimestamp;
        const isHigh = item.priority === 'HIGH';
        const minDelay = isHigh ? 1000 : this.MIN_DELAY_BETWEEN_MESSAGES;
        const maxDelay = isHigh ? 2000 : this.MAX_DELAY_BETWEEN_MESSAGES;
        const requiredDelay = Math.floor(minDelay + Math.random() * (maxDelay - minDelay));

        if (elapsedSinceLast < requiredDelay) {
          await sleep(requiredDelay - elapsedSinceLast);
        }

        // 3. Acak teks konten agar hash berbeda
        let finalContent = { ...item.content };
        if (typeof finalContent.text === 'string') {
          const rawLength = finalContent.text.length;
          finalContent.text = randomizeMessageContent(finalContent.text);

          // 4. Lakukan Human Presence Simulation
          const msgKey = item.incomingMsg?.key || null;
          await simulateHumanPresence(item.sock, item.jid, msgKey, rawLength);
        }

        // 5. Siapkan options pengiriman (jangan pernah lampirkan quoted context jika JID @lid untuk mencegah silent drop)
        const sendOptions = {};
        if (item.incomingMsg && !item.jid.endsWith('@lid') && !item.incomingMsg.key?.remoteJid?.endsWith('@lid')) {
          sendOptions.quoted = item.incomingMsg;
        }

        // 6. Kirim pesan ke WhatsApp
        console.log(`📤 [Outbound Queue] Memulai kirim pesan ke ${item.jid} (Panjang: ${finalContent.text?.length || 0} char)...`);
        const result = await item.sock.sendMessage(item.jid, finalContent, sendOptions);
        console.log(`✅ [Outbound Queue] Pesan BERHASIL terkirim ke ${item.jid}! ID: ${result?.key?.id}`);
        
        // Simpan pesan keluar ke memory store untuk menjawab retry request server WA
        if (result?.key?.id) {
          saveMessageToStore(result.key.id, result);
          recordSentMessageId(result.key.id);
        }

        this.lastSentTimestamp = Date.now();
        this.sentCountLastMinute++;

        if (item.resolve) item.resolve(result);
      } catch (err) {
        console.error(`❌ [Outbound Queue] Gagal mengirim pesan ke ${item.jid}:`, err.message);
        if (item.reject) item.reject(err);
      }
    }

    this.isProcessing = false;
  }
}

export const outboundQueue = new OutboundQueue();

/**
 * Helper pengiriman aman berprioritas tinggi untuk interaksi pengguna langsung
 */
export function sendSafeReply(sock, jid, content, incomingMsg = null) {
  return new Promise((resolve, reject) => {
    outboundQueue.enqueue({
      sock,
      jid,
      content,
      incomingMsg,
      priority: 'HIGH',
      resolve,
      reject
    });
  });
}

/**
 * Helper pengiriman berprioritas normal untuk broadcast/scheduler
 */
export function sendSafeScheduled(sock, jid, content) {
  return new Promise((resolve, reject) => {
    outboundQueue.enqueue({
      sock,
      jid,
      content,
      incomingMsg: null,
      priority: 'NORMAL',
      resolve,
      reject
    });
  });
}
