/**
 * TelcoLearn Token Analytics, Dashboarding & Email Reporting Service
 * Dirancang khusus untuk memonitor konsumsi kuota Gemini Free Tier (1.500 RPD)
 * dan memberikan rekomendasi keputusan migrasi ke Paid Tier.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import * as db from '../database/db.js';

const getDailyTokenMetrics = db.getDailyTokenMetrics || (() => null);
const getWeeklyTokenTrend = db.getWeeklyTokenTrend || (() => []);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPORTS_DIR = path.join(__dirname, '..', 'reports');

if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * Menghasilkan markup HTML visual Dashboard untuk Email & Browser
 */
export function generateHtmlReport(metrics, weeklyTrend) {
  const isHealthy = metrics.total_requests < 1200;
  const isWarning = metrics.total_requests >= 1200 && metrics.total_requests < 1500;
  const statusColor = isHealthy ? '#10b981' : isWarning ? '#f59e0b' : '#ef4444';
  const statusBadge = isHealthy ? 'STAY ON FREE TIER (AMAN)' : isWarning ? 'PERINGATAN (>80% KUOTA)' : 'ACTION: MOVE TO PAID TIER';

  const weeklyRows = weeklyTrend.map(row => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 10px 12px; font-weight: 500; color: #111827;">${row.log_date}</td>
      <td style="padding: 10px 12px; text-align: center; color: #374151;">${row.requests} / 1.500</td>
      <td style="padding: 10px 12px; text-align: right; color: #374151;">${Number(row.tokens).toLocaleString()}</td>
      <td style="padding: 10px 12px; text-align: center; color: #374151;">${row.users} org</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>TelcoLearn Token & Gemini API Usage Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px; color: #1f2937; }
    .card { background: #ffffff; border-radius: 12px; max-width: 680px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #e5e7eb; }
    .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 28px; color: #ffffff; }
    .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 14px; opacity: 0.9; }
    .content { padding: 24px; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 700; color: #ffffff; background-color: ${statusColor}; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
    .stat-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; text-align: center; }
    .stat-label { font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600; margin-bottom: 6px; }
    .stat-val { font-size: 24px; font-weight: 800; color: #111827; }
    .progress-bar-bg { background: #e5e7eb; height: 12px; border-radius: 6px; overflow: hidden; margin: 12px 0 6px 0; }
    .progress-bar-fill { background: ${statusColor}; height: 100%; width: ${Math.min(100, metrics.quota_used_pct)}%; }
    .verdict-box { background: #f0fdf4; border: 1px solid ${statusColor}; border-radius: 10px; padding: 16px; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    th { background: #f9fafb; padding: 10px 12px; text-align: left; font-weight: 600; color: #4b5563; border-bottom: 2px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 16px 24px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>📊 TelcoLearn AI Token & Quota Dashboard</h1>
      <p>Laporan Penggunaan Gemini API • Periode: ${metrics.date}</p>
    </div>

    <div class="content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <span style="font-size: 14px; font-weight: 600; color: #374151;">Status Free Tier Hari Ini:</span>
        <span class="badge">${statusBadge}</span>
      </div>

      <!-- Kuota Request Bar -->
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600;">
          <span>Request Terpakai: ${metrics.total_requests.toLocaleString()}</span>
          <span>Batas Maksimal: ${metrics.free_tier_limit.toLocaleString()} RPD</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280;">
          <span>${metrics.quota_used_pct}% Terpakai</span>
          <span>Sisa Headroom: ${metrics.remaining_requests.toLocaleString()} Request</span>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="grid">
        <div class="stat-box">
          <div class="stat-label">Total Token Hari Ini</div>
          <div class="stat-val">${Number(metrics.total_tokens).toLocaleString()}</div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">In: ${Number(metrics.total_prompt_tokens).toLocaleString()} | Out: ${Number(metrics.total_output_tokens).toLocaleString()}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Insinyur Aktif (DAU)</div>
          <div class="stat-val">${metrics.active_users}</div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Rata-rata: ${(metrics.active_users > 0 ? (metrics.total_requests / metrics.active_users).toFixed(1) : 0)} tanya/user</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Rata-rata Latensi AI</div>
          <div class="stat-val">${metrics.avg_latency_ms} ms</div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Gemini 3.8 Flash (Thinking 1K)</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Estimasi Biaya Jika Paid</div>
          <div class="stat-val">Rp ${Number(metrics.estimated_cost_idr).toLocaleString('id-ID')}</div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">$${metrics.estimated_cost_usd} USD</div>
        </div>
      </div>

      <!-- Verdict Box -->
      <div class="verdict-box">
        <h3 style="margin: 0 0 6px 0; font-size: 15px; color: #166534; font-weight: 700;">💡 Rekomendasi Keputusan (Decision Guidance):</h3>
        <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #15803d;">
          ${metrics.verdict_message}
        </p>
      </div>

      <!-- Historical Table -->
      <h3 style="font-size: 15px; margin: 24px 0 8px 0; font-weight: 700; color: #111827;">📈 Riwayat 7 Hari Terakhir:</h3>
      <table>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th style="text-align: center;">Requests</th>
            <th style="text-align: right;">Total Token</th>
            <th style="text-align: center;">Users</th>
          </tr>
        </thead>
        <tbody>
          ${weeklyRows.length > 0 ? weeklyRows : '<tr><td colspan="4" style="text-align: center; padding: 16px; color: #9ca3af;">Belum ada riwayat aktivitas</td></tr>'}
        </tbody>
      </table>
    </div>

    <div class="footer">
      Laporan otomatis ini dikirimkan khusus untuk Administrator TelcoLearn (${metrics.date})<br>
      Engine: TelcoLearn Native Baileys Gateway & Gemini 3.8 Flash
    </div>
  </div>
</body>
</html>`;
}

/**
 * Format teks ringkas untuk respon admin via WhatsApp
 */
export function formatWhatsAppAdminReport(metrics, cacheStats = null) {
  const isHealthy = metrics.total_requests < 1200;
  const statusIcon = isHealthy ? '🟢' : '🔴';
  const db = metrics.db_stats || {};
  const cacheLine = cacheStats 
    ? `• Cache Response Dinamis     : *${cacheStats.totalEntries} tersimpan (${cacheStats.totalHits} hit / hemat ${Number(cacheStats.savedTokens).toLocaleString()} token)*\n  ↳ _Driver: ${cacheStats.driver}_\n`
    : '';
  
  return `📊 *TELCOLEARN ADMIN & DATABASE DASHBOARD*
📅 *Tanggal:* ${metrics.date}
━━━━━━━━━━━━━━━━━━━━━━━━

📦 *STATUS DATA TERSETOR KE DATABASE:*
• Chat Baru Ter-setor Hari Ini : *${db.new_conversations_today || metrics.total_requests} entri*
• Total Riwayat Chat di DB     : *${db.total_conversations_all_time || metrics.total_requests} entri*
• Pengguna Baru Hari Ini        : *${db.new_users_today || 0} user*
• Total Pengguna Terdaftar     : *${db.total_users || 0} user*
• Total Modul Materi Aktif     : *${db.total_modules || 0} modul*
• Total Soal Kuis di DB        : *${db.total_quizzes || 0} soal*
• Total Catatan Teknis User    : *${db.total_notes || 0} catatan*
• Ensiklopedia Knowledge Base   : *${db.total_kb || 0} topik*
${cacheLine}• Masukan Pengguna (/masukan)   : *${db.total_feedbacks || 0} feedback* (${db.pending_feedbacks || 0} pending)

━━━━━━━━━━━━━━━━━━━━━━━━
${statusIcon} *Status Kuota AI Gemini:* ${metrics.verdict_message}

⚡ *Request Hari Ini:* *${metrics.total_requests}* / 1.500 RPD
📊 *Utilisasi Kuota:* *${metrics.quota_used_pct}%* (${metrics.remaining_requests} request tersisa)

🔤 *Konsumsi Token:*
• Prompt (Input) : ${Number(metrics.total_prompt_tokens).toLocaleString()}
• Answer (Output): ${Number(metrics.total_output_tokens).toLocaleString()}
• *Total Token*   : *${Number(metrics.total_tokens).toLocaleString()}*

👥 *Insinyur Aktif:* *${metrics.active_users} Orang* | ⏱️ Latensi: ${metrics.avg_latency_ms} ms

💰 *Estimasi Biaya:* Rp ${Number(metrics.estimated_cost_idr).toLocaleString('id-ID')} ($${metrics.estimated_cost_usd})
💡 *Rekomendasi:* ${metrics.verdict === 'STAY_FREE_TIER' ? 'Tetap gunakan Free Tier Google (Biaya Rp 0).' : 'Pertimbangkan aktivasi billing di GCP.'}
📬 _Ketik */admin feedback* atau */masukan_list* untuk membaca daftar masukan pengguna._`;
}

/**
 * Mengirimkan Laporan Email Harian ke arya.nugroho.works1@gmail.com
 */
export async function sendDailyEmailReport(recipientEmail = null) {
  const targetEmail = recipientEmail || process.env.ADMIN_EMAIL || 'arya.nugroho.works1@gmail.com';
  const metrics = getDailyTokenMetrics();
  const weeklyTrend = getWeeklyTokenTrend();
  const htmlContent = generateHtmlReport(metrics, weeklyTrend);

  // 1. Simpan salinan HTML lokal ke folder reports/
  const latestHtmlPath = path.join(REPORTS_DIR, 'token_dashboard_latest.html');
  const datedHtmlPath = path.join(REPORTS_DIR, `token_report_${metrics.date}.html`);
  fs.writeFileSync(latestHtmlPath, htmlContent, 'utf8');
  fs.writeFileSync(datedHtmlPath, htmlContent, 'utf8');

  console.log(`📄 [Report Service] File HTML dashboard tersimpan di:\n   👉 ${latestHtmlPath}`);

  // 2. Cek apakah konfigurasi SMTP tersedia
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';

  if (!smtpUser || !smtpPass) {
    console.log(`ℹ️ [Email Dispatch] SMTP_USER atau SMTP_PASS belum disetel di .env.`);
    console.log(`ℹ️ Laporan visual berhasil digenerate di berkas lokal dan siap dibuka di browser.`);
    return {
      success: true,
      sentViaEmail: false,
      reason: 'SMTP_CREDENTIALS_MISSING',
      localFile: latestHtmlPath,
      metrics
    };
  }

  // 3. Kirim via Nodemailer
  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const mailOptions = {
      from: `"TelcoLearn AI Monitor" <${smtpUser}>`,
      to: targetEmail,
      subject: `📊 [TelcoLearn Alert] Laporan Kuota & Token Gemini (${metrics.date}) - Status: ${metrics.verdict === 'STAY_FREE_TIER' ? 'AMAN' : 'PERHATIAN'}`,
      text: formatWhatsAppAdminReport(metrics),
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Email Dispatch] Laporan BERHASIL dikirim ke ${targetEmail}! MessageId: ${info.messageId}`);
    return {
      success: true,
      sentViaEmail: true,
      messageId: info.messageId,
      localFile: latestHtmlPath,
      metrics
    };
  } catch (err) {
    console.error(`❌ [Email Dispatch Error] Gagal mengirim email ke ${targetEmail}:`, err.message);
    return {
      success: false,
      sentViaEmail: false,
      error: err.message,
      localFile: latestHtmlPath,
      metrics
    };
  }
}

/**
 * Mengirim notifikasi darurat / alarm ke Admin (Email & Webhook)
 * Dipicu ketika sesi 401 Unauthorized atau kegagalan fatal terjadi
 */
export async function sendAdminCriticalAlert({ title, reason, actionUrl = null }) {
  console.log(`🚨 [Admin Alert] Memproses alarm darurat: ${title}...`);
  const targetEmail = process.env.ADMIN_EMAIL || 'arya.nugroho.works1@gmail.com';
  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  const portalUrl = (process.env.WEB_PORTAL_URL || process.env.PUBLIC_URL || process.env.COOLIFY_URL || 'http://100.122.15.96:3005').replace(/\/$/, '');
  const finalActionUrl = actionUrl || `${portalUrl}/reset`;

  // 1. Kirim via Email SMTP jika kredensial tersedia
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
        auth: { user: smtpUser, pass: smtpPass }
      });

      await transporter.sendMail({
        from: `"TelcoLearn System Watchdog" <${smtpUser}>`,
        to: targetEmail,
        subject: `🚨 [ALARM TELCOLEARN] ${title}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; max-width: 620px; margin: 0 auto; border: 1px solid #334155;">
            <div style="border-bottom: 2px solid #e11d48; padding-bottom: 12px; margin-bottom: 16px;">
              <h2 style="color: #f43f5e; margin: 0; font-size: 22px;">🚨 TelcoLearn WhatsApp Gateway Alert</h2>
              <span style="font-size: 12px; color: #94a3b8;">Watchdog Monitor Otomatis &bull; Server Coolify</span>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #94a3b8; width: 130px;">Waktu:</td><td style="padding: 6px 0; color: #f8fafc; font-weight: bold;">${timestamp} WIB</td></tr>
              <tr><td style="padding: 6px 0; color: #94a3b8;">Insiden:</td><td style="padding: 6px 0; color: #fda4af; font-weight: bold;">${title}</td></tr>
              <tr><td style="padding: 6px 0; color: #94a3b8;">Detail:</td><td style="padding: 6px 0; color: #cbd5e1;">${reason}</td></tr>
            </table>

            <!-- Kartu Akses QR Online Langsung -->
            <div style="background: #1e293b; padding: 20px; border-radius: 10px; border: 1px solid #38bdf8; text-align: center; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #38bdf8; font-size: 17px;">📱 Akses Scan QR Code Online</h3>
              <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6; margin: 8px 0 16px 0;">
                Klik tombol di bawah untuk langsung membuka halaman scan QR Code WhatsApp di web browser ponsel atau laptop Anda:
              </p>

              <div style="margin: 16px 0;">
                <a href="${portalUrl}" style="background: #0284c7; color: #ffffff; padding: 13px 26px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.5);">
                  📲 Buka Halaman Scan QR Code Online
                </a>
              </div>

              <div style="margin-top: 14px; font-size: 12px; color: #94a3b8;">
                Tautan Langsung: <a href="${portalUrl}" style="color: #38bdf8; word-break: break-all;">${portalUrl}</a><br>
                Akses File Gambar QR: <a href="${portalUrl}/qr.png" style="color: #38bdf8;">${portalUrl}/qr.png</a>
              </div>
            </div>

            <!-- Tombol Aksi Cepat Admin -->
            <div style="margin-bottom: 20px;">
              <p style="font-size: 12px; color: #94a3b8; margin-bottom: 8px; font-weight: bold;">Aksi Kontrol Server Cepat:</p>
              <div style="display: flex; gap: 8px;">
                <a href="${portalUrl}/reconnect" style="background: #334155; color: #e2e8f0; padding: 8px 14px; text-decoration: none; border-radius: 6px; font-size: 12px; display: inline-block; margin-right: 6px;">
                  🔄 Coba Rekoneksi Cepat
                </a>
                <a href="${finalActionUrl}" style="background: #881337; color: #fecdd3; padding: 8px 14px; text-decoration: none; border-radius: 6px; font-size: 12px; display: inline-block; margin-right: 6px;">
                  ⚡ Hapus Sesi & Buat QR Baru
                </a>
                <a href="${portalUrl}/broadcast" style="background: #0369a1; color: #e0f2fe; padding: 8px 14px; text-decoration: none; border-radius: 6px; font-size: 12px; display: inline-block;">
                  📢 Menu Broadcast Admin
                </a>
              </div>
            </div>

            <p style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 12px;">
              Notifikasi darurat ini dikirimkan otomatis oleh TelcoLearn Watchdog Monitor ke admin ${targetEmail}.
            </p>
          </div>
        `
      });
      console.log(`✅ [Admin Alert] Email peringatan darurat berhasil dikirim ke ${targetEmail}`);
    } catch (mailErr) {
      console.warn(`⚠️ [Admin Alert] Gagal mengirim email alert:`, mailErr.message);
    }
  }

  // 2. Kirim via Webhook (Discord / Telegram) jika URL terkonfigurasi
  const webhookUrl = process.env.ALERT_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🚨 **[TELCOLEARN ALARM]** ${title}\n📅 Waktu: ${timestamp} WIB\n⚠️ Penyebab: ${reason}\n👉 Tindakan: [Buka Portal & Scan QR Baru](${actionUrl})`
        })
      });
      console.log(`✅ [Admin Alert] Notifikasi webhook darurat berhasil dikirim.`);
    } catch (whErr) {
      console.warn(`⚠️ [Admin Alert] Gagal mengirim webhook alert:`, whErr.message);
    }
  }
}

