import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('coolify_downloaded.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables in Coolify DB:', tables.map(t => t.name));

const logCount = db.prepare('SELECT COUNT(*) as cnt FROM llm_conversation_logs').get();
console.log('Total conversation logs in Coolify:', logCount.cnt);

const userCount = db.prepare('SELECT COUNT(*) as cnt FROM users').get();
console.log('Total users in Coolify:', userCount.cnt);

console.log('\n=== USERS IN COOLIFY ===');
const users = db.prepare('SELECT id, phone_number, display_name, focus_track, current_state, last_active_date FROM users').all();
console.table(users);

console.log('\n=== ALL CONVERSATION LOGS IN COOLIFY ===');
const logs = db.prepare(`
  SELECT l.id, l.user_id, u.display_name, u.phone_number, l.incoming_query, l.created_at
  FROM llm_conversation_logs l
  LEFT JOIN users u ON l.user_id = u.id
  ORDER BY l.id ASC
`).all();

console.log('Total logs retrieved:', logs.length);
logs.forEach(l => {
  const isBroadcast = l.incoming_query.includes('[TelcoLearn Micro-Learning]');
  const prefix = isBroadcast ? '[BROADCAST]' : '[USER QUERY]';
  console.log(`[ID ${l.id}] ${prefix} [${l.display_name || 'N/A'} - ${l.phone_number || 'N/A'}] at ${l.created_at}:`);
  console.log(`   ${l.incoming_query.trim().replace(/\r?\n/g, ' ')}`);
});
