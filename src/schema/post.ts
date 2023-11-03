import { Post, PostType } from "@prisma/client";
import { z } from "zod";

export const PostSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string(),
  company: z.string(),
  location: z.string(),
  isArchived: z.boolean(),
  type: z.nativeEnum(PostType),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().cuid(),
}) satisfies z.ZodType<Post>;

export type PostSchemaType = z.infer<typeof PostSchema>;

export const CreatePostSchema = PostSchema.omit({
  userId: true,
  isArchived: true,
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  company: true,
  location:true,
  title:true,
});

export type CreatePostSchemaType = z.infer<typeof CreatePostSchema>;

export const UpdatePostSchema = PostSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
}).partial();

export type UpdatePostSchemaType = z.infer<typeof UpdatePostSchema>;
