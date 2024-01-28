import getCurrentUserPages from "@/actions/getCurrentUser-pages";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { CreateDirectMessageSchema } from "@/schema/direct-message";
import { CreateGroupChatMessageSchema } from "@/schema/groupchat-message";
import { NextApiResponseServerIo } from "@/types/types";
import { Role } from "@prisma/client";
import { NextApiRequest } from "next";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  const currentUser = await getCurrentUserPages(req, res);

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    /* 
      GET /api/groupchat/[groupchatId]/messages
    */
    const QuerySchema = z.object({
      conversationId: z.string(),
    });

    const result = QuerySchema.safeParse(req.query);

    if (!result.success) {
      console.log("[CONVERSATIONMESSAGE_GET]", result.error);
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
        message: "Invalid query parameter",
      });
    }

    try {
      const conversationMessages = await prisma.directMessage.findMany({
        where: {
          conversationId: result.data.conversationId,
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          sender: {
            include:{
              profile:true
            }
          },
        },
      });

      return res.status(200).json(conversationMessages);
    } catch (error) {
      console.log("[CONVERSATIONMESSAGE_GET]", error);
      return res.status(500).json({ message: "Internal error" });
    }
  } else if (req.method === "POST") {
    /* 
      POST /api/groupchat/[groupchatId]/messages
    */
    const QuerySchema = z.object({
      conversationId: z.string(),
    });

    const queryResult = QuerySchema.safeParse(req.query);

    if (!queryResult.success) {
      console.log("[CONVERSATIONMESSAGE_POST]", queryResult.error);
      return res.status(400).json({
        errors: queryResult.error.flatten().fieldErrors,
        message: "Invalid query parameter",
      });
    }

    const bodyResult = CreateDirectMessageSchema.safeParse(req.body);

    if (!bodyResult.success) {
      console.log("[CONVERSATIONMESSAGE_POST]", bodyResult.error);
      return res.status(400).json({
        errors: bodyResult.error.flatten().fieldErrors,
        message: "Invalid body parameter",
      });
    }

    // create groupchat message
    try {

      const directMessage = await prisma.directMessage.create({
        data: {
          content: bodyResult.data.content,
          conversationId: queryResult.data.conversationId,
          senderId: currentUser.id, // or senderId: bodyResult.data.senderId
        },
        include: {
          sender: {
            include:{
              profile:true
            }
          },
        },
      });

      const conversation = await prisma.conversation.update({
        where: {
          id: queryResult.data.conversationId
        },
        data: {
          updatedAt: new Date()
        },
        include: {
          messages:true,
          participants: {
            include: {
              profile:true
            }
          },
        },
      })

      conversation.participants.forEach((user) => {
        const Key = `inbox-conversation:${user.id}:sort`;
        res.socket?.server?.io.emit(Key, conversation);
      })

      const Key = `chats-conversation:${directMessage.conversationId}:messages`;

      console.log(Key)

      res.socket?.server?.io.emit(Key, directMessage);
      res.status(200).json(directMessage);
    } catch (error) {
      console.log("[CONVERSATIONMESSAGE_POST]", error);
      return res.status(500).json({ message: "Internal error" });
    }
  } else {
    // Handle any other HTTP method
    return res.status(405).json({ message: "Invalid HTTP method!" });
  }
}
