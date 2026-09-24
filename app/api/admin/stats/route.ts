import { NextResponse } from 'next/server';
import { AppError } from '../../../../src/lib/errors';
import { db } from '../../../../src/lib/db';
import { errorResponse } from '../../../../src/lib/http';
import { getCurrentUser } from '../../../../src/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new AppError('UNAUTHORIZED', 'Authentication is required.');
    if (user.role !== 'ADMIN') throw new AppError('FORBIDDEN', 'Administrator access is required.');
    const [users, posts, orders, files, unreadNotifications] = await Promise.all([
      db.user.count(),
      db.post.count(),
      db.order.count(),
      db.fileRecord.count(),
      db.notification.count({ where: { readAt: null } }),
    ]);
    return NextResponse.json({ data: { users, posts, orders, files, unreadNotifications } });
  } catch (error) {
    return errorResponse(error);
  }
}
