import { Guardian } from "@prisma/client";
import { z } from "zod";

export const GuardianSchema = z.object({
  id: z.string(),
  firstname: z.string().min(1, "Required"),
  lastname: z.string().min(1, "Required"),
  occupation: z.string().min(1, "Required"),
  relationship: z.string().min(1, "Required"),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  childrenId: z.string(), // STUDENT ID
}) satisfies z.ZodType<Guardian>;

// ccreate guardian schema
export const CreateGuardianSchema = GuardianSchema.pick({
  firstname: true,
  lastname: true,
  occupation: true,
  relationship: true,
  childrenId: true,
});

// update guardian schema
export const UpdateGuardianSchema = GuardianSchema.partial().pick({
  firstname: true,
  lastname: true,
  occupation: true,
  relationship: true,
  childrenId: true,
});
export type GuardianSchemaType = z.infer<typeof GuardianSchema>
export type CreateGuardianInput = z.infer<typeof CreateGuardianSchema>;
export type UpdateGuardianInput = z.infer<typeof UpdateGuardianSchema>;
