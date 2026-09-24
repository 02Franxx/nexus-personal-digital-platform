import 'server-only';

import { NextResponse } from 'next/server';
import { toHttpErrorResponse } from './errors';

/** Convert an unknown route error into the public NEXUS API error contract. */
export function errorResponse(error: unknown): NextResponse {
  const response = toHttpErrorResponse(error);
  return NextResponse.json(response.body, { status: response.statusCode });
}

export function jsonOk<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}
