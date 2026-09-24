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

- `GET/POST /api/posts` — public list and authenticated creation.
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

## Operational headers

API responses include `X-Request-ID` for correlation. Origins are controlled by
`NEXUS_ALLOWED_ORIGINS`; secrets are server-only environment variables.
