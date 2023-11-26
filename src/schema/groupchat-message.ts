import { GroupChatMessage } from "@prisma/client";
import { z } from "zod";

export const GroupChatMessageSchema = z.object({
  id: z.string(),
  message: z.string().cuid(),
  senderId: z.string().cuid(),
  groupChatId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<GroupChatMessage>;

export const CreateGroupChatMessageSchema = GroupChatMessageSchema.pick({
  message: true,
  // senderId: true,
  groupChatId: true,
});

export type GroupChatSchemaType = z.infer<typeof GroupChatMessageSchema>;
export type CreateGroupChatSchemaType = z.infer<
  typeof CreateGroupChatMessageSchema
>;
