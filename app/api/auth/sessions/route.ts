import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AppError } from '../../../../src/lib/errors';
import { db } from '../../../../src/lib/db';
import { errorResponse } from '../../../../src/lib/http';
import { destroyUserSessions, getCurrentUser } from '../../../../src/lib/auth/session';

const COOKIE_NAME = 'nexus_session';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    const currentHash = token ? hashToken(token) : null;
    const sessions = await db.session.findMany({
      where: { userId: user.id, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true, expiresAt: true, tokenHash: true },
    });
    return NextResponse.json({ data: { sessions: sessions.map(({ tokenHash, ...session }) => ({ ...session, current: tokenHash === currentHash })) } });
  } catch {
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to load active sessions.'));
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    await destroyUserSessions(user.id);
    return NextResponse.json({ data: { revoked: true } });
  } catch {
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to revoke active sessions.'));
  }
}
