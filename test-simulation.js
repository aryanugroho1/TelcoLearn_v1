import 'dotenv/config';
import { handleIncomingMessage } from './services/routerService.js';
import { createUser, getUserByJid } from './database/db.js';

async function testSimulationRouting() {
  console.log('🧪 Menguji Router Service untuk Perintah /simulasi & Trigger Gambar...');

  const testJid = '6287771234567@s.whatsapp.net';
  let user = getUserByJid(testJid);
  if (!user) {
    user = createUser({
      jid: testJid,
      phone_number: '6287771234567',
      display_name: 'Simulation Tester',
      focus_track: 'drive_test',
      reminder_preference: 'all'
    });
  }

  const sentMessages = [];
  const mockSock = {
    user: { id: '628158722770:0@s.whatsapp.net' },
    authState: { creds: { me: { id: '628158722770:0@s.whatsapp.net', lid: '12345@lid' } } },
    sendPresenceUpdate: async () => {},
    sendMessage: async (jid, content) => {
      sentMessages.push({ jid, content });
      return { key: { id: `mock-${Date.now()}` } };
    }
  };

  // 1. Test Command /simulasi
  console.log('\n▶️ [Test 1] Mengirim: /simulasi RSRP vs Jarak');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false, id: 'test-sim-1' },
    message: { conversation: '/simulasi RSRP vs Jarak' }
  });

  const imgMsg = sentMessages.find(m => m.content.image);
  if (imgMsg && Buffer.isBuffer(imgMsg.content.image) && imgMsg.content.image.length > 1000) {
    console.log(`✅ [Pass] Gambar simulasi berhasil dikirim! Ukuran buffer: ${imgMsg.content.image.length} bytes.`);
    console.log(`Caption: ${imgMsg.content.caption.slice(0, 120)}...`);
  } else {
    throw new Error('Gagal mengirim gambar simulasi pada /simulasi');
  }

  // 2. Test Trigger Natural: "buatkan gambarnya dong"
  sentMessages.length = 0;
  console.log('\n▶️ [Test 2] Mengirim trigger natural: "bisa tolong buatkan gambarnya dong?"');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false, id: 'test-sim-2' },
    message: { conversation: 'bisa tolong buatkan gambarnya dong?' }
  });

  const naturalImgMsg = sentMessages.find(m => m.content.image);
  if (naturalImgMsg && Buffer.isBuffer(naturalImgMsg.content.image) && naturalImgMsg.content.image.length > 1000) {
    console.log(`✅ [Pass] Trigger natural berhasil mengirim gambar! Ukuran buffer: ${naturalImgMsg.content.image.length} bytes.`);
    console.log(`Caption: ${naturalImgMsg.content.caption.slice(0, 120)}...`);
  } else {
    throw new Error('Gagal mengirim gambar simulasi pada trigger natural');
  }

  console.log('\n🎉 SEMUA PENGUJIAN SIMULASI BERHASIL 100%!');
}

testSimulationRouting().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
