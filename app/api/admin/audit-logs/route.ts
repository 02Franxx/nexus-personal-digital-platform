import { NextResponse } from 'next/server';
import { AppError } from '../../../../src/lib/errors';
import { db } from '../../../../src/lib/db';
import { errorResponse } from '../../../../src/lib/http';
import { getCurrentUser } from '../../../../src/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
  if (user.role !== 'ADMIN') return errorResponse(new AppError('FORBIDDEN', 'Administrator access is required.'));
  const logs = await db.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  return NextResponse.json({ data: { logs } });
}
