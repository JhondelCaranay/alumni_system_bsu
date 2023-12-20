import { Job } from "@prisma/client";
import { z } from "zod";

export const JobSchema = z.object({
  id: z.string(),
  jobTitle: z.string().min(1, 'Required'),
  company: z.string().min(1, 'Required'),
  location: z.string().min(1, 'Required'),
  yearStart: z.date(),
  yearEnd: z.date(),
  isCurrentJob: z.boolean(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
}) satisfies z.ZodType<Job>;

export const CreateJobSchema = JobSchema.pick({
  jobTitle: true,
  company: true,
  location: true,
  yearStart: true,
  yearEnd: true,
  isCurrentJob: true,
})
.extend({
  yearStart: z.string(),
  yearEnd: z.string()
})
.partial({
  yearEnd:true,
})

export const UpdateJobSchema = JobSchema
  .pick({
  jobTitle: true,
  company: true,
  location: true,
  yearStart: true,
  yearEnd: true,
  isCurrentJob: true,
  })
  .extend({
    yearStart: z.string(),
    yearEnd: z.string()
  })
  .partial({
    yearEnd:true,
  });

export type JobSchemaType = z.infer<typeof JobSchema>;
export type CreateJobSchemaType = z.infer<typeof CreateJobSchema>;
export type UpdateJobSchemaType = z.infer<typeof UpdateJobSchema>;
