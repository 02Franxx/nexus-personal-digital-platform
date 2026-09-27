# NEXUS roadmap status

This is an implementation status document, not a claim that the whole
roadmap is complete. Every checked item has corresponding code in this
repository and is covered by the local verification command where practical.

## Implemented locally

- M0–M2: Next.js App Router, strict TypeScript, Prisma/PostgreSQL schema,
  migrations, environment templates, and reproducible dependency setup.
- M3: server-only secrets, typed API errors, safe HTTP conversion, Zod input
  validation, security events, audit events, CORS/origin policy, security
  headers, server-generated request IDs, no-store API responses, rate limiting,
  and error/security regression tests.
- M4: registration, bcrypt password hashing, login/logout, expiring sessions,
  password change, account deletion, profile settings, and active-session
  revocation.
- M6: posts, publishing state, cursor pagination, search, comments, comment
  notifications, and author/admin comment deletion.
- M7: persisted notifications, unread counts, and read-state updates.
- M8: file metadata ownership and server-side MIME, extension, filename,
  storage-key, and size validation. Binary storage still requires a configured
  provider adapter.
- M9: order creation/listing, admin order state changes, audit logging, and a
  payment-provider boundary. Real checkout/webhooks require provider
  credentials and an adapter.
- M10: user roles, admin pages, admin APIs, audit-log pages, and protected
  runtime metrics.
- M11–M12: security tests, ESLint flat config, typecheck/build verification,
  CI workflow, Docker build validation, dependency updates, deployment docs,
  health endpoints, and runtime metrics.

## Intentionally pending

- Email verification and password-reset delivery until SMTP/provider
  configuration is supplied.
- Real-time WebSocket delivery and group chat.
- Binary object-storage upload/download adapters.
- Product catalog, cart, payment checkout, webhook verification, and payment
  state machine.
- Categories, tags, likes, favorites, follows, shares, moderation reports, and
  expanded permission management.
- Production hosting, managed PostgreSQL, backups/restore drills, and live
  monitoring credentials.

These pending items require additional product decisions, external service
credentials, or schema migrations; no secret values belong in this repository.

## Verification

With a non-secret placeholder `DATABASE_URL`, run:

```powershell
cmd /c "set DATABASE_URL=postgresql://user:password@localhost:5432/nexus&& npm run verify"
```

This runs Prisma validation/generation, ESLint, TypeScript, security tests,
and the production build. Database integration and external-provider behavior
remain unverified until those services are available.
