import 'server-only';

import { AppError } from './errors';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

export function assertRateLimit(key: string): void {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  if (current.count >= MAX_REQUESTS) {
    throw new AppError('RATE_LIMITED', 'Too many requests. Please try again later.');
  }
  current.count += 1;
}
