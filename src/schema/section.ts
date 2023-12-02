import { Section } from "@prisma/client";
import { z } from "zod";

export const SectionSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
  year: z.string(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  departmentId: z.string().nullable(),
}) satisfies z.ZodType<Section>;

// create schema
export const CreateSectionSchema = SectionSchema.pick({
  name: true,
});

export const UpdateSectionSchema = SectionSchema.pick({
  name: true,
}).partial();

export type SectionSchemaType = z.infer<typeof SectionSchema>;
export type CreateSectionSchemaType = z.infer<typeof CreateSectionSchema>;
export type UpdateSectionSchemaType = z.infer<typeof UpdateSectionSchema>;
