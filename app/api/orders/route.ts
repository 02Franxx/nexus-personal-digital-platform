import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../src/lib/errors';
import { db } from '../../../src/lib/db';
import { errorResponse } from '../../../src/lib/http';
import { getCurrentUser } from '../../../src/lib/auth/session';
import { orderSchema } from '../../../src/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
  const orders = await db.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ data: { orders } });
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const input = orderSchema.parse(await request.json());
    const order = await db.order.create({ data: { ...input, userId: user.id } });
    return NextResponse.json({ data: { order } }, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid order request.'));
  }
}
