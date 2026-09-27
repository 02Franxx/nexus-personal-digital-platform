import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../src/lib/errors';
import { db } from '../../../src/lib/db';
import { errorResponse } from '../../../src/lib/http';
import { getCurrentUser } from '../../../src/lib/auth/session';
import { notificationReadSchema } from '../../../src/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const [notifications, unreadCount] = await Promise.all([
      db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 50 }),
      db.notification.count({ where: { userId: user.id, readAt: null } }),
    ]);
    return NextResponse.json({ data: { notifications, unreadCount } });
  } catch {
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to load notifications.'));
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const { notificationId } = notificationReadSchema.parse(await request.json());
    const result = await db.notification.updateMany({
      where: { userId: user.id, ...(notificationId ? { id: notificationId } : { readAt: null }) },
      data: { readAt: new Date() },
    });
    if (notificationId && result.count === 0) return errorResponse(new AppError('NOT_FOUND', 'Notification not found.'));
    return NextResponse.json({ data: { read: true, count: result.count } });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid notification request.'));
  }
}
