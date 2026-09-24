import { AppError } from '../../../src/lib/errors';
import { errorResponse } from '../../../src/lib/http';

export async function GET() {
  try {
    throw new AppError('NOT_FOUND', 'Test resource was not found.');
  } catch (error) {
    return errorResponse(error);
  }
}
