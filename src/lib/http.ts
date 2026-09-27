import 'server-only';

import { NextResponse } from 'next/server';
import { retryAfterSeconds, toHttpErrorResponse } from './errors';

/** Convert an unknown route error into the public NEXUS API error contract. */
export function errorResponse(error: unknown): NextResponse {
  const response = toHttpErrorResponse(error);
  const retryAfter = retryAfterSeconds(error);
  const headers = retryAfter === null ? undefined : { 'Retry-After': String(retryAfter) };
  return NextResponse.json(response.body, { status: response.statusCode, headers });
}

export function jsonOk<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}
