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
  category: z.string().trim().max(80).optional(),
  tags: z.array(z.string().trim().min(1).max(30)).max(10).default([]),
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
  notificationId: z.string().min(1).optional(),
}).strict();

export const fileMetadataSchema = z.object({
  storageKey: z.string().trim().min(1).max(512).refine((value) => !value.startsWith('/') && !value.includes('\\') && !value.split('/').includes('..'), 'Invalid storage key.'),
  name: z.string().trim().min(1).max(255).refine((value) => !value.includes('/') && !value.includes('\\') && value !== '.' && value !== '..', 'Invalid file name.'),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/zip']),
  sizeBytes: z.number().int().positive().max(100 * 1024 * 1024),
}).strict().superRefine((value, context) => {
  const extension = value.name.split('.').pop()?.toLowerCase();
  const expectedExtensions: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/gif': ['gif'],
    'image/webp': ['webp'],
    'application/pdf': ['pdf'],
    'text/plain': ['txt'],
    'application/zip': ['zip'],
  };
  if (!extension || !expectedExtensions[value.mimeType].includes(extension)) {
    context.addIssue({ code: 'custom', path: ['name'], message: 'File extension does not match MIME type.' });
  }
});

export const orderSchema = z.object({
  totalCents: z.number().int().positive().max(100_000_000),
  currency: z.string().trim().length(3).toUpperCase().default('USD'),
}).strict();

export const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  bio: z.string().trim().max(500).optional(),
}).strict();

export const passwordChangeSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
}).strict();

export const accountDeleteSchema = z.object({
  password: passwordSchema,
  confirmation: z.literal('DELETE_ACCOUNT'),
}).strict();
