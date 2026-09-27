import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../../../src/lib/errors';
import { db } from '../../../../../src/lib/db';
import { errorResponse } from '../../../../../src/lib/http';
import { getCurrentUser } from '../../../../../src/lib/auth/session';

export const dynamic = 'force-dynamic';
type Context = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const { id: postId } = await context.params;
    const post = await db.post.findUnique({ where: { id: postId }, select: { id: true, published: true } });
    if (!post || !post.published) return errorResponse(new AppError('NOT_FOUND', 'Post not found.'));
    await db.like.upsert({ where: { userId_postId: { userId: user.id, postId } }, create: { userId: user.id, postId }, update: {} });
    return NextResponse.json({ data: { liked: true } });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to like post.'));
  }
}

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id: postId } = await context.params;
    const user = await getCurrentUser();
    const [count, liked] = await Promise.all([
      db.like.count({ where: { postId } }),
      user ? db.like.count({ where: { postId, userId: user.id } }) : Promise.resolve(0),
    ]);
    return NextResponse.json({ data: { count, liked: liked > 0 } });
  } catch {
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to load post likes.'));
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const { id: postId } = await context.params;
    await db.like.deleteMany({ where: { userId: user.id, postId } });
    return NextResponse.json({ data: { liked: false } });
  } catch {
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to unlike post.'));
  }
}
