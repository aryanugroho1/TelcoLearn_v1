import { getDb, getUserByJid } from './database/db.js';
import { handleIncomingMessage } from './services/routerService.js';

const db = getDb();
const testJid = '628889998882@s.whatsapp.net';
db.prepare('DELETE FROM users WHERE jid = ?').run(testJid);

const sentMessages = [];
const mockSock = {
  user: { id: '628111111111:1@s.whatsapp.net' },
  sendPresenceUpdate: async () => {},
  sendMessage: async (jid, content) => {
    sentMessages.push({ jid, content });
    return { key: { id: 'test-id-' + Date.now() } };
  }
};

async function testScenario() {
  console.log('--- Step 1: User sends "Hi" ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: 'Hi' }
  });
  let lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 1:\n', lastMsg);

  console.log('\n--- Step 2: User chooses "2" (English) ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: '2' }
  });
  lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 2:\n', lastMsg);
  if (!lastMsg.includes('Select Your Primary Study Track')) {
    throw new Error('Expected English track selection prompt!');
  }

  console.log('\n--- Step 3: User chooses "1 4g/5g protocol QA" ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: '1 4g/5g protocol QA' }
  });
  lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 3:\n', lastMsg);
  if (!lastMsg.includes('Your Study Track is set to')) {
    throw new Error('Expected English track confirmation!');
  }
  if (!lastMsg.includes('Support us:')) {
    throw new Error('Expected English loopback footer!');
  }

  console.log('\n--- Step 4: After track is set, user types "1" (/learn) ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: '1' }
  });
  lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 4:\n', lastMsg);
  if (!lastMsg.includes("Today's Topic") || !lastMsg.includes('Key Concepts')) {
    throw new Error('Expected English module content!');
  }
  if (!lastMsg.includes('Support us:')) {
    throw new Error('Expected English loopback footer in module!');
  }

  console.log('\n--- Step 5: User types "2" (/quiz) ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: '2' }
  });
  lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 5:\n', lastMsg);
  if (!lastMsg.includes('60-Second Quiz Time') || !lastMsg.includes('Packet Forwarding Control Protocol')) {
    throw new Error('Expected English quiz prompt & options!');
  }

  console.log('\n--- Step 6: User answers "B" to the quiz ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: 'B' }
  });
  lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 6:\n', lastMsg);
  if (!lastMsg.includes('Spot On!') || !lastMsg.includes('Technical Explanation:')) {
    throw new Error('Expected English quiz feedback & explanation!');
  }

  console.log('\n--- Step 7: User types "3" (/streak) ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: '3' }
  });
  lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 7:\n', lastMsg);
  if (!lastMsg.includes('STUDY CONSISTENCY & METRICS')) {
    throw new Error('Expected English streak text!');
  }

  console.log('\n--- Step 8: User types "0" (/menu) ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: '0' }
  });
  lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 8:\n', lastMsg);
  if (!lastMsg.includes('Language: *English*')) {
    throw new Error('Expected English main menu!');
  }

  console.log('\n--- Step 9: User switches language in mid-conversation ("pakai bahasa indonesia") ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: 'pakai bahasa indonesia' }
  });
  lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 9:\n', lastMsg);
  if (!lastMsg.includes('Bahasa dialihkan ke Bahasa Indonesia')) {
    throw new Error('Expected Indonesian switch confirmation!');
  }

  console.log('\n--- Step 10: After switching to ID, user types "1" (/belajar) ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: '1' }
  });
  lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 10:\n', lastMsg);
  if (!lastMsg.includes('Topik Hari Ini') || !lastMsg.includes('Konsep Kunci')) {
    throw new Error('Expected Indonesian module content after switch!');
  }

  console.log('\n--- Step 11: User switches back to English ("/lang en") ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: '/lang en' }
  });
  lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 11:\n', lastMsg);
  if (!lastMsg.includes('Language updated to English')) {
    throw new Error('Expected English switch confirmation!');
  }

  console.log('\n🎉 ALL SCENARIO TESTS PASSED SUCCESSFULLY! 🚀');
  process.exit(0);
}

testScenario().catch((e) => {
  console.error('❌ Test Scenario Failed:', e);
  process.exit(1);
});
