import getCurrentUserPages from "@/actions/getCurrentUser-pages";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import {
  CreateNotificationSchema,
  UpdateNotificationSchema,
} from "@/schema/notification";
import { NextApiResponseServerIo } from "@/types/types";
import { NextApiRequest } from "next";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  const { notificationId } = req.query;

  const currentUser = await getCurrentUserPages(req, res);

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    /* 
            GET /api/notifications/:notificationId
    */
    try {
      // get current user notifications where isRead is false
      const notifications = await prisma.notification.findUnique({
        where: {
          id: notificationId as string,
          isRead: false,
          userId: currentUser.id,
        },
        select: {
          id: true,
          type: true,
          content: true,
          isRead: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          post: true,
          comment: true,
          like: true,
        },
      });

      return res.status(200).json(notifications);
    } catch (error) {
      console.log("[NOTIFICATION_GET]", error);
      return res.status(500).json({ message: "Internal error" });
    }
  } else if (req.method === "PATCH") {
    /* 
            PATCH /api/notifications/:notificationId
    */
    try {
      const result = UpdateNotificationSchema.safeParse(req.body);

      if (!result.success) {
        console.log("[NOTIFICATION_POST]", result.error);
        return res.status(400).json({
          errors: result.error.flatten().fieldErrors,
          message: "Invalid body parameter",
        });
      }

      const { isRead } = result.data;

      const notification = await prisma.notification.update({
        where: {
          id: notificationId as string,
        },
        data: {
          isRead: isRead,
        },
      });

      return res.status(200).json(notification);
    } catch (error) {
      console.log("[NOTIFICATION_PATCH]", error);
      return res.status(500).json({ message: "Internal error" });
    }
  } else {
    // Handle any other HTTP method
    return res.status(405).json({ message: "Invalid HTTP method!" });
  }
}
