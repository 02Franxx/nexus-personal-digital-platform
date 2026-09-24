import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../../src/lib/errors';
import { db } from '../../../../src/lib/db';
import { errorResponse } from '../../../../src/lib/http';
import { getCurrentUser, destroyUserSessions } from '../../../../src/lib/auth/session';
import { verifyPassword } from '../../../../src/lib/auth/password';
import { accountDeleteSchema } from '../../../../src/lib/validation';
import { recordAuditLog } from '../../../../src/lib/audit';

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const input = accountDeleteSchema.parse(await request.json());
    const stored = await db.user.findUnique({ where: { id: user.id }, select: { passwordHash: true } });
    if (!stored || !(await verifyPassword(input.password, stored.passwordHash))) {
      return errorResponse(new AppError('UNAUTHORIZED', 'Password is incorrect.'));
    }
    await recordAuditLog({ action: 'ACCOUNT_DELETED', entity: 'User', entityId: user.id, userId: user.id });
    await destroyUserSessions(user.id);
    await db.user.delete({ where: { id: user.id } });
    return NextResponse.json({ data: { deleted: true } });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid account deletion request.'));
  }
}
