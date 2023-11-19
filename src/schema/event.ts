import { Event } from "@prisma/client";

import { z } from "zod";

// export const createEventsSchema = z.object({
//   id: z.string().cuid2(),
//   title: z
//     .string({
//       required_error: "Title is required",
//     })
//     .min(1, "Title must be at least 2 characters long"),
//   description: z.string().min(1, "Description must be at least 2 characters long"),
//   timeStart: z.coerce.date(),
//   timeEnd: z.coerce.date(),
//   allDay: z.boolean(),
// });

// export const updateTimeAndDateEventsSchema = createEventsSchema.partial({
//   description: true,
// });

// export const updateTitleAndDescriptionEventsSchema = createEventsSchema.partial({
//   id: true,
//   timeStart: true,
//   timeEnd: true,
//   allDay: true,
// });

export const EventSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string(),
  isArchived: z.boolean(),
  dateStart: z.date(),
  dateEnd: z.date(),
  allDay: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().cuid(),
}) satisfies z.ZodType<Event>;

export type EventSchemaType = z.infer<typeof EventSchema>;

export const ClientEventSchema = EventSchema.pick({
  id: true,
  title: true,
  description: true,
  allDay: true,
  isArchived: true,
}).extend({
  timeStart: z.coerce.date(),
  timeEnd: z.coerce.date(),
});

export type ClientEventSchemaType = z.infer<typeof ClientEventSchema>;

export const CreateEventSchema = ClientEventSchema.pick({
  id: true,
  title: true,
  description: true,
  allDay: true,
  timeEnd: true,
  timeStart: true,
});
export type CreateEventSchemaType = z.infer<typeof CreateEventSchema>;

export const UpdateTimeAndDateEventSchema = ClientEventSchema.pick({
  title: true,
  timeStart: true,
  timeEnd: true,
  allDay: true,
}).partial();
export type UpdateTimeAndDateEventSchemaType = z.infer<typeof UpdateTimeAndDateEventSchema>;

export const UpdateTitleAndDescriptionEventSchema = EventSchema.pick({
  title: true,
  description: true,
}).partial();

export type UpdateTitleAndDescriptionEventSchemaType = z.infer<
  typeof UpdateTitleAndDescriptionEventSchema
>;
