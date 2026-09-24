# NEXUS deployment checklist

## Required secrets

Configure these in the hosting provider's secret manager, never in Git:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXUS_ALLOWED_ORIGINS`
- SMTP variables when email delivery is enabled

## Build and migration order

```text
npm ci
npm run db:validate
npm run db:generate
npm run db:migrate
npm run typecheck
npm run build
```

Run migrations as a release step before switching application traffic. The
readiness endpoint is `GET /api/health/ready`; it returns `503` until the
database connection is available.

## External integrations

Payment and object-storage providers are intentionally adapter-based. Add
provider credentials only through the hosting platform and implement their
server-side adapters before enabling checkout or upload execution.
