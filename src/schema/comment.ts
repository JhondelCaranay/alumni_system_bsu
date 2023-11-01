import { Comment } from "@prisma/client";
import { z } from "zod";
export const CommentSchema = z.object({
  id: z.string(),
  description: z.string(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().cuid(),
  postId: z.string().cuid(),
}) satisfies z.ZodType<Comment>;

export type CommentSchemaType = z.infer<typeof CommentSchema>;

// create schema
export const CreateCommentSchema = CommentSchema.pick({
  description: true,
  postId: true,
}).extend({
  description: z.string().min(1).max(1000),
});

export type CreateCommentSchemaType = z.infer<typeof CreateCommentSchema>;

// update schema
export const UpdateCommentSchema = CommentSchema.pick({
  description: true,
}).partial();

export type UpdateCommentSchemaType = z.infer<typeof UpdateCommentSchema>;
