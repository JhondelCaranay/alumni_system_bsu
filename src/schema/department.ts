import { Department } from "@prisma/client";
import { z } from "zod";

export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Required"),
  courseYear: z.number().min(1, "Required"),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  postId: z.string(),
}) satisfies z.ZodType<Department>;

export type DepartmentSchemaType = z.infer<typeof DepartmentSchema>;

export const CreateDepartmentSchema = DepartmentSchema.pick({
  name: true,
  courseYear: true,
}).extend({
  courseYear: z.coerce.number().int().min(1, "Required"),
});

export const UpdateDepartmentSchema = DepartmentSchema.pick({
  name: true,
  courseYear: true,
})
  .extend({
    courseYear: z.coerce.number().int().min(1, "Required"),
  })
  .partial();

export const ArchiveDepartmentSchema = DepartmentSchema.pick({
  isArchived: true,
}).partial();

export type CreateDepartmentSchemaType = z.infer<typeof CreateDepartmentSchema>;
export type UpdateDepartmentSchemaType = z.infer<typeof UpdateDepartmentSchema>;
export type ArchiveDepartmentSchemaType = z.infer<
  typeof ArchiveDepartmentSchema
>;
