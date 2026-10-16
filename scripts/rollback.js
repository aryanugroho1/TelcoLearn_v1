/**
 * TelcoLearn Rollback Utility
 * Safely reverts code and restores database snapshot to a previous stable version.
 * Usage: node scripts/rollback.js <target_tag_or_version>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { backupDatabase, restoreDatabase, listBackups } from './db_backup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function run(command, options = {}) {
  return execSync(command, { cwd: rootDir, encoding: 'utf8', stdio: options.stdio || 'pipe', ...options });
}

function getAvailableGitTags() {
  try {
    const raw = run('git tag -l --sort=-creatordate').trim();
    return raw ? raw.split('\n').map(t => t.trim()) : [];
  } catch (e) {
    return [];
  }
}

async function rollback() {
  const args = process.argv.slice(2);
  let target = args[0];

  const gitTags = getAvailableGitTags();

  if (!target) {
    console.log('\n🔄 [Rollback Manager] Rollback Command Center');
    console.log('======================================================================');
    console.log('Usage: npm run rollback -- <target_tag> (e.g. npm run rollback -- v3.0.0)\n');

    console.log('📌 Available Git Release Tags:');
    if (gitTags.length > 0) {
      gitTags.forEach(t => console.log(`   • ${t}`));
    } else {
      console.log('   (No git tags found yet)');
    }

    console.log('\n📦 Available Database Snapshots:');
    listBackups();
    process.exit(0);
  }

  // Normalize target tag format (e.g., '3.0.0' -> 'v3.0.0')
  if (!target.startsWith('v') && /^\d+\.\d+\.\d+$/.test(target)) {
    target = `v${target}`;
  }

  console.log(`\n🚨 [Rollback Manager] Preparing rollback to version: ${target}...`);

  // 1. Verify that tag exists in Git
  if (!gitTags.includes(target)) {
    console.error(`❌ [Rollback Manager] Tag "${target}" was not found in git repository!`);
    console.log(`Available tags: ${gitTags.join(', ') || 'None'}`);
    process.exit(1);
  }

  // 2. Check working tree cleanliness
  const status = run('git status --porcelain').trim();
  if (status) {
    console.error('❌ [Rollback Manager] Working directory has uncommitted changes:');
    console.error(status);
    console.error('\nPlease commit or stash changes before initiating rollback.');
    process.exit(1);
  }

  // 3. Take safety backup of current database before doing anything
  console.log('🛡️ [Rollback Manager] Taking emergency pre-rollback snapshot of current DB...');
  backupDatabase(`pre-rollback-from-${Date.now()}`);

  // 4. Safe Code Rollback (Checkout tree from target tag without losing branch context)
  console.log(`🔄 [Rollback Manager] Reverting codebase to exact state of ${target}...`);
  try {
    // Checkout all tracked files from the specified tag
    run(`git checkout ${target} -- .`);

    const diff = run('git status --porcelain').trim();
    if (diff) {
      run(`git commit -m "revert: rollback codebase to ${target}"`);
      console.log(`✅ [Rollback Manager] Revert commit created for ${target}.`);
    } else {
      console.log(`ℹ️ [Rollback Manager] Codebase is already identical to ${target}.`);
    }
  } catch (codeErr) {
    console.error('❌ [Rollback Manager] Failed during code checkout:', codeErr.message);
    process.exit(1);
  }

  // 5. Restore Database Snapshot matching the target version
  console.log(`📦 [Rollback Manager] Restoring matching database snapshot for ${target}...`);
  const restored = restoreDatabase(target);
  if (!restored) {
    console.warn(`⚠️ [Rollback Manager] No specific database snapshot found with tag "${target}". Keeping current database.`);
  }

  // 6. Push rollback to GitHub
  console.log(`🌐 [Rollback Manager] Pushing rollback commit to origin main...`);
  try {
    run('git push origin main', { stdio: 'inherit' });
    console.log('✅ [Rollback Manager] Pushed rollback commit to origin main.');
  } catch (pushErr) {
    console.warn('⚠️ [Rollback Manager] Failed to push to remote. Push manually with: git push origin main');
  }

  console.log(`\n🎉 [Rollback Manager] Successfully rolled back to ${target}! 🚀\n`);
}

rollback().catch(err => {
  console.error('❌ Rollback failed:', err);
  process.exit(1);
});
