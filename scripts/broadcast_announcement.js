/**
 * TelcoLearn CLI Tool: One-Time Serial Broadcast Runner
 * Usage:
 *   node scripts/broadcast_announcement.js --preview
 *   node scripts/broadcast_announcement.js --start
 *   node scripts/broadcast_announcement.js --status
 *   node scripts/broadcast_announcement.js --pause
 */

import fs from 'fs';

const COOLIFY_URL = process.env.COOLIFY_URL || 'http://100.122.15.96:3005';
const SECRET_KEY = process.env.ADMIN_EXPORT_SECRET || 'telcolearn-export-key-2026';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function apiRequest(endpoint, method = 'GET') {
  const url = `${COOLIFY_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}secret=${SECRET_KEY}`;
  const res = await fetch(url, { method });
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    if (text.includes('<!DOCTYPE')) {
      throw new Error(`Server Coolify mengembalikan halaman Web Gateway HTML. Harap klik 'Redeploy' pada dashboard Coolify agar fitur broadcast aktif.`);
    }
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 100)}`);
  }
  return res.json();
}

async function main() {
  const args = process.argv.slice(2);
  const isStart = args.includes('--start') || args.includes('-s');
  const isStatus = args.includes('--status');
  const isPause = args.includes('--pause');
  const isPreview = args.includes('--preview') || (!isStart && !isStatus && !isPause);

  console.log(`\n========================================================`);
  console.log(`📡 TELCOLEARN SERIAL BROADCAST CONTROLLER`);
  console.log(`Target Server: ${COOLIFY_URL}`);
  console.log(`========================================================\n`);

  try {
    if (isPause) {
      console.log('⏸️ Mengirim perintah Jeda (Pause) ke server Coolify...');
      const res = await apiRequest('/api/admin/broadcast?action=pause', 'POST');
      console.log('Hasil:', res.message);
      return;
    }

    if (isStatus) {
      console.log('📊 Memeriksa status broadcast di server Coolify...');
      const data = await apiRequest('/api/admin/broadcast?action=status', 'GET');
      const st = data.status;
      console.log(`Status Saat Ini: ${st.status.toUpperCase()}`);
      console.log(`Terkirim: ${st.sent_count} / ${st.total_targets || data.preview.total_users_in_db}`);
      console.log(`Gagal: ${st.failed_count}`);
      console.log(`Dimulai: ${st.started_at || '-'}`);
      console.log(`Terakhir Terkirim: ${st.last_sent_at || '-'}`);
      if (st.last_error) console.log(`Catatan Error: ${st.last_error}`);
      return;
    }

    if (isPreview) {
      console.log('🔍 Mengambil data target & pratinjau pesan...');
      const preview = await apiRequest('/api/admin/broadcast?action=preview', 'GET');
      console.log(`Total Pengguna di Database: ${preview.total_users_in_db} Users`);
      console.log(`Sudah Terkirim Sebelumnya : ${preview.already_sent} Users`);
      console.log(`Akan Dikirimkan Sekarang  : ${preview.pending_to_send} Users`);
      console.log(`Estimasi Waktu Selesai    : ~${preview.estimated_duration_minutes} Menit (Serial Jitter Pacing)`);
      console.log(`\n--- [CONTOH PESAN INDONESIA] ---`);
      console.log(preview.sample_message_id);
      console.log(`\n---------------------------------`);
      console.log(`\n💡 Untuk memulai pengiriman serial, jalankan:`);
      console.log(`   node scripts/broadcast_announcement.js --start\n`);
      return;
    }

    if (isStart) {
      console.log('🚀 Memulai broadcast serial di server Coolify...');
      const startRes = await apiRequest('/api/admin/broadcast?action=start', 'POST');
      console.log(`Respon Server:`, startRes.message);
      console.log('\n⏳ Memantau progres pengiriman secara langsung (Ctrl+C untuk keluar dari monitor tanpa menghentikan broadcast)...\n');

      let lastSent = -1;
      while (true) {
        await sleep(5000);
        const data = await apiRequest('/api/admin/broadcast?action=status', 'GET');
        const st = data.status;
        const total = st.total_targets || data.preview.total_users_in_db || 278;

        if (st.sent_count !== lastSent) {
          const pct = Math.round((st.sent_count / total) * 100);
          console.log(`[${new Date().toLocaleTimeString()}] Progress: ${st.sent_count}/${total} (${pct}%) | Status: ${st.status.toUpperCase()}`);
          lastSent = st.sent_count;
        }

        if (st.status === 'completed') {
          console.log('\n🎉 SELURUH BROADCAST TELAH SELESAI DENGAN SUKSES! 🚀');
          console.log(`Total Berhasil: ${st.sent_count}, Gagal: ${st.failed_count}`);
          break;
        }

        if (st.status === 'paused' || st.status === 'failed') {
          console.log(`\n⚠️ Broadcast ${st.status.toUpperCase()}! Alasan: ${st.last_error || 'Dihentikan'}`);
          break;
        }
      }
    }
  } catch (err) {
    console.error('❌ Gagal mengeksekusi perintah broadcast:', err.message);
    if (err.message.includes('404')) {
      console.log('👉 Server Coolify belum memiliki endpoint broadcast. Harap lakukan deploy terlebih dahulu.');
    }
  }
}

main();
