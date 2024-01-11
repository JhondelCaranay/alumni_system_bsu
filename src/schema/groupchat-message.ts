import { GroupChatMessage } from "@prisma/client";
import { z } from "zod";

export const GroupChatMessageSchema = z.object({
  id: z.string(),
  message: z.string().min(1, "required"),
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

export type GroupChatMessageSchemaType = z.infer<typeof GroupChatMessageSchema>;
export type CreateGroupChatMessageSchemaType = z.infer<
  typeof CreateGroupChatMessageSchema
>;
