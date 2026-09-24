import 'server-only';

import { z } from 'zod';

export const emailSchema = z.string().trim().email().max(254);
export const passwordSchema = z.string().min(12).max(128);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
}).strict();

export const registerSchema = loginSchema.extend({
  displayName: z.string().trim().min(1).max(80),
}).strict();

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export function parseLoginInput(input: unknown): LoginInput {
  return loginSchema.parse(input);
}

export function parseRegisterInput(input: unknown): RegisterInput {
  return registerSchema.parse(input);
}
