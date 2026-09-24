import 'server-only';

export type SecurityEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'PASSWORD_CHANGED'
  | 'ACCOUNT_LOCKED'
  | 'SUSPICIOUS_REQUEST'
  | 'ORIGIN_BLOCKED'
  | 'VALIDATION_FAILED';

export type SecurityEvent = {
  type: SecurityEventType;
  requestId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, string | number | boolean>;
};

/** Structured, secret-safe logging boundary for security-relevant events. */
export function recordSecurityEvent(event: SecurityEvent): void {
  const entry = {
    timestamp: new Date().toISOString(),
    ...event,
  };

  console.info(JSON.stringify({ securityEvent: entry }));
}
