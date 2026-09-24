import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../../src/lib/errors';
import { db } from '../../../../src/lib/db';
import { errorResponse } from '../../../../src/lib/http';
import { getCurrentUser } from '../../../../src/lib/auth/session';
import { recordAuditLog } from '../../../../src/lib/audit';
import { orderStatusSchema } from '../../../../src/lib/validation-order';

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
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { id: true, email: true, displayName: true } } },
    });
    return NextResponse.json({ data: { orders } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const orderId = request.nextUrl.searchParams.get('orderId');
    if (!orderId) throw new AppError('BAD_REQUEST', 'orderId is required.');
    const { status } = orderStatusSchema.parse(await request.json());
    const order = await db.order.update({ where: { id: orderId }, data: { status } });
    await recordAuditLog({ action: 'ORDER_STATUS_CHANGED', entity: 'Order', entityId: order.id, userId: admin.id, metadata: { status } });
    return NextResponse.json({ data: { order } });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid order status update.'));
  }
}
