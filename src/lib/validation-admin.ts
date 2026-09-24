import 'server-only';

import { z } from 'zod';

export const roleUpdateSchema = z.object({
  role: z.enum(['USER', 'ADMIN']),
}).strict();
