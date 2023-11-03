import { Department } from "@prisma/client";
import { z } from "zod";

export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Required"),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<Department>;

export type DepartmentSchemaType = z.infer<typeof DepartmentSchema>;

export const CreateDepartmentSchema = DepartmentSchema.pick({
  name: true,
});

export type CreateDepartmentSchemaType = z.infer<typeof CreateDepartmentSchema>;

export const UpdateDepartmentSchema = DepartmentSchema.pick({
  name: true,
}).partial();

export type UpdateDepartmentSchemaType = z.infer<typeof UpdateDepartmentSchema>;
