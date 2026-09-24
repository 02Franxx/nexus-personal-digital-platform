import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../../src/lib/errors';
import { db } from '../../../../src/lib/db';
import { errorResponse } from '../../../../src/lib/http';
import { getCurrentUser } from '../../../../src/lib/auth/session';
import { profileUpdateSchema } from '../../../../src/lib/validation';
import { recordAuditLog } from '../../../../src/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
  return NextResponse.json({ data: { user } });
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const input = profileUpdateSchema.parse(await request.json());
    const updated = await db.user.update({
      where: { id: user.id },
      data: input,
      select: { id: true, email: true, displayName: true, role: true },
    });
    await recordAuditLog({ action: 'PROFILE_UPDATED', entity: 'User', entityId: user.id, userId: user.id });
    return NextResponse.json({ data: { user: updated } });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid profile update.'));
  }
}
