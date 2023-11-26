import { GroupChat } from "@prisma/client";
import { z } from "zod";

export const GroupChatSchema = z.object({
  id: z.string(),
  name: z.string(),
  year: z.number(),
  adviserId: z.string(),
  departmentId: z.string(),
  sectionId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<GroupChat>;

export const CreateGroupChatSchema = GroupChatSchema.pick({
  name: true,
  year: true,
  adviserId: true,
  departmentId: true,
  sectionId: true,
}).partial({
  year: true,
});

export const UpdateGroupChatSchema = GroupChatSchema.pick({
  name: true,
  year: true,
  adviserId: true,
  departmentId: true,
  sectionId: true,
}).partial();

export const UploadStudentsSchema = z.object({
  studentIds: z.array(z.string().cuid()),
});

export type GroupChatSchemaType = z.infer<typeof GroupChatSchema>;
export type CreateGroupChatSchemaType = z.infer<typeof CreateGroupChatSchema>;
export type UpdateGroupChatSchemaType = z.infer<typeof UpdateGroupChatSchema>;
export type UploadStudentsSchemaType = z.infer<typeof UploadStudentsSchema>;
