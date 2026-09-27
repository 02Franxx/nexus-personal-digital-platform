# Database backup and recovery

NEXUS does not store backup credentials in the repository. Supply
`DATABASE_URL` through `.env.local` or the deployment secret store, and keep
the generated `backups/` directory outside source control.

Create a compressed PostgreSQL custom-format backup:

```powershell
$env:DATABASE_URL = "postgresql://user:password@host:5432/nexus"
$env:NEXUS_BACKUP_DIR = "D:\NEXUS-backups"
npm run db:backup
```

The command requires the PostgreSQL client tool `pg_dump` on `PATH`, creates a
timestamped `.dump` file, and never prints the connection string.

Before production use, schedule this command in the hosting environment,
encrypt or access-control the destination, retain multiple generations, and
perform a restore drill against an isolated database. A backup is not proven
usable until a restore has been tested.
