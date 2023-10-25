import { z } from "zod";

export const createEventsSchema = z.object({
  id: z.string().cuid2(),
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(1, "Title must be at least 2 characters long"),
  description: z
    .string()
    .min(1, "Description must be at least 2 characters long"),
  timeStart: z.coerce.date(),
  timeEnd: z.coerce.date(),
  allDay: z.boolean(),
});

export const updateEventsSchema = createEventsSchema.partial();
