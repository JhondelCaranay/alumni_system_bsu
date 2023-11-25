import { Gender, Role, User } from "@prisma/client";
import { z } from "zod";

export const StudentSchema = z.object({
  id: z.string(),
  isArchived: z.boolean(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().nullable(),
  hashedPassword: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.nativeEnum(Role),
  sectionId: z.string().nullable(),
  groupChatId: z.string().nullable(),
  departmentId: z.string().nullable(),
}) satisfies z.ZodType<User>;

type PostSchemaType = z.infer<typeof StudentSchema>;

export const CreateStudentsSchema = z.object({
  studentNumber: z.string().min(1),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  middlename: z.string().min(1),
  email: z.string().email().min(1),
  role: z.enum([Role.STUDENT, Role.ALUMNI]),
  departmentId: z.string().cuid(),
  sectionId: z.string().cuid(),
});

type CreateStudentsSchemaType = z.infer<typeof CreateStudentsSchema>;

export const UpdateStudentsSchema = CreateStudentsSchema.extend({
  isEmployed: z.boolean().optional(),
  schoolYear: z.coerce.number().optional(),
  yearEnrolled: z.coerce.date().optional(),
  yearGraduated: z.coerce.date().optional(),

  alternative_email: z.string().email().optional(),

  age: z.coerce.number().optional(),
  religion: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),

  placeOfBirth: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  homeNo: z.string().optional(),
  street: z.string().optional(),
  barangay: z.string().optional(),
  city: z.string().optional(),
  corUrl: z.string().optional(),
  province: z.string().optional(),
  contactNo: z.string().optional(),
}).partial();

type UpdateStudentsSchemaType = z.infer<typeof UpdateStudentsSchema>;
