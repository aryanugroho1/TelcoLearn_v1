import fs from 'fs';

const COOLIFY_URL = 'http://100.122.15.96:3005/api/export-logs?secret=telcolearn-export-key-2026';
const COOLIFY_DB_URL = 'http://100.122.15.96:3005/api/download-db?secret=telcolearn-export-key-2026';

async function fetchCoolifyData() {
  console.log(`Connecting to Coolify TelcoLearn Engine at ${COOLIFY_URL}...`);
  try {
    const res = await fetch(COOLIFY_URL);
    const contentType = res.headers.get('content-type') || '';
    
    if (!contentType.includes('application/json')) {
      console.log('⚠️ Server Coolify belum di-redeploy (masih mengembalikan halaman Web Gateway HTML lama).');
      console.log('👉 Silakan klik tombol "Redeploy" pada dashboard Coolify.');
      return false;
    }

    const data = await res.json();
    console.log('🎉 BERHASIL MENGAMBIL DATA DARI COOLIFY!');
    console.log('Stats:', data.stats);

    // Simpan file hasil download
    fs.writeFileSync('coolify_extracted_data.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log('📁 Data tersimpan di coolify_extracted_data.json');
    return true;
  } catch (err) {
    console.error('❌ Gagal menghubungi server Coolify:', err.message);
    return false;
  }
}

fetchCoolifyData();
