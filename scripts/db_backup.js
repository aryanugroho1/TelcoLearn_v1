/**
 * TelcoLearn Database Backup & Restore Utility
 * Manages SQLite snapshots for safe versioning and rollbacks.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Get active database path according to db.js logic
export function getActiveDbPath() {
  if (process.env.DATABASE_PATH) {
    return path.resolve(rootDir, process.env.DATABASE_PATH);
  }
  const dataDirDbPath = path.resolve(rootDir, 'data', 'telcolearn.db');
  const legacyDbPath = path.resolve(rootDir, 'database', 'telcolearn.db');
  return fs.existsSync(dataDirDbPath) ? dataDirDbPath : legacyDbPath;
}

export function getBackupDir() {
  const backupDir = path.resolve(rootDir, 'data', 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  return backupDir;
}

function getManifestPath() {
  return path.join(getBackupDir(), 'manifest.json');
}

function readManifest() {
  const manifestPath = getManifestPath();
  if (fs.existsSync(manifestPath)) {
    try {
      return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (e) {
      return [];
    }
  }
  return [];
}

function writeManifest(entries) {
  fs.writeFileSync(getManifestPath(), JSON.stringify(entries, null, 2), 'utf8');
}

function getAppVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
    return pkg.version || 'unknown';
  } catch (e) {
    return 'unknown';
  }
}

/**
 * Creates an atomic snapshot backup of the current SQLite database.
 * @param {string} customTag - Optional tag (e.g. "v3.0.0", "pre-migration")
 */
export function backupDatabase(customTag = '') {
  const dbPath = getActiveDbPath();
  if (!fs.existsSync(dbPath)) {
    console.warn(`⚠️ [DB Backup] Database file not found at ${dbPath}. Skipping backup.`);
    return null;
  }

  const backupDir = getBackupDir();
  const version = getAppVersion();
  const now = new Date();
  const timestampStr = now.toISOString().replace(/[:.]/g, '-');
  const tagSanitized = customTag ? `_${customTag.replace(/[^a-zA-Z0-9.-]/g, '_')}` : '';
  const backupFileName = `telcolearn_v${version}${tagSanitized}_${timestampStr}.db`;
  const backupFilePath = path.join(backupDir, backupFileName);

  // Checkpoint WAL if database is open or has active wal journal
  try {
    const tempDb = new DatabaseSync(dbPath);
    tempDb.exec('PRAGMA wal_checkpoint(TRUNCATE);');
    tempDb.close();
  } catch (err) {
    // If locked or already checkpointed, proceed with safe copy
  }

  // Copy primary SQLite file
  fs.copyFileSync(dbPath, backupFilePath);

  const stats = fs.statSync(backupFilePath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

  const manifestEntry = {
    fileName: backupFileName,
    filePath: backupFilePath,
    createdAt: now.toISOString(),
    version,
    tag: customTag || '',
    sizeBytes: stats.size,
    sizeMb: `${sizeMb} MB`,
    sourceDbPath: dbPath
  };

  const manifest = readManifest();
  manifest.unshift(manifestEntry);
  writeManifest(manifest.slice(0, 50)); // Keep last 50 backups

  console.log(`📦 [DB Backup] Snapshot created successfully:`);
  console.log(`   File: ${backupFileName}`);
  console.log(`   Size: ${sizeMb} MB`);
  console.log(`   Version: v${version} ${customTag ? `(${customTag})` : ''}`);

  return manifestEntry;
}

/**
 * Restores database from a given backup file or version tag.
 * Automatically saves a safety rollback of the current state before replacing.
 */
export function restoreDatabase(identifier) {
  const dbPath = getActiveDbPath();
  const backupDir = getBackupDir();
  const manifest = readManifest();

  let targetBackup = null;

  if (!identifier || identifier === 'latest') {
    targetBackup = manifest[0];
  } else {
    // Find by exact file name, version, or tag
    targetBackup = manifest.find(m =>
      m.fileName === identifier ||
      m.tag === identifier ||
      m.version === identifier ||
      m.version === `v${identifier}` ||
      `v${m.version}` === identifier
    );

    // If not found in manifest, check if direct file exists in backup dir
    if (!targetBackup && fs.existsSync(path.join(backupDir, identifier))) {
      const stats = fs.statSync(path.join(backupDir, identifier));
      targetBackup = {
        fileName: identifier,
        filePath: path.join(backupDir, identifier),
        sizeMb: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`
      };
    }
  }

  if (!targetBackup || !fs.existsSync(targetBackup.filePath)) {
    console.error(`❌ [DB Restore] Could not find backup matching: "${identifier}"`);
    console.log(`Available backups:`);
    listBackups();
    return false;
  }

  console.log(`⚠️ [DB Restore] Restoring database from: ${targetBackup.fileName} (${targetBackup.sizeMb})...`);

  // Step 1: Create a safety backup of CURRENT db before overwriting
  if (fs.existsSync(dbPath)) {
    const safetyBackupName = `telcolearn_safety_pre_restore_${Date.now()}.db`;
    const safetyPath = path.join(backupDir, safetyBackupName);
    fs.copyFileSync(dbPath, safetyPath);
    console.log(`🛡️ [DB Restore] Current database preserved at: ${safetyBackupName}`);
  }

  // Step 2: Remove active WAL and SHM files to prevent corruption with restored DB
  const walPath = `${dbPath}-wal`;
  const shmPath = `${dbPath}-shm`;
  if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
  if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath);

  // Step 3: Copy backup to active db path
  fs.copyFileSync(targetBackup.filePath, dbPath);

  console.log(`✅ [DB Restore] Database successfully restored to ${dbPath}!`);
  return true;
}

/**
 * List all available backups
 */
export function listBackups() {
  const manifest = readManifest();
  if (manifest.length === 0) {
    console.log('No backups found in manifest.');
    return [];
  }

  console.log('\nAvailable Database Snapshots:');
  console.log('----------------------------------------------------------------------');
  console.log(
    'Version'.padEnd(10) +
    'Tag'.padEnd(15) +
    'Size'.padEnd(12) +
    'Date & Time'.padEnd(25) +
    'File Name'
  );
  console.log('----------------------------------------------------------------------');

  manifest.forEach((b, idx) => {
    const isLatest = idx === 0 ? ' [LATEST]' : '';
    console.log(
      `v${b.version}`.padEnd(10) +
      (b.tag || '-').padEnd(15) +
      b.sizeMb.padEnd(12) +
      new Date(b.createdAt).toLocaleString().padEnd(25) +
      b.fileName + isLatest
    );
  });
  console.log('----------------------------------------------------------------------\n');
  return manifest;
}

// CLI Execution Support
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const action = process.argv[2] || 'backup';
  const param = process.argv[3] || '';

  if (action === 'backup') {
    backupDatabase(param);
  } else if (action === 'restore') {
    if (!param) {
      console.error('Usage: node scripts/db_backup.js restore <backup-file-or-tag>');
      listBackups();
      process.exit(1);
    }
    const success = restoreDatabase(param);
    process.exit(success ? 0 : 1);
  } else if (action === 'list') {
    listBackups();
  } else {
    console.log('Usage: node scripts/db_backup.js [backup [tag] | restore <tag/file> | list]');
  }
}
