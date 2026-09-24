import { NextResponse } from 'next/server';
import { destroySession } from '../../../../src/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  await destroySession();
  return NextResponse.json({ data: { loggedOut: true } });
}
