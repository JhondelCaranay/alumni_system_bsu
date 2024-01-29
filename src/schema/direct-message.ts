import { DirectMessage } from "@prisma/client";
import { z } from "zod";

export const DirectMessageSchema = z.object({
  id: z.string(),
  content:z.string().min(1, "required"),
  fileUrl:z.string().nullable(),
  isDeleted:z.boolean(),
  conversationId: z.string(),
  senderId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<DirectMessage>;

export const CreateDirectMessageSchema = DirectMessageSchema.pick({
    content: true,
    // senderId: true,
    conversationId: true,
});

export type DirectMessageSchemaType = z.infer<typeof DirectMessageSchema>;
export type CreateDirectMessageSchemaType = z.infer<
  typeof CreateDirectMessageSchema
>;
