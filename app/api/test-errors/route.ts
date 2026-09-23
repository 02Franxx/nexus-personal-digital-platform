import { NextResponse } from 'next/server';
import { AppError, toHttpErrorResponse } from '../../../src/lib/errors';

export async function GET() {
  try {
    throw new AppError('NOT_FOUND', 'Test resource was not found.');
  } catch (error) {
    const response = toHttpErrorResponse(error);
    return NextResponse.json(response.body, { status: response.statusCode });
  }
}
