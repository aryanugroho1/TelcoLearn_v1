/**
 * TelcoLearn Broadcast UI Manager
 * Menyediakan antarmuka web interaktif untuk Admin menyusun, mempratinjau, dan mengirim broadcast.
 */

import { PRESET_TEMPLATES, getBroadcastState, getBroadcastPreview, getTargetUsers } from './broadcastService.js';

export function renderBroadcastHtml({ botConnectedPhone = '628158722770', isConnected = true, secretKey = 'telcolearn-export-key-2026' }) {
  const state = getBroadcastState();
  const presetsJson = JSON.stringify(PRESET_TEMPLATES);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TelcoLearn Admin Broadcast Suite</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #334155;
      flex-wrap: wrap;
      gap: 12px;
    }
    .header-title h1 {
      margin: 0;
      font-size: 22px;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .header-title p {
      margin: 4px 0 0 0;
      font-size: 13px;
      color: #94a3b8;
    }
    .header-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
    }
    .badge-online { background: #15803d; color: #dcfce7; }
    .badge-offline { background: #991b1b; color: #fecaca; }
    .badge-running { background: #0369a1; color: #e0f2fe; animation: pulse 1.5s infinite; }
    .badge-paused { background: #854d0e; color: #fef08a; }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .btn {
      padding: 9px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-primary { background: #0284c7; color: white; }
    .btn-primary:hover { background: #0369a1; }
    .btn-secondary { background: #334155; color: #cbd5e1; }
    .btn-secondary:hover { background: #475569; }
    .btn-warning { background: #d97706; color: white; }
    .btn-danger { background: #dc2626; color: white; }

    .grid-container {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 24px;
    }
    @media (max-width: 900px) {
      .grid-container { grid-template-columns: 1fr; }
    }

    .card {
      background: #1e293b;
      border-radius: 16px;
      border: 1px solid #334155;
      padding: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    }
    .card h2 {
      margin-top: 0;
      font-size: 16px;
      color: #f1f5f9;
      border-bottom: 1px solid #334155;
      padding-bottom: 12px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-group {
      margin-bottom: 16px;
    }
    label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    select, textarea, input {
      width: 100%;
      background: #0f172a;
      border: 1px solid #334155;
      color: #f8fafc;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-family: inherit;
    }
    select:focus, textarea:focus, input:focus {
      outline: none;
      border-color: #38bdf8;
    }
    textarea {
      min-height: 180px;
      resize: vertical;
      line-height: 1.6;
    }

    .safety-banner {
      background: #0b1e33;
      border: 1px solid #0284c7;
      border-radius: 10px;
      padding: 14px;
      margin: 18px 0;
      font-size: 12px;
      color: #bae6fd;
    }
    .safety-banner ul {
      margin: 6px 0 0 0;
      padding-left: 18px;
      color: #93c5fd;
    }

    /* WhatsApp Mobile Chat Mockup */
    .phone-mockup {
      background: #0b141a;
      border-radius: 20px;
      padding: 16px;
      border: 4px solid #334155;
      box-shadow: 0 15px 35px rgba(0,0,0,0.6);
      margin-bottom: 20px;
    }
    .chat-header {
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid #1f2c34;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .chat-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #00a884;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .chat-name {
      font-weight: 600;
      font-size: 14px;
      color: #e9edef;
    }
    .chat-status {
      font-size: 11px;
      color: #8696a0;
    }
    .chat-bubble {
      background: #005c4b;
      color: #e9edef;
      padding: 12px 14px;
      border-radius: 8px 8px 0 8px;
      font-size: 13px;
      line-height: 1.5;
      white-space: pre-wrap;
      word-break: break-word;
      margin-left: 20px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }

    /* Progress Bar */
    .progress-box {
      background: #0f172a;
      border-radius: 10px;
      padding: 16px;
      border: 1px solid #334155;
      margin-top: 16px;
    }
    .progress-track {
      background: #334155;
      border-radius: 9999px;
      height: 12px;
      overflow: hidden;
      margin: 10px 0;
    }
    .progress-fill {
      background: linear-gradient(90deg, #38bdf8, #0284c7);
      height: 100%;
      width: 0%;
      transition: width 0.4s ease;
    }
    .metrics-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- Top Navigation Header -->
  <div class="header-bar">
    <div class="header-title">
      <h1>📡 TelcoLearn Broadcast Suite</h1>
      <p>Kirimkan pengumuman resmi dan edukasi serial aman ke seluruh pengguna WhatsApp.</p>
    </div>
    <div class="header-actions">
      <span class="badge ${isConnected ? 'badge-online' : 'badge-offline'}">
        ${isConnected ? '🟢 WA ONLINE (+' + botConnectedPhone + ')' : '🔴 WA DISCONNECTED'}
      </span>
      <a href="/" class="btn btn-secondary">🏠 QR Gateway</a>
      <a href="/api/export-logs?secret=${secretKey}" target="_blank" class="btn btn-secondary">📊 Database Logs</a>
    </div>
  </div>

  <div class="grid-container">

    <!-- Kolom Kiri: Form Composer Broadcast -->
    <div class="card">
      <h2>📝 Form Pengirim Broadcast</h2>

      <!-- Pilihan Preset -->
      <div class="form-group">
        <label>Pilih Template Pesan:</label>
        <select id="presetSelect" onchange="applyPreset(this.value)">
          <option value="apology_recovery">1. Permohonan Maaf & Update 14 Hari (Default)</option>
          <option value="new_modules">2. Pengumuman Modul / Kurikulum Baru</option>
          <option value="quiz_challenge">3. Tantangan Kuis & Streak Belajar</option>
          <option value="maintenance">4. Pemberitahuan Pemeliharaan Server</option>
          <option value="custom">5. Pesan Kustom Bebas</option>
        </select>
      </div>

      <!-- Target Filter -->
      <div class="form-group">
        <label>Target Penerima:</label>
        <select id="targetFilter" onchange="updateTargetStats()">
          <option value="all">👥 Semua Pengguna (278 Pengguna)</option>
          <option value="active">⚡ Pengguna Aktif (Aktif ≤ 14 Hari Terakhir)</option>
          <option value="dormant">💤 Pengguna Dormant (Tidak Aktif > 14 Hari)</option>
          <option value="track_protocol_qa">📡 Track 4G/5G Protocol QA</option>
          <option value="track_ml_telco">🤖 Track ML & AI Telekomunikasi</option>
          <option value="track_log_telco">📑 Track Radio Log Analytics</option>
          <option value="track_pmp_telco">📊 Track Telecom Project Management</option>
        </select>
      </div>

      <!-- Teks Bahasa Indonesia -->
      <div class="form-group">
        <label>Isi Pesan (Bahasa Indonesia):</label>
        <textarea id="messageId" oninput="updateLivePreview()"></textarea>
        <small style="color: #64748b; font-size: 11px;">Gunakan placeholder <code>{name}</code> untuk nama pengguna, <code>{track}</code> untuk track belajar.</small>
      </div>

      <!-- Teks Bahasa Inggris -->
      <div class="form-group">
        <label>Isi Pesan (English - Untuk User Berbahasa Inggris):</label>
        <textarea id="messageEn" style="min-height: 120px;" oninput="updateLivePreview()"></textarea>
      </div>

      <!-- Proteksi Anti-Ban Info -->
      <div class="safety-banner">
        <strong>🛡️ Perlindungan Otomatis Anti-Ban TelcoLearn Aktif:</strong>
        <ul>
          <li><strong>Serial 1-by-1 FIFO:</strong> Tidak ada lonjakan pengiriman massal sekaligus.</li>
          <li><strong>Jitter Delay:</strong> Jeda dinamis 8 – 14 detik antar pesan.</li>
          <li><strong>Human Typing:</strong> Mengirim status <em>sedang mengetik...</em> 1.2–2.2 detik.</li>
          <li><strong>Batch Pause:</strong> Istirahat 35 detik setiap 10 pengiriman.</li>
          <li><strong>Zero-Width Salt:</strong> Setiap pesan memiliki SHA-256 unik.</li>
        </ul>
      </div>

      <!-- Tombol Aksi -->
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button id="btnStart" onclick="startBroadcast()" class="btn btn-primary" style="flex: 1;">
          🚀 Mulai Kirim Serial Aman
        </button>
        <button id="btnPause" onclick="pauseBroadcast()" class="btn btn-warning" style="display: none;">
          ⏸️ Jeda (Pause)
        </button>
        <button id="btnResume" onclick="resumeBroadcast()" class="btn btn-primary" style="display: none;">
          ▶️ Lanjutkan
        </button>
        <button id="btnReset" onclick="resetBroadcast()" class="btn btn-secondary">
          🔄 Reset Antrean
        </button>
      </div>
    </div>

    <!-- Kolom Kanan: Phone Preview & Live Progress -->
    <div>

      <!-- Live Mobile WhatsApp Simulation -->
      <div class="card" style="margin-bottom: 24px;">
        <h2>📱 Pratinjau Tampilan di Ponsel</h2>
        <div class="phone-mockup">
          <div class="chat-header">
            <div class="chat-avatar">📡</div>
            <div>
              <div class="chat-name">TelcoLearn Bot Official</div>
              <div class="chat-status">Akun Bisnis Resmi &bull; Online</div>
            </div>
          </div>
          <div id="phoneBubble" class="chat-bubble">Memuat pratinjau...</div>
        </div>
      </div>

      <!-- Live Monitoring Card -->
      <div class="card">
        <h2>📊 Monitor Progres Pengiriman</h2>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 13px; color: #cbd5e1;">Status Mesin:</span>
          <span id="statusBadge" class="badge badge-paused">MEMUAT STATUS...</span>
        </div>

        <div class="progress-box">
          <div class="metrics-row">
            <span>Terkirim: <strong id="sentCount" style="color: #38bdf8;">0</strong> / <span id="totalTargets">278</span></span>
            <span id="percentLabel">0%</span>
          </div>
          <div class="progress-track">
            <div id="progressBar" class="progress-fill"></div>
          </div>
          <div class="metrics-row" style="margin-top: 6px;">
            <span>Gagal: <strong id="failedCount" style="color: #f87171;">0</strong></span>
            <span>Estimasi Sisa: <strong id="etaMinutes" style="color: #fcd34d;">~0 Menit</strong></span>
          </div>
        </div>

        <div style="margin-top: 16px; font-size: 12px; color: #94a3b8; border-top: 1px solid #334155; padding-top: 12px;">
          <span>Aktivitas Terakhir: </span>
          <span id="lastSentAt" style="color: #e2e8f0; font-family: monospace;">Belum ada pengiriman</span>
        </div>
      </div>

    </div>

  </div>

  <script>
    const PRESETS = ${presetsJson};
    const SECRET = '${secretKey}';

    function applyPreset(key) {
      if (PRESETS[key]) {
        document.getElementById('messageId').value = PRESETS[key].text_id || '';
        document.getElementById('messageEn').value = PRESETS[key].text_en || '';
        updateLivePreview();
      }
    }

    function updateLivePreview() {
      const raw = document.getElementById('messageId').value || '';
      const preview = raw.replace(/{name}/g, 'Budi Santoso (Engineer)');
      document.getElementById('phoneBubble').innerText = preview || 'Pesan kosong.';
    }

    async function fetchStatus() {
      try {
        const res = await fetch('/api/admin/broadcast?action=status&secret=' + SECRET);
        const data = await res.json();
        const st = data.status || {};
        const total = st.total_targets || data.preview?.total_users_in_target || 278;
        const sent = st.sent_count || 0;
        const failed = st.failed_count || 0;
        const pct = total > 0 ? Math.round((sent / total) * 100) : 0;

        document.getElementById('sentCount').innerText = sent;
        document.getElementById('totalTargets').innerText = total;
        document.getElementById('failedCount').innerText = failed;
        document.getElementById('percentLabel').innerText = pct + '%';
        document.getElementById('progressBar').style.width = pct + '%';
        
        const remaining = total - sent;
        const eta = Math.round((remaining * 11 + Math.floor(remaining / 10) * 35) / 60);
        document.getElementById('etaMinutes').innerText = eta > 0 ? '~' + eta + ' Menit' : 'Selesai';

        const badge = document.getElementById('statusBadge');
        const btnStart = document.getElementById('btnStart');
        const btnPause = document.getElementById('btnPause');
        const btnResume = document.getElementById('btnResume');

        badge.innerText = (st.status || 'IDLE').toUpperCase();

        if (st.status === 'running') {
          badge.className = 'badge badge-running';
          btnStart.style.display = 'none';
          btnPause.style.display = 'inline-flex';
          btnResume.style.display = 'none';
        } else if (st.status === 'paused') {
          badge.className = 'badge badge-paused';
          btnStart.style.display = 'none';
          btnPause.style.display = 'none';
          btnResume.style.display = 'inline-flex';
        } else if (st.status === 'completed') {
          badge.className = 'badge badge-online';
          btnStart.style.display = 'inline-flex';
          btnPause.style.display = 'none';
          btnResume.style.display = 'none';
        } else {
          badge.className = 'badge badge-secondary';
          btnStart.style.display = 'inline-flex';
          btnPause.style.display = 'none';
          btnResume.style.display = 'none';
        }

        if (st.last_sent_at) {
          document.getElementById('lastSentAt').innerText = new Date(st.last_sent_at).toLocaleTimeString();
        }
      } catch (e) {
        console.warn('Gagal fetch status:', e);
      }
    }

    async function startBroadcast() {
      const filter = document.getElementById('targetFilter').value;
      const textId = document.getElementById('messageId').value;
      const textEn = document.getElementById('messageEn').value;
      const preset = document.getElementById('presetSelect').value;

      if (!confirm('Mulai kirim broadcast serial aman ke target? Proses akan berjalan di background selama estimasi ~50-60 menit.')) {
        return;
      }

      const res = await fetch('/api/admin/broadcast?action=start&secret=' + SECRET, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetFilter: filter,
          preset: preset,
          customTextId: textId,
          customTextEn: textEn
        })
      });
      const data = await res.json();
      alert(data.message);
      fetchStatus();
    }

    async function pauseBroadcast() {
      const res = await fetch('/api/admin/broadcast?action=pause&secret=' + SECRET, { method: 'POST' });
      const data = await res.json();
      alert(data.message);
      fetchStatus();
    }

    async function resumeBroadcast() {
      const res = await fetch('/api/admin/broadcast?action=start&secret=' + SECRET, { method: 'POST' });
      const data = await res.json();
      alert(data.message);
      fetchStatus();
    }

    async function resetBroadcast() {
      if (!confirm('Yakin ingin mereset antrean broadcast? Semua riwayat pengiriman campaign ini akan direset.')) {
        return;
      }
      const res = await fetch('/api/admin/broadcast?action=reset&secret=' + SECRET, { method: 'POST' });
      const data = await res.json();
      alert(data.message);
      fetchStatus();
    }

    // Inisialisasi awal
    applyPreset('apology_recovery');
    fetchStatus();
    setInterval(fetchStatus, 3500);
  </script>

</body>
</html>`;
}
