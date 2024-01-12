import getCurrentUserPages from "@/actions/getCurrentUser-pages";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { CreateGroupChatMessageSchema } from "@/schema/groupchat-message";
import { NextApiResponseServerIo } from "@/types/types";
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
      groupchatId: z.string(),
    });

    const result = QuerySchema.safeParse(req.query);

    if (!result.success) {
      console.log("[GROUPCHATMESSAGES_GET]", result.error);
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
        message: "Invalid query parameter",
      });
    }

    try {
      const groupChatMessages = await prisma.groupChatMessage.findMany({
        where: {
          groupChatId: result.data.groupchatId,
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

      return res.status(200).json(groupChatMessages);
    } catch (error) {
      console.log("[GROgroupChatMessageS_GET]", error);
      return res.status(500).json({ message: "Internal error" });
    }
  } else if (req.method === "POST") {
    /* 
      POST /api/groupchat/[groupchatId]/messages
    */
    const QuerySchema = z.object({
      groupchatId: z.string(),
    });

    const queryResult = QuerySchema.safeParse(req.query);

    if (!queryResult.success) {
      console.log("[GROUPCHATMESSAGES_POST]", queryResult.error);
      return res.status(400).json({
        errors: queryResult.error.flatten().fieldErrors,
        message: "Invalid query parameter",
      });
    }

    const bodyResult = CreateGroupChatMessageSchema.safeParse(req.body);

    if (!bodyResult.success) {
      console.log("[GROUPCHATMESSAGES_POST]", bodyResult.error);
      return res.status(400).json({
        errors: bodyResult.error.flatten().fieldErrors,
        message: "Invalid body parameter",
      });
    }

    // create groupchat message
    try {
      const groupChatMessage = await prisma.groupChatMessage.create({
        data: {
          message: bodyResult.data.message,
          groupChatId: queryResult.data.groupchatId,
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
      const Key = `chats:${groupChatMessage.groupChatId}:messages`;

      console.log(Key)

      res.socket?.server?.io.emit(Key, groupChatMessage);
      res.status(200).json(groupChatMessage);
    } catch (error) {
      console.log("[GROUPCHATMESSAGES_POST]", error);
      return res.status(500).json({ message: "Internal error" });
    }
  } else {
    // Handle any other HTTP method
    return res.status(405).json({ message: "Invalid HTTP method!" });
  }
}
