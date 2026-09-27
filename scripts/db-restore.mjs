import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const backup = process.env.NEXUS_BACKUP_FILE;
const databaseUrl = process.env.DATABASE_URL;

if (!backup || !databaseUrl) {
  console.error('NEXUS_BACKUP_FILE and DATABASE_URL are required.');
  process.exit(1);
}
if (!existsSync(backup)) {
  console.error(`Backup file does not exist: ${backup}`);
  process.exit(1);
}
if (process.env.NEXUS_RESTORE_CONFIRM !== 'YES') {
  console.error('Restore refused. Set NEXUS_RESTORE_CONFIRM=YES after verifying the target database.');
  process.exit(1);
}

const result = spawnSync('pg_restore', ['--clean', '--if-exists', '--no-owner', `--dbname=${databaseUrl}`, backup], { stdio: 'inherit' });
if (result.error) {
  console.error('pg_restore was not found. Install PostgreSQL client tools before restoring.');
  process.exit(1);
}
process.exit(result.status ?? 1);
