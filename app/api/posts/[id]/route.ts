import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../../src/lib/errors';
import { db } from '../../../../src/lib/db';
import { errorResponse } from '../../../../src/lib/http';
import { getCurrentUser } from '../../../../src/lib/auth/session';
import { parsePostInput } from '../../../../src/lib/validation';

export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  const post = await db.post.findUnique({
    where: { id },
    select: { id: true, title: true, content: true, published: true, createdAt: true, updatedAt: true, author: { select: { id: true, displayName: true } } },
  });
  if (!post || !post.published) return errorResponse(new AppError('NOT_FOUND', 'Post not found.'));
  return NextResponse.json({ data: { post } });
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const { id } = await context.params;
    const existing = await db.post.findUnique({ where: { id }, select: { authorId: true } });
    if (!existing) return errorResponse(new AppError('NOT_FOUND', 'Post not found.'));
    if (existing.authorId !== user.id && user.role !== 'ADMIN') return errorResponse(new AppError('FORBIDDEN', 'You cannot modify this post.'));
    const input = parsePostInput(await request.json());
    const post = await db.post.update({ where: { id }, data: input });
    return NextResponse.json({ data: { post } });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid post update.'));
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  const user = await getCurrentUser();
  if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
  const { id } = await context.params;
  const existing = await db.post.findUnique({ where: { id }, select: { authorId: true } });
  if (!existing) return errorResponse(new AppError('NOT_FOUND', 'Post not found.'));
  if (existing.authorId !== user.id && user.role !== 'ADMIN') return errorResponse(new AppError('FORBIDDEN', 'You cannot delete this post.'));
  await db.post.delete({ where: { id } });
  return NextResponse.json({ data: { deleted: true } });
}
