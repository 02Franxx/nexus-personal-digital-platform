# NEXUS database foundation

The schema targets PostgreSQL and is intentionally kept small for the first
database milestone. It establishes the user identity boundary without adding
feature tables before the product needs them.

Local setup requires `prisma` and `@prisma/client` to be installed and a real
`DATABASE_URL` in `.env.local`. Do not commit credentials or generated local
environment files.

Planned commands after dependencies are available:

```text
npx prisma validate
npx prisma migrate dev --name init
npx prisma generate
```
