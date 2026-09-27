import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required. Load it from .env.local or the deployment secret store.');
  process.exit(1);
}

const backupDir = path.resolve(process.env.NEXUS_BACKUP_DIR ?? 'backups');
mkdirSync(backupDir, { recursive: true });
const stamp = new Date().toISOString().replaceAll(':', '-').replace(/\.\d{3}Z$/, 'Z');
const output = path.join(backupDir, `nexus-${stamp}.dump`);
const result = spawnSync('pg_dump', ['--format=custom', `--file=${output}`, process.env.DATABASE_URL], { stdio: 'inherit' });

if (result.error) {
  console.error('pg_dump was not found. Install PostgreSQL client tools before running db:backup.');
  process.exit(1);
}
if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Database backup created at ${output}`);
