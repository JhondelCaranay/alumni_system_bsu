import { Conversation } from "@prisma/client";
import { z } from "zod";

export const ConversationSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<Conversation>;

export type ConversationSchemaType = z.infer<typeof ConversationSchema>

export const CreateConversationSchema = ConversationSchema
.pick({})
.extend({
    userIds: z.array(z.string().cuid()).min(1, "Required"),
    message: z.string().min(1, "Required")
})

export type CreateConversationSchemaType = z.infer<typeof CreateConversationSchema>