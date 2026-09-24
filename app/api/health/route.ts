import { jsonOk } from '../../../src/lib/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  return jsonOk({
    data: {
      service: 'nexus-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
}
