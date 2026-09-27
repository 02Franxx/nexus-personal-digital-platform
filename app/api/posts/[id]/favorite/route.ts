import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../../../src/lib/errors';
import { db } from '../../../../../src/lib/db';
import { errorResponse } from '../../../../../src/lib/http';
import { getCurrentUser } from '../../../../../src/lib/auth/session';

export const dynamic = 'force-dynamic';
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ data: { favorited: false } });
    const { id: postId } = await context.params;
    const favorite = await db.favorite.findUnique({ where: { userId_postId: { userId: user.id, postId } }, select: { id: true } });
    return NextResponse.json({ data: { favorited: Boolean(favorite) } });
  } catch {
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to load favorite state.'));
  }
}

export async function POST(_request: NextRequest, context: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const { id: postId } = await context.params;
    const post = await db.post.findUnique({ where: { id: postId }, select: { id: true, published: true } });
    if (!post || !post.published) return errorResponse(new AppError('NOT_FOUND', 'Post not found.'));
    await db.favorite.upsert({ where: { userId_postId: { userId: user.id, postId } }, create: { userId: user.id, postId }, update: {} });
    return NextResponse.json({ data: { favorited: true } });
  } catch {
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to favorite post.'));
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const { id: postId } = await context.params;
    await db.favorite.deleteMany({ where: { userId: user.id, postId } });
    return NextResponse.json({ data: { favorited: false } });
  } catch {
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to remove favorite.'));
  }
}
