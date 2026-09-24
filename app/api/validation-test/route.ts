import { AppError } from '../../../src/lib/errors';
import { errorResponse, jsonOk } from '../../../src/lib/http';
import { recordSecurityEvent } from '../../../src/lib/security-log';
import { loginSchema } from '../../../src/lib/validation';

export async function POST(request: Request) {
  try {
    const input: unknown = await request.json();
    const result = loginSchema.safeParse(input);

    if (!result.success) {
      recordSecurityEvent({ type: 'VALIDATION_FAILED', metadata: { endpoint: '/api/validation-test' } });
      throw new AppError('BAD_REQUEST', 'Invalid request data.');
    }

    return jsonOk({ data: { valid: true } });
  } catch (error) {
    return errorResponse(error);
  }
}
