import { Job } from "@prisma/client";
import { z } from "zod";

export const JobSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  location: z.string(),
  yearStart: z.date(),
  yearEnd: z.date(),
  isCurrentJob: z.boolean(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
}) satisfies z.ZodType<Job>;

export const CreateJobSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  location: z.string(),
  yearStart: z.date(),
  yearEnd: z.date(),
  isCurrentJob: z.boolean(),
});

export const UpdateJobSchema = z
  .object({
    jobTitle: z.string(),
    company: z.string(),
    location: z.string(),
    yearStart: z.date(),
    yearEnd: z.date(),
    isCurrentJob: z.boolean(),
  })
  .partial();

export type JobSchemaType = z.infer<typeof JobSchema>;
export type CreateJobSchemaType = z.infer<typeof CreateJobSchema>;
export type UpdateJobSchemaType = z.infer<typeof UpdateJobSchema>;
