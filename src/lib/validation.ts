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

export const postSchema = z.object({
  title: z.string().trim().min(1).max(160),
  content: z.string().trim().min(1).max(100_000),
  published: z.boolean().default(false),
}).strict();

export const commentSchema = z.object({
  content: z.string().trim().min(1).max(5_000),
}).strict();

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type CommentInput = z.infer<typeof commentSchema>;

export function parseLoginInput(input: unknown): LoginInput {
  return loginSchema.parse(input);
}

export function parseRegisterInput(input: unknown): RegisterInput {
  return registerSchema.parse(input);
}

export function parsePostInput(input: unknown): PostInput {
  return postSchema.parse(input);
}

export function parseCommentInput(input: unknown): CommentInput {
  return commentSchema.parse(input);
}

export const notificationReadSchema = z.object({
  notificationId: z.string().min(1),
}).strict();

export const fileMetadataSchema = z.object({
  storageKey: z.string().trim().min(1).max(512),
  name: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(128),
  sizeBytes: z.number().int().positive().max(100 * 1024 * 1024),
}).strict();

export const orderSchema = z.object({
  totalCents: z.number().int().positive().max(100_000_000),
  currency: z.string().trim().length(3).toUpperCase().default('USD'),
}).strict();

export const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
}).strict();

export const passwordChangeSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
}).strict();
