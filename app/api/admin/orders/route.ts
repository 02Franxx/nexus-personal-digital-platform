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

const allowedTransitions: Record<string, string[]> = {
  PENDING: ['PENDING', 'PAID', 'CANCELLED'],
  PAID: ['PAID', 'REFUNDED'],
  CANCELLED: ['CANCELLED'],
  REFUNDED: ['REFUNDED'],
};

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
    const existing = await db.order.findUnique({ where: { id: orderId }, select: { status: true, userId: true } });
    if (!existing) throw new AppError('NOT_FOUND', 'Order not found.');
    if (!allowedTransitions[existing.status].includes(status)) throw new AppError('CONFLICT', `Cannot transition order from ${existing.status} to ${status}.`);
    const order = await db.order.update({ where: { id: orderId }, data: { status } });
    await Promise.all([
      recordAuditLog({ action: 'ORDER_STATUS_CHANGED', entity: 'Order', entityId: order.id, userId: admin.id, metadata: { status } }),
      existing.status !== status ? db.notification.create({ data: { userId: existing.userId, type: 'ORDER_STATUS_CHANGED', message: `Your order ${order.id} is now ${status.toLowerCase()}.` } }) : Promise.resolve(),
    ]);
    return NextResponse.json({ data: { order } });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid order status update.'));
  }
}
