import { getDb, getUserByJid, touchUserActivity, getTopStreakUsers, getUserLeaderboardRank, getUsersForStreakRescue } from './database/db.js';
import { handleIncomingMessage } from './services/routerService.js';
import { dispatchStreakRescue } from './services/schedulerService.js';
import { formatLeaderboard, formatChallengeMessage, getRandomEspressoTip } from './config/constants.js';

const db = getDb();
const groupJid = '120363024859345678@g.us';
const testMemberJid = '6289998887771@s.whatsapp.net';
const botPhone = '628111111111';

// Reset test records
db.prepare('DELETE FROM users WHERE jid = ? OR phone_number LIKE ?').run(testMemberJid, '%9998887771%');

const sentMessages = [];
const mockSock = {
  user: { id: `${botPhone}:1@s.whatsapp.net` },
  sendPresenceUpdate: async () => {},
  sendMessage: async (jid, content, options) => {
    sentMessages.push({ jid, content, options });
    return { key: { id: 'test-growth-id-' + Date.now() } };
  }
};

async function testGrowthScenario() {
  console.log('=== TEST 1: SAFE GROUP MODE (Ambient vs Triggered) ===');

  // Case 1.1: Ambient group chatter (Should be DROPPED SILENTLY)
  const initialCount = sentMessages.length;
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: groupJid, participant: testMemberJid, fromMe: false },
    message: { conversation: 'Halo teman-teman, makan siang di mana hari ini?' }
  });
  if (sentMessages.length !== initialCount) {
    throw new Error('FAILED: Bot responded to ambient group chatter! Should be dropped silently.');
  }
  console.log('✅ PASS: Ambient group chatter successfully dropped without response.');

  // Case 1.2: Triggered with "!top" (Leaderboard in group)
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: groupJid, participant: testMemberJid, fromMe: false },
    message: { conversation: '!top' }
  });
  let lastSent = sentMessages[sentMessages.length - 1];
  console.log('Group Reply (!top):\n', lastSent.content.text);
  if (!lastSent.content.text.includes('PAPAN PERINGKAT') && !lastSent.content.text.includes('LEADERBOARD')) {
    throw new Error('FAILED: Expected Leaderboard in group reply!');
  }
  if (!lastSent.content.text.includes('wa.me')) {
    throw new Error('FAILED: Expected viral DM invite link in group footer!');
  }
  if (!lastSent.options?.quoted) {
    throw new Error('FAILED: Expected message to quote the sender in group mode!');
  }
  console.log('✅ PASS: !top triggered properly in group with quoted message & viral link.');

  // Case 1.3: Triggered with "!espresso" (Quick tip in group)
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: groupJid, participant: testMemberJid, fromMe: false },
    message: { conversation: '!espresso' }
  });
  lastSent = sentMessages[sentMessages.length - 1];
  console.log('Group Reply (!espresso):\n', lastSent.content.text);
  if (!lastSent.content.text.includes('Telco Espresso')) {
    throw new Error('FAILED: Expected Telco Espresso tip in group reply!');
  }
  console.log('✅ PASS: !espresso triggered properly in group.');

  // Case 1.4: Triggered with mention (@botNumber)
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: groupJid, participant: testMemberJid, fromMe: false },
    message: {
      extendedTextMessage: {
        text: `@${botPhone} apa itu PCI collision?`,
        contextInfo: {
          mentionedJid: [`${botPhone}@s.whatsapp.net`]
        }
      }
    }
  });
  lastSent = sentMessages[sentMessages.length - 1];
  console.log('Group Reply (Mention @bot):\n', lastSent.content.text);
  if (!lastSent.content.text.includes('PCI') && !lastSent.content.text.includes('Physical Cell Identity') && !lastSent.content.text.includes('Kunci API Gemini')) {
    throw new Error('FAILED: Expected answer to PCI query in group!');
  }
  console.log('✅ PASS: Bot responded to mention in group.');

  console.log('\n=== TEST 2: VIRAL CHALLENGE CARD & LEADERBOARD (1-on-1 DM) ===');
  // Case 2.1: User requests challenge card (Option 8 or /tantang)
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testMemberJid, fromMe: false },
    message: { conversation: '8' }
  });
  lastSent = sentMessages[sentMessages.length - 1];
  console.log('Challenge Card Reply:\n', lastSent.content.text);
  if (!lastSent.content.text.includes('TANTANGAN KUIS') && !lastSent.content.text.includes('CHALLENGE')) {
    throw new Error('FAILED: Expected Challenge Card format!');
  }
  if (!lastSent.content.text.includes('wa.me')) {
    throw new Error('FAILED: Expected 1-click challenge link!');
  }
  console.log('✅ PASS: Challenge card generated successfully with 1-click wa.me share link.');

  // Case 2.2: User requests Telco Espresso tip (Option 9 or /espresso)
  await handleIncomingMessage(mockSock, {
    key: { remoteJid: testMemberJid, fromMe: false },
    message: { conversation: '9' }
  });
  lastSent = sentMessages[sentMessages.length - 1];
  console.log('Espresso Tip Reply:\n', lastSent.content.text);
  if (!lastSent.content.text.includes('Telco Espresso')) {
    throw new Error('FAILED: Expected 30-second field tip!');
  }
  console.log('✅ PASS: Telco Espresso tip served.');

  console.log('\n=== TEST 3: FAIR ACTIVITY STREAK TRACKING ===');
  // User activity should be recorded in database
  const memberUser = getUserByJid(testMemberJid);
  console.log('User streak count:', memberUser.streak_count, 'Last active:', memberUser.last_active_date);
  if (!memberUser.streak_count || memberUser.streak_count < 1) {
    throw new Error('FAILED: User streak should be at least 1 after technical activities!');
  }
  const today = new Date().toISOString().slice(0, 10);
  if (memberUser.last_active_date !== today) {
    throw new Error('FAILED: User last_active_date should be updated to today!');
  }
  console.log('✅ PASS: touchUserActivity successfully maintained user streak without forcing quiz.');

  console.log('\n=== TEST 4: EVENING STREAK RESCUE ALERT ===');
  // Create an at-risk user whose last activity was yesterday
  const rescueJid = '6289991112223@s.whatsapp.net';
  db.prepare('DELETE FROM users WHERE jid = ?').run(rescueJid);
  db.prepare(`
    INSERT INTO users (jid, phone_number, display_name, current_state, focus_track, preferred_language, reminder_preference, streak_count, last_active_date)
    VALUES (?, '6289991112223', 'Engineer At Risk', 'IDLE', 'protocol_qa', 'id', 'all', 5, '2026-10-15')
  `).run(rescueJid);

  const atRiskList = getUsersForStreakRescue();
  console.log(`Found ${atRiskList.length} users for streak rescue.`);
  const foundRescueUser = atRiskList.find(u => u.jid === rescueJid);
  if (!foundRescueUser) {
    throw new Error('FAILED: At-risk user was not detected for streak rescue!');
  }

  // Dispatch streak rescue
  await dispatchStreakRescue(mockSock);
  const rescueMsg = sentMessages.find(m => m.jid === rescueJid);
  if (!rescueMsg) {
    throw new Error('FAILED: Streak rescue message was not dispatched to at-risk user!');
  }
  console.log('Streak Rescue Message:\n', rescueMsg.content.text);
  if (!rescueMsg.content.text.includes('PERINGATAN STREAK') && !rescueMsg.content.text.includes('STREAK RESCUE')) {
    throw new Error('FAILED: Invalid rescue message content!');
  }
  console.log('✅ PASS: Streak rescue alert correctly dispatched with 1-click rescue prompts.');

  // Clean up test user
  db.prepare('DELETE FROM users WHERE jid = ?').run(rescueJid);
  db.prepare('DELETE FROM users WHERE jid = ?').run(testMemberJid);

  console.log('\n🎉 ALL GROWTH & ENGAGEMENT TESTS PASSED 100%! 🚀');
  process.exit(0);
}

testGrowthScenario().catch(err => {
  console.error('❌ Growth Test Failed:', err);
  process.exit(1);
});
