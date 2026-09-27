import { NextResponse } from 'next/server';
import { AppError } from '../../../../src/lib/errors';
import { errorResponse } from '../../../../src/lib/http';
import { getCurrentUser } from '../../../../src/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ data: { user } });
  } catch {
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to load the current session.'));
  }
}
