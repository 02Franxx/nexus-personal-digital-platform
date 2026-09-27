import { NextResponse } from 'next/server';
import { destroySession } from '../../../../src/lib/auth/session';
import { getCurrentUser } from '../../../../src/lib/auth/session';
import { recordAuditLog } from '../../../../src/lib/audit';
import { AppError } from '../../../../src/lib/errors';
import { errorResponse } from '../../../../src/lib/http';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const user = await getCurrentUser();
    await destroySession();
    if (user) await recordAuditLog({ action: 'USER_LOGGED_OUT', entity: 'User', entityId: user.id, userId: user.id });
    return NextResponse.json({ data: { loggedOut: true } });
  } catch {
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to end the session.'));
  }
}
