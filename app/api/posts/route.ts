import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../src/lib/errors';
import { db } from '../../../src/lib/db';
import { errorResponse } from '../../../src/lib/http';
import { getCurrentUser } from '../../../src/lib/auth/session';
import { parsePostInput } from '../../../src/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { id: true, title: true, content: true, createdAt: true, author: { select: { id: true, displayName: true } } },
  });
  return NextResponse.json({ data: { posts } });
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const input = parsePostInput(await request.json());
    const post = await db.post.create({
      data: { ...input, authorId: user.id },
      select: { id: true, title: true, content: true, published: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json({ data: { post } }, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid post request.'));
  }
}
