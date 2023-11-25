import { GroupChat } from "@prisma/client";
import { z } from "zod";

export const GroupChatSchema = z.object({
  id: z.string(),
  name: z.string(),
  section: z.string(),
  year: z.number(),
  adviserId: z.string(),
  departmentId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<GroupChat>;

export const CreateGroupChatSchema = GroupChatSchema.pick({
  name: true,
  section: true,
  year: true,
  adviserId: true,
  departmentId: true,
}).partial({
  section: true,
  year: true,
});

export type GroupChatSchemaType = z.infer<typeof GroupChatSchema>;
export type CreateGroupChatSchemaType = z.infer<typeof CreateGroupChatSchema>;
