import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../../src/lib/errors';
import { db } from '../../../../src/lib/db';
import { errorResponse } from '../../../../src/lib/http';
import { getCurrentUser, destroyUserSessions } from '../../../../src/lib/auth/session';
import { hashPassword, verifyPassword } from '../../../../src/lib/auth/password';
import { passwordChangeSchema } from '../../../../src/lib/validation';
import { recordAuditLog } from '../../../../src/lib/audit';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const input = passwordChangeSchema.parse(await request.json());
    const stored = await db.user.findUnique({ where: { id: user.id }, select: { passwordHash: true } });
    if (!stored || !(await verifyPassword(input.currentPassword, stored.passwordHash))) {
      return errorResponse(new AppError('UNAUTHORIZED', 'Current password is incorrect.'));
    }
    if (input.currentPassword === input.newPassword) {
      return errorResponse(new AppError('BAD_REQUEST', 'New password must be different.'));
    }
    await db.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(input.newPassword) } });
    await destroyUserSessions(user.id);
    await recordAuditLog({ action: 'PASSWORD_CHANGED', entity: 'User', entityId: user.id, userId: user.id });
    return NextResponse.json({ data: { passwordChanged: true } });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid password change request.'));
  }
}
