import 'server-only';

import { z } from 'zod';

export const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'CANCELLED', 'REFUNDED']),
}).strict();
