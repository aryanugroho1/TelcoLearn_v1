/**
 * TelcoLearn Token Analytics, Dashboarding & Email Reporting Service
 * Dirancang khusus untuk memonitor konsumsi kuota Gemini Free Tier (1.500 RPD)
 * dan memberikan rekomendasi keputusan migrasi ke Paid Tier.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { getDailyTokenMetrics, getWeeklyTokenTrend } from '../database/db.js';

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
export function formatWhatsAppAdminReport(metrics) {
  const isHealthy = metrics.total_requests < 1200;
  const statusIcon = isHealthy ? '🟢' : '🔴';
  
  return `📊 *TELCOLEARN AI USAGE DASHBOARD*
📅 *Tanggal:* ${metrics.date}
━━━━━━━━━━━━━━━━━━━━━━━━

${statusIcon} *Status Free Tier:* ${metrics.verdict_message}

⚡ *Request Hari Ini:* *${metrics.total_requests}* / 1.500 RPD
📊 *Utilisasi Kuota:* *${metrics.quota_used_pct}%*
🛡️ *Sisa Headroom:* *${metrics.remaining_requests}* Request tersisa

🔤 *Konsumsi Token:*
• Prompt (Input) : ${Number(metrics.total_prompt_tokens).toLocaleString()}
• Answer (Output): ${Number(metrics.total_output_tokens).toLocaleString()}
• *Total Token*   : *${Number(metrics.total_tokens).toLocaleString()}*

👥 *Insinyur Aktif:* *${metrics.active_users} Orang*
⏱️ *Rata-rata Latensi:* ${metrics.avg_latency_ms} ms

💰 *Estimasi Biaya Jika Paid:*
• USD: $${metrics.estimated_cost_usd}
• IDR: *Rp ${Number(metrics.estimated_cost_idr).toLocaleString('id-ID')}*

💡 *Keputusan:* ${metrics.verdict === 'STAY_FREE_TIER' ? 'Tetap di Free Tier Google (Biaya Rp 0).' : 'Pertimbangkan pasang billing kartu kredit di GCP.'}`;
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
