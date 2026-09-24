import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const localOrigins = new Set(['http://localhost:3000', 'http://localhost:3001']);

function allowedOrigins(): Set<string> {
  const configured = process.env.NEXUS_ALLOWED_ORIGINS ?? '';
  return new Set([
    ...localOrigins,
    ...configured.split(',').map((origin) => origin.trim()).filter(Boolean),
  ]);
}

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api/')) return NextResponse.next();

  const origin = request.headers.get('origin');
  if (origin && !allowedOrigins().has(origin)) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Origin is not allowed.' } },
      { status: 403, headers: { Vary: 'Origin' } },
    );
  }

  const response = NextResponse.next();
  response.headers.set('Vary', 'Origin');
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  return response;
}

export const config = { matcher: ['/api/:path*'] };
