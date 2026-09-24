import 'server-only';

import { z } from 'zod';

export const emailSchema = z.string().trim().email().max(254);
export const passwordSchema = z.string().min(12).max(128);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
}).strict();

export type LoginInput = z.infer<typeof loginSchema>;

export function parseLoginInput(input: unknown): LoginInput {
  return loginSchema.parse(input);
}
