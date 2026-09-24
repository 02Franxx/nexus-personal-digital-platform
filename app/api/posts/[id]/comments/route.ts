import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../../../src/lib/errors';
import { db } from '../../../../../src/lib/db';
import { errorResponse } from '../../../../../src/lib/http';
import { getCurrentUser } from '../../../../../src/lib/auth/session';
import { parseCommentInput } from '../../../../../src/lib/validation';

export const dynamic = 'force-dynamic';
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  const comments = await db.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: 'asc' },
    select: { id: true, content: true, createdAt: true, author: { select: { id: true, displayName: true } } },
  });
  return NextResponse.json({ data: { comments } });
}

export async function POST(request: NextRequest, context: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const { id } = await context.params;
    const post = await db.post.findUnique({ where: { id }, select: { id: true, published: true } });
    if (!post || !post.published) return errorResponse(new AppError('NOT_FOUND', 'Post not found.'));
    const input = parseCommentInput(await request.json());
    const comment = await db.comment.create({
      data: { ...input, postId: id, authorId: user.id },
      select: { id: true, content: true, createdAt: true, author: { select: { id: true, displayName: true } } },
    });
    return NextResponse.json({ data: { comment } }, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid comment request.'));
  }
}
