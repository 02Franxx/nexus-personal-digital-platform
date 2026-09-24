import { NextRequest } from 'next/server';

import { Prisma } from '@prisma/client';
import { AppError } from '../../../../src/lib/errors';
import { errorResponse, jsonOk } from '../../../../src/lib/http';
import { db } from '../../../../src/lib/db';
import { hashPassword } from '../../../../src/lib/auth/password';
import { parseRegisterInput } from '../../../../src/lib/validation';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const input = parseRegisterInput(await request.json());
    const passwordHash = await hashPassword(input.password);
    const user = await db.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        displayName: input.displayName,
      },
      select: { id: true, email: true, displayName: true, role: true },
    });

    return jsonOk({ data: { user } }, 201);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return errorResponse(new AppError('CONFLICT', 'An account with this email already exists.'));
    }
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('BAD_REQUEST', 'Invalid registration request.'));
  }
}
