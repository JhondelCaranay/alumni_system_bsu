import { Notification, NotificationType } from "@prisma/client";
import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NotificationType),
  content: z.string(),
  isRead: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  postId: z.string().nullable(),
  commentId: z.string().nullable(),
  likeId: z.string().nullable(),
}) satisfies z.ZodType<Notification>;

// create notification
export const CreateNotificationSchema = NotificationSchema.pick({
  type: true,
  content: true,
  userId: true,
  postId: true,
  commentId: true,
  likeId: true,
}).partial({
  postId: true,
  commentId: true,
  likeId: true,
});

export type NotificationSchemaType = z.infer<typeof NotificationSchema>;

// update notification
export const UpdateNotificationSchema = NotificationSchema.pick({
  isRead: true,
}).partial({
  isRead: true,
});

export type UpdateNotificationSchemaType = z.infer<
  typeof UpdateNotificationSchema
>;
