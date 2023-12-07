import { Section } from "@prisma/client";
import { z } from "zod";

export const SectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  // must be in format 2021-2022, 2022-2023, etc.
  school_year: z.string(),
  course_year: z.number(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  departmentId: z.string().nullable(),
  department: z.object({
    id: z.string(),
    name: z.string(),
    isArchived: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
}) satisfies z.ZodType<Section>;

// create schema
export const CreateSectionSchema = z.object({
  name: z.string().min(1).max(50),
  // must be in format 2021-2022, 2022-2023, etc.
  school_year: z.string().regex(/^\d{4}-\d{4}$/, "Must be in format xxxx-xxxx"),
  course_year: z.coerce.number().min(1).max(10),
  departmentId: z.string(),
});

export const UpdateSectionSchema = SectionSchema.pick({
  name: true,
  school_year: true,
  course_year: true,
  departmentId: true,
}).partial();

export type SectionSchemaType = z.infer<typeof SectionSchema>;
export type CreateSectionSchemaType = z.infer<typeof CreateSectionSchema>;
export type UpdateSectionSchemaType = z.infer<typeof UpdateSectionSchema>;
