import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
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
}
