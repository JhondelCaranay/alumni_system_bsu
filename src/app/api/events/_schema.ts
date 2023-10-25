import { z } from "zod";

export const createEventsSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(1, "Title must be at least 2 characters long"),
  description: z.string().min(1, "Description must be at least 2 characters long"),
  dateStart: z.coerce.date(),
  timeStart: z.coerce.date(),
  timeEnd: z.coerce.date(),
});

export const updateEventsSchema = createEventsSchema.partial();
