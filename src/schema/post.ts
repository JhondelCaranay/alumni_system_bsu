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
  photos: z.array(
    z.object({
      id: z.string(),
      public_url: z.string(),
      public_id: z.string(),
      postId: z.string(),
    })
  ),
  department: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      isArchived: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
      postId: z.string(),
    })
  ),
}) satisfies z.ZodType<Post>;

export type PostSchemaType = z.infer<typeof PostSchema>;

export const CreatePostSchema = PostSchema.pick({
  department: true,
  photos: true,
  type: true,
  description: true,
  title: true,
  company: true,
  location: true,
})
  .extend({
    photos: z.array(
      z.object({ public_url: z.string(), public_id: z.string() })
    ),
    department: z.string().array(),
  })
  .partial({
    department: true,
    photos: true,
    company: true,
    location: true,
    title: true,
  });

export type CreatePostSchemaType = z.infer<typeof CreatePostSchema>;

export const UpdatePostSchema = PostSchema.pick({
  department: true,
  // photos: true,
  type: true,
  description: true,
  title: true,
  company: true,
  location: true,
})
  .extend({
    new_photos: z.array(
      z.object({ public_url: z.string(), public_id: z.string() })
    ),
    delete_photos: z.array(z.string()),
    department: z.string().array(),
  })
  .partial();

export type UpdatePostSchemaType = z.infer<typeof UpdatePostSchema>;
