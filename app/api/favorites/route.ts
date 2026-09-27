import { NextResponse } from 'next/server';
import { AppError } from '../../../src/lib/errors';
import { db } from '../../../src/lib/db';
import { errorResponse } from '../../../src/lib/http';
import { getCurrentUser } from '../../../src/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const favorites = await db.favorite.findMany({
      where: { userId: user.id, post: { published: true } },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true, post: { select: { id: true, title: true, content: true, createdAt: true, author: { select: { displayName: true } } } } },
    });
    return NextResponse.json({ data: { favorites } });
  } catch {
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to load saved posts.'));
  }
}
