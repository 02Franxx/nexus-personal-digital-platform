import { NextResponse } from 'next/server';
import { destroySession } from '../../../../src/lib/auth/session';
import { getCurrentUser } from '../../../../src/lib/auth/session';
import { recordAuditLog } from '../../../../src/lib/audit';

export const dynamic = 'force-dynamic';

export async function POST() {
  const user = await getCurrentUser();
  await destroySession();
  if (user) await recordAuditLog({ action: 'USER_LOGGED_OUT', entity: 'User', entityId: user.id, userId: user.id });
  return NextResponse.json({ data: { loggedOut: true } });
}
