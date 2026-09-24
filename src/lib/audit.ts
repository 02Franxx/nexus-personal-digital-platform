import 'server-only';

import { db } from './db';

type AuditInput = {
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export async function recordAuditLog(input: AuditInput): Promise<void> {
  await db.auditLog.create({
    data: {
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      userId: input.userId,
      metadata: input.metadata,
    },
  });
}
