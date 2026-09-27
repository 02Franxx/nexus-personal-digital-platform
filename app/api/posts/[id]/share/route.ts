import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../../../src/lib/errors';
import { db } from '../../../../../src/lib/db';
import { errorResponse } from '../../../../../src/lib/http';
import { getCurrentUser } from '../../../../../src/lib/auth/session';
import { shareSchema } from '../../../../../src/lib/validation';

export const dynamic = 'force-dynamic';
type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  try {
    const { id: postId } = await context.params;
    const post = await db.post.findUnique({ where: { id: postId }, select: { id: true, published: true } });
    if (!post || !post.published) return errorResponse(new AppError('NOT_FOUND', 'Post not found.'));
    const input = shareSchema.parse(await request.json());
    const user = await getCurrentUser();
    await db.shareEvent.create({ data: { postId, channel: input.channel, userId: user?.id } });
    return NextResponse.json({ data: { shared: true } }, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid share request.'));
  }
}
