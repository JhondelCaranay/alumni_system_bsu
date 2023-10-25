import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name must be at least 1 characters long"),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();
