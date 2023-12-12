import { Job } from "@prisma/client";
import { z } from "zod";

export const SectionSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  location: z.string(),
  yearStart: z.number(),
  yearEnd: z.number(),
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
  yearStart: z.number(),
  yearEnd: z.number(),
  isCurrentJob: z.boolean(),
});

export const UpdateJobSchema = z
  .object({
    jobTitle: z.string(),
    company: z.string(),
    location: z.string(),
    yearStart: z.number(),
    yearEnd: z.number(),
    isCurrentJob: z.boolean(),
  })
  .partial();

export type SectionSchema = z.infer<typeof SectionSchema>;
export type CreateJobSchema = z.infer<typeof CreateJobSchema>;
export type UpdateJobSchema = z.infer<typeof UpdateJobSchema>;
