import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../../../../src/lib/errors';
import { db } from '../../../../../../src/lib/db';
import { errorResponse } from '../../../../../../src/lib/http';
import { getCurrentUser } from '../../../../../../src/lib/auth/session';
import { recordAuditLog } from '../../../../../../src/lib/audit';

export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ id: string; commentId: string }> };

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const { id: postId, commentId } = await context.params;
    const comment = await db.comment.findUnique({ where: { id: commentId }, select: { id: true, postId: true, authorId: true } });
    if (!comment || comment.postId !== postId) return errorResponse(new AppError('NOT_FOUND', 'Comment not found.'));
    if (comment.authorId !== user.id && user.role !== 'ADMIN') return errorResponse(new AppError('FORBIDDEN', 'You cannot delete this comment.'));
    await db.comment.delete({ where: { id: commentId } });
    await recordAuditLog({ action: 'COMMENT_DELETED', entity: 'Comment', entityId: commentId, userId: user.id });
    return NextResponse.json({ data: { deleted: true } });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to delete comment.'));
  }
}
