# NEXUS API contract

All API errors use:

```json
{"error":{"code":"ERROR_CODE","message":"Safe public message."}}
```

Successful responses use `{ "data": ... }`. Authenticated endpoints use the
HttpOnly `nexus_session` cookie.

## Health

- `GET /api/health` — process liveness.
- `GET /api/health/ready` — database readiness; returns `503` when unavailable.

## Authentication

- `POST /api/auth/register` — create an account.
- `POST /api/auth/login` — verify credentials and create a session.
- `POST /api/auth/logout` — revoke the current session.
- `GET /api/auth/me` — return the current user or `null`.
- `GET/PATCH /api/auth/profile` — read/update display name.
- `PATCH /api/auth/password` — rotate password and revoke sessions.
- `DELETE /api/auth/account` — password-confirmed account deletion.

## Product domains

- `GET/POST /api/posts` — public list and authenticated creation. `GET` accepts
  `limit` (1–50, default 20), `cursor`, and `q` (case-insensitive title/body
  search); paginated responses return `data.nextCursor` or `null`.
- `GET/PATCH/DELETE /api/posts/:id` — published reads and owner/admin changes.
- `GET/POST /api/posts/:id/comments` — list and authenticated creation.
- `GET/PATCH /api/notifications` — current-user notifications and read state.
- `GET/POST /api/files` — current-user file metadata; storage adapters are external.
- `GET/POST /api/orders` — current-user order list and pending order creation.

## Administration

All admin endpoints require an authenticated `ADMIN` role:

- `GET /api/admin/stats`
- `GET/PATCH /api/admin/users`
- `GET/PATCH /api/admin/orders`
- `GET /api/admin/audit-logs`

Binary upload execution is intentionally disabled until an S3-compatible
provider is configured through a server-side adapter. Metadata registration is
not proof that the binary exists in object storage.

Email delivery is also adapter-based. Registration and password-recovery email
flows must not be enabled until an SMTP/provider adapter is configured.

## Operational headers

API responses include `X-Request-ID` for correlation. Origins are controlled by
`NEXUS_ALLOWED_ORIGINS`; secrets are server-only environment variables. API
responses are marked `Cache-Control: no-store`. Rate-limited responses use
HTTP `429` and include `Retry-After: 60`.
