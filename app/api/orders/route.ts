import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../src/lib/errors';
import { db } from '../../../src/lib/db';
import { errorResponse } from '../../../src/lib/http';
import { getCurrentUser } from '../../../src/lib/auth/session';
import { orderSchema } from '../../../src/lib/validation';
import { recordAuditLog } from '../../../src/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const orders = await db.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ data: { orders } });
  } catch {
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to load orders.'));
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const input = orderSchema.parse(await request.json());
    const rawKey = request.headers.get('idempotency-key')?.trim();
    const idempotencyKey = rawKey && rawKey.length <= 128 ? rawKey : undefined;
    if (rawKey && !idempotencyKey) return errorResponse(new AppError('BAD_REQUEST', 'Invalid idempotency key.'));
    if (idempotencyKey) {
      const existing = await db.order.findFirst({ where: { userId: user.id, idempotencyKey } });
      if (existing) return NextResponse.json({ data: { order: existing, idempotentReplay: true } });
    }
    const order = await db.order.create({ data: { ...input, userId: user.id, idempotencyKey } });
    await Promise.all([
      db.notification.create({ data: { userId: user.id, type: 'ORDER_CREATED', message: `Order ${order.id} was created and is pending payment.` } }),
      recordAuditLog({ action: 'ORDER_CREATED', entity: 'Order', entityId: order.id, userId: user.id }),
    ]);
    return NextResponse.json({ data: { order } }, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid order request.'));
  }
}
