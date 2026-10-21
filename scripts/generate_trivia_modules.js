/**
 * TelcoLearn Trivia Generator from Q&A Database
 * Usage:
 *   node scripts/generate_trivia_modules.js --preview
 *   node scripts/generate_trivia_modules.js --seed
 */

import { getDb, formatQuizAsTrivia, syncTriviaModulesFromQuizzes } from '../database/db.js';

const isSeedMode = process.argv.includes('--seed');
const isPreviewMode = process.argv.includes('--preview') || !isSeedMode;

const db = getDb();
const quizzes = db.prepare('SELECT * FROM quizzes WHERE is_active = 1 ORDER BY id ASC').all();

console.log(`📡 [Trivia Generator] Found ${quizzes.length} active quiz questions in database.`);

if (isPreviewMode && !isSeedMode) {
  console.log('\n--- Previewing First 3 Generated Trivia Cards ---');
  for (let i = 0; i < Math.min(3, quizzes.length); i++) {
    const q = quizzes[i];
    console.log(`\n================== TRIVIA #${i + 1} (${q.category.toUpperCase()}) ==================`);
    console.log(formatQuizAsTrivia(q, 'id'));
    console.log('\n[English Version]:');
    console.log(formatQuizAsTrivia(q, 'en'));
  }
  console.log(`\n💡 To convert and seed these ${quizzes.length} trivia items into the modules table, run:`);
  console.log('   node scripts/generate_trivia_modules.js --seed\n');
}

if (isSeedMode) {
  console.log(`\n🔄 [Trivia Seeder] Synchronizing ${quizzes.length} trivia modules into curriculum...`);
  const { syncedCount } = syncTriviaModulesFromQuizzes(db);
  console.log(`✅ [Trivia Seeder] Successfully synchronized ${syncedCount} trivia modules into curriculum!`);
  const totalMods = db.prepare('SELECT COUNT(*) as c FROM modules WHERE is_active = 1').get()?.c;
  console.log(`📊 Total Active Modules now in database: ${totalMods}`);
}
