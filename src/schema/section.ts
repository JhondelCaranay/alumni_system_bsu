import { Section } from "@prisma/client";
import { z } from "zod";

export const SectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  year: z.string(),
  batch: z.string(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  departmentId: z.string().nullable(),
}) satisfies z.ZodType<Section>;

// PRISMA TYPE TO ZOD TYPE
export type SectionSchemaType = z.infer<typeof SectionSchema>;

// create schema
export const CreateSectionSchema = SectionSchema.pick({
  name: true,
  year: true,
  batch: true,
  departmentId: true,
}).extend({
  name: z.string().min(1).max(50),
  year: z.string().min(1).max(50),
  batch: z.string().min(1).max(50),
});

export type CreateSectionSchemaType = z.infer<typeof CreateSectionSchema>;

// update schema
export const UpdateSectionSchema = SectionSchema.pick({
  name: true,
  year: true,
  batch: true,
  departmentId: true,
})
  .extend({
    name: z.string().min(1).max(50),
    year: z.string().min(1).max(50),
    batch: z.string().min(1).max(50),
  })
  .partial();

export type UpdateSectionSchemaType = z.infer<typeof UpdateSectionSchema>;
