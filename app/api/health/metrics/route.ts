import { NextResponse } from 'next/server';
import { AppError } from '../../../../src/lib/errors';
import { errorResponse } from '../../../../src/lib/http';
import { getCurrentUser } from '../../../../src/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse(new AppError('UNAUTHORIZED', 'Authentication is required.'));
    if (user.role !== 'ADMIN') return errorResponse(new AppError('FORBIDDEN', 'Administrator access is required.'));
    const memory = process.memoryUsage();
    return NextResponse.json({
      data: {
        service: 'nexus-api',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.round(process.uptime()),
        nodeVersion: process.version,
        memory: {
          rssBytes: memory.rss,
          heapUsedBytes: memory.heapUsed,
          heapTotalBytes: memory.heapTotal,
        },
      },
    });
  } catch {
    return errorResponse(new AppError('INTERNAL_ERROR', 'Unable to load service metrics.'));
  }
}
