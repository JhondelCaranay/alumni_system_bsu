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
  studentNumber: z.string().min(1, "Required"),
  firstname: z.string().min(1, "Required"),
  lastname: z.string().min(1, "Required"),
  middlename: z.string().min(1, "Required"),
  age: z.string(),
  homeNo: z.string().min(1, "Required"),
  street: z.string().min(1, "Required"),
  barangay: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  province: z.string().min(1, "Required"),
  contactNo: z.string().min(1, "Required"),
  gender: z.enum([Gender.MALE, Gender.FEMALE]),
  dateOfBirth: z.string(),
  email: z.string().email().min(1, "Required"),
  role: z.enum([Role.STUDENT, Role.ALUMNI]),
  departmentId: z.string().cuid(),
  sectionId: z.string().cuid(),
});

export type CreateStudentsSchemaType = z.infer<typeof CreateStudentsSchema>;

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

export const BulkUpdateStudentsSchema = z.object({
  students: z.array(
    z.object({
      studentNumber: z.number({
        required_error: "Student number is required",
        invalid_type_error: "Student number must be a number",
      }),
      firstname: z.string().min(1),
      lastname: z.string().min(1),
    })
  ),
});

export type BulkUpdateStudentsSchemaType = z.infer<
  typeof BulkUpdateStudentsSchema
>;

export const ImportStudentSchema = z.array(
  z.object({
    ["First Name"]: z.string(),
    ["Middle Name"]: z.string(),
    ["Last Name"]: z.string(),
    ["Age"]: z.number(),
    ["Date of birth"]: z.any(),
    ["Gender"]: z.string(),
    ["Home No"]: z.number(),
    ["Street"]: z.string(),
    ["Barangay"]: z.string(),
    ["City"]: z.string(),
    ["Email"]: z.string().email(),
    ["Province"]: z.string(),
    ["Student Number"]: z.number(),
    ["Course"]: z.string(),
    ["Section"]: z.string(),
    ["Contact Number"]: z.number(),
    ["Status"]: z.string().optional(),
  })
);

export type ImportStudentSchemaType = z.infer<typeof ImportStudentSchema>;
