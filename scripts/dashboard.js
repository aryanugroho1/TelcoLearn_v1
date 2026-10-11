/**
 * TelcoLearn Admin Dashboard & Report CLI Runner
 * Jalankan: node scripts/dashboard.js
 * Atau dengan kirim email: node scripts/dashboard.js --email
 */

import 'dotenv/config';
import { getDailyTokenMetrics, getWeeklyTokenTrend } from '../database/db.js';
import { formatWhatsAppAdminReport, sendDailyEmailReport } from '../services/reportingService.js';

async function runCliDashboard() {
  console.log('\n========================================================');
  console.log('🚀 TELCOLEARN TOKEN & GEMINI QUOTA CLI DASHBOARD');
  console.log('========================================================\n');

  const metrics = getDailyTokenMetrics();
  const weekly = getWeeklyTokenTrend();

  console.log(formatWhatsAppAdminReport(metrics));

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📈 TREN AKTIVITAS 7 HARI TERAKHIR:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (weekly.length === 0) {
    console.log('Belum ada data riwayat aktivitas.');
  } else {
    weekly.forEach(w => {
      console.log(`• ${w.log_date}: ${w.requests} req | ${Number(w.tokens).toLocaleString()} tokens | ${w.users} users`);
    });
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Trigger report generation & email
  const shouldSendEmail = process.argv.includes('--email') || process.argv.includes('-e');
  const result = await sendDailyEmailReport();

  if (result.sentViaEmail) {
    console.log(`📧 Laporan telah sukses terkirim ke email: ${process.env.ADMIN_EMAIL || 'arya.nugroho.works1@gmail.com'}`);
  } else {
    console.log(`📄 Salinan berkas dashboard HTML berhasil dibuat di:`);
    console.log(`   👉 ${result.localFile}`);
    console.log(`💡 Anda dapat langsung klik/buka berkas HTML di atas di browser untuk melihat visual dashboard.`);
  }

  console.log('\n========================================================\n');
}

runCliDashboard().catch(err => {
  console.error('❌ Error running dashboard CLI:', err);
});
