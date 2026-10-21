/**
 * TelcoLearn Trivia Generator from Q&A Database
 * Usage:
 *   node scripts/generate_trivia_modules.js --preview
 *   node scripts/generate_trivia_modules.js --seed
 */

import { getDb, formatQuizAsTrivia } from '../database/db.js';

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
  console.log(`\n🔄 [Trivia Seeder] Seeding ${quizzes.length} trivia modules into modules table...`);
  const maxSeq = db.prepare('SELECT MAX(sequence_order) as m FROM modules').get()?.m || 20;
  let addedCount = 0;

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO modules (
      module_code, category, level, title, tags, summary,
      wa_text_body, sequence_order, is_active,
      title_en, summary_en, wa_text_body_en
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, 1,
      ?, ?, ?
    )
  `);

  for (let i = 0; i < quizzes.length; i++) {
    const q = quizzes[i];
    const code = `MOD-TRIVIA-${String(q.id).padStart(2, '0')}`;
    const seq = maxSeq + i + 1;
    const titleId = `Telco Trivia: ${q.question.slice(0, 50)}...`;
    const titleEn = `Telco Trivia: ${(q.question_en || q.question).slice(0, 50)}...`;
    const bodyId = formatQuizAsTrivia(q, 'id');
    const bodyEn = formatQuizAsTrivia(q, 'en');

    insertStmt.run(
      code,
      q.category,
      'Semua Level',
      titleId,
      `trivia,quiz,${q.category}`,
      `Fakta teknis & trivia singkat: ${titleId}`,
      bodyId,
      seq,
      titleEn,
      `Technical facts & brief trivia: ${titleEn}`,
      bodyEn
    );
    addedCount++;
  }

  console.log(`✅ [Trivia Seeder] Successfully seeded ${addedCount} trivia modules into curriculum!`);
  const totalMods = db.prepare('SELECT COUNT(*) as c FROM modules WHERE is_active = 1').get()?.c;
  console.log(`📊 Total Active Modules now in database: ${totalMods}`);
}
