import { GroupChat, Role, User, Section, Department } from "@prisma/client";
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
  students: z.object({
    id: z.string(),
    isArchived: z.boolean(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    emailVerified: z.date().nullable(),
    image: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    role: z.nativeEnum(Role),
    departmentId: z.string().nullable(),
    sectionId: z.string().nullable(),
  }),
  adviser: z.object({
    id: z.string(),
    isArchived: z.boolean(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    emailVerified: z.date().nullable(),
    image: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    role: z.nativeEnum(Role),
    departmentId: z.string().nullable(),
    sectionId: z.string().nullable(),
  }),
  section: z.object({
    id: z.string(),
    name: z.string(),
    school_year: z.string().nullable(),
    course_year: z.number().nullable(),
    isArchived: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    departmentId: z.string().nullable(),
  }),
  department: z.object({
    id: z.string(),
    name: z.string(),
    isArchived: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
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
