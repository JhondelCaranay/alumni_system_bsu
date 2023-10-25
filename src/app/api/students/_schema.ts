import { Gender, Role } from "@prisma/client";
import { z } from "zod";

export const getStudentsQueriesSchema = z.object({
  role: z.enum([Role.STUDENT, Role.ALUMNI]).optional(),
  schoolYear: z.coerce.number().optional(),
  department: z.string().optional(),
});

export const createStudentsSchema = z.object({
  studentNumber: z.string().min(1),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  middlename: z.string().min(1),
  email: z.string().email().min(1),
  role: z.enum([Role.STUDENT, Role.ALUMNI]),
  departmentId: z.string().uuid(),
  sectionId: z.string().uuid(),
});

export const updateStudentsSchema = createStudentsSchema.partial().extend({
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
});
