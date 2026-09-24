import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../../../src/lib/errors';
import { db } from '../../../src/lib/db';
import { errorResponse } from '../../../src/lib/http';
import { getCurrentUser } from '../../../src/lib/auth/session';
import { fileMetadataSchema } from '../../../src/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
  const files = await db.fileRecord.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ data: { files } });
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    const input = fileMetadataSchema.parse(await request.json());
    const file = await db.fileRecord.create({ data: { ...input, userId: user.id } });
    return NextResponse.json({ data: { file } }, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid file metadata.'));
  }
}
