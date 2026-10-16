import { getDb, getUserByJid } from './database/db.js';
import { handleIncomingMessage } from './services/routerService.js';

const db = getDb();
const testJid = '628887776665@s.whatsapp.net';
db.prepare('DELETE FROM users WHERE jid = ?').run(testJid);

const sentMessages = [];
const mockSock = {
  user: { id: '628111111111:1@s.whatsapp.net' },
  sendPresenceUpdate: async () => {},
  sendMessage: async (jid, content) => {
    sentMessages.push({ jid, content });
    return { key: { id: 'test-pmp-' + Date.now() } };
  }
};

async function testPmpScenario() {
  console.log('--- Step 1: User sends "Hello" ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: 'Hello' }
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
  if (!lastMsg.includes('Telecom Project Management (PMP)')) {
    throw new Error('Expected Track 5: Telecom Project Management (PMP) in track menu!');
  }

  console.log('\n--- Step 3: User chooses "5" (Telecom Project Management PMP) ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: '5' }
  });
  lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 3:\n', lastMsg);
  if (!lastMsg.includes('Telecom Project Management (PMP)')) {
    throw new Error('Expected PMP track confirmation!');
  }

  const user = getUserByJid(testJid);
  if (user.focus_track !== 'telco_pmp') {
    throw new Error(`Expected focus_track to be 'telco_pmp', got '${user.focus_track}'`);
  }

  console.log('\n--- Step 4: User requests "/learn" (Option 1) ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: '1' }
  });
  lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 4:\n', lastMsg);
  if (!lastMsg.includes('Telecom Project Management (PMP)') || !lastMsg.includes('Project Charter')) {
    throw new Error('Expected PMP Module (MOD-PMP-01) content!');
  }

  console.log('\n--- Step 5: User requests "/quiz" (Option 2) ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: '2' }
  });
  lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 5:\n', lastMsg);
  if (!lastMsg.includes('Stakeholder Engagement Plan') && !lastMsg.includes('EMF')) {
    throw new Error('Expected PMP Quiz content for MOD-PMP-01!');
  }

  console.log('\n--- Step 6: User answers "B" to PMP quiz ---');
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testJid, fromMe: false },
    message: { conversation: 'B' }
  });
  lastMsg = sentMessages[sentMessages.length - 1].content.text;
  console.log('Bot Reply 6:\n', lastMsg);
  if (!lastMsg.includes('Spot On!') || !lastMsg.includes('Stakeholder Engagement')) {
    throw new Error('Expected PMP quiz correct answer feedback & explanation!');
  }

  console.log('\n🎉 ALL PMP SCENARIO TESTS PASSED SUCCESSFULLY! 🚀');
  process.exit(0);
}

testPmpScenario().catch((err) => {
  console.error('❌ Test PMP Scenario Failed:', err);
  process.exit(1);
});
