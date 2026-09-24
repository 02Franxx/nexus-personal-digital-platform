import { NextRequest } from 'next/server';

import { AppError } from '../../../../src/lib/errors';
import { errorResponse, jsonOk } from '../../../../src/lib/http';
import { db } from '../../../../src/lib/db';
import { verifyPassword } from '../../../../src/lib/auth/password';
import { parseLoginInput } from '../../../../src/lib/validation';
import { createSession } from '../../../../src/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const input = parseLoginInput(await request.json());
    const user = await db.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      return errorResponse(new AppError('UNAUTHORIZED', 'Invalid email or password.'));
    }

    await createSession(user.id);

    return jsonOk({
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid login request.'));
  }
}
