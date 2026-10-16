/**
 * TelcoLearn Automated Release Script (SemVer)
 * Usage: node scripts/release.js [patch|minor|major|<specific_version>] ["Release notes"]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { backupDatabase } from './db_backup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function run(command, options = {}) {
  return execSync(command, { cwd: rootDir, encoding: 'utf8', stdio: options.stdio || 'pipe', ...options });
}

function getPackageJson() {
  const pkgPath = path.join(rootDir, 'package.json');
  return {
    path: pkgPath,
    data: JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  };
}

function calculateNextVersion(currentVersion, bumpType) {
  const parts = currentVersion.split('.').map(Number);
  let [major = 0, minor = 0, patch = 0] = parts;

  switch (bumpType.toLowerCase()) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      if (/^\d+\.\d+\.\d+$/.test(bumpType)) {
        return bumpType;
      }
      throw new Error(`Invalid bump type: "${bumpType}". Must be patch, minor, major, or X.Y.Z`);
  }
}

function updateChangelog(version, notes) {
  const changelogPath = path.join(rootDir, 'CHANGELOG.md');
  const today = new Date().toISOString().split('T')[0];
  const newEntry = `## [${version}] - ${today}\n\n${notes ? `### Highlights\n${notes}\n\n` : ''}`;

  let existing = '';
  if (fs.existsSync(changelogPath)) {
    existing = fs.readFileSync(changelogPath, 'utf8');
  } else {
    existing = `# TelcoLearn Changelog\n\nAll notable changes to this project will be documented in this file.\n\n`;
  }

  // Insert after header if exists
  if (existing.includes('# TelcoLearn Changelog\n\n')) {
    const parts = existing.split('# TelcoLearn Changelog\n\n');
    fs.writeFileSync(changelogPath, `# TelcoLearn Changelog\n\n${newEntry}${parts[1] || ''}`, 'utf8');
  } else {
    fs.writeFileSync(changelogPath, `${newEntry}${existing}`, 'utf8');
  }
}

async function release() {
  const args = process.argv.slice(2);
  const bumpType = args[0] || 'minor';
  const customNotes = args[1] || 'Standard production release update';

  console.log('🚀 [Release Manager] Starting release process...');

  // 1. Check Git working directory status
  try {
    const status = run('git status --porcelain').trim();
    if (status) {
      console.error('❌ [Release Manager] Uncommitted changes detected in working tree:');
      console.error(status);
      console.error('\nPlease commit or stash your changes before creating a release.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ [Release Manager] Failed to check git status:', err.message);
    process.exit(1);
  }

  // 2. Run Test Suite
  console.log('🧪 [Release Manager] Running verification test suite (test_scenario.js)...');
  try {
    run('node test_scenario.js', { stdio: 'inherit' });
    console.log('✅ [Release Manager] Test scenario passed.');
  } catch (tErr) {
    console.error('❌ [Release Manager] Tests failed! Release cancelled.');
    process.exit(1);
  }

  // 3. Compute Version
  const pkg = getPackageJson();
  const currentVersion = pkg.data.version || '3.0.0';
  const nextVersion = calculateNextVersion(currentVersion, bumpType);
  const tag = `v${nextVersion}`;

  console.log(`📌 [Release Manager] Version bump: v${currentVersion} -> ${tag}`);

  // 4. Create Database Snapshot
  console.log(`📦 [Release Manager] Taking database snapshot for ${tag}...`);
  backupDatabase(`release-${tag}`);

  // 5. Update package.json
  pkg.data.version = nextVersion;
  fs.writeFileSync(pkg.path, JSON.stringify(pkg.data, null, 2) + '\n', 'utf8');
  console.log(`📝 [Release Manager] Updated package.json version to ${nextVersion}.`);

  // 6. Update CHANGELOG.md
  updateChangelog(tag, customNotes);
  console.log(`📝 [Release Manager] Updated CHANGELOG.md.`);

  // 7. Git Commit & Tag
  try {
    run('git add package.json CHANGELOG.md data/backups/manifest.json');
    run(`git commit -m "chore(release): ${tag} - ${customNotes.replace(/"/g, '\\"')}"`);
    run(`git tag -a "${tag}" -m "Release ${tag}: ${customNotes.replace(/"/g, '\\"')}"`);
    console.log(`🏷️ [Release Manager] Created git tag: ${tag}`);
  } catch (gitErr) {
    console.error('❌ [Release Manager] Failed during git commit or tag:', gitErr.message);
    process.exit(1);
  }

  // 8. Push to GitHub
  console.log(`🌐 [Release Manager] Pushing release commit and tag ${tag} to origin...`);
  try {
    run(`git push origin main --tags`, { stdio: 'inherit' });
    console.log(`\n🎉 [Release Manager] Successfully released & published ${tag}! 🚀`);
    console.log(`\n💡 Rollback instructions if this release ever needs to be reverted:`);
    console.log(`   npm run rollback -- v${currentVersion}\n`);
  } catch (pushErr) {
    console.error(`⚠️ [Release Manager] Commit & tag created locally, but failed to push:`, pushErr.message);
    console.log(`You can manually push using: git push origin main --tags`);
  }
}

release().catch(err => {
  console.error('❌ Release failed:', err);
  process.exit(1);
});
