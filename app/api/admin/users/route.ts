import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../../src/lib/errors';
import { db } from '../../../../src/lib/db';
import { errorResponse } from '../../../../src/lib/http';
import { getCurrentUser } from '../../../../src/lib/auth/session';
import { recordAuditLog } from '../../../../src/lib/audit';
import { roleUpdateSchema } from '../../../../src/lib/validation-admin';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new AppError('UNAUTHORIZED', 'Authentication is required.');
  if (user.role !== 'ADMIN') throw new AppError('FORBIDDEN', 'Administrator access is required.');
  return user;
}

export async function GET() {
  try {
    await requireAdmin();
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, displayName: true, role: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json({ data: { users } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) throw new AppError('BAD_REQUEST', 'userId is required.');
    if (userId === admin.id) throw new AppError('BAD_REQUEST', 'You cannot change your own role.');
    const { role } = roleUpdateSchema.parse(await request.json());
    const user = await db.user.update({ where: { id: userId }, data: { role }, select: { id: true, email: true, role: true } });
    await recordAuditLog({ action: 'USER_ROLE_CHANGED', entity: 'User', entityId: user.id, userId: admin.id, metadata: { role } });
    return NextResponse.json({ data: { user } });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid role update.'));
  }
}
