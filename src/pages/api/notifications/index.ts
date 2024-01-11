import getCurrentUserPages from "@/actions/getCurrentUser-pages";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { CreateNotificationSchema } from "@/schema/notification";
import { NextApiResponseServerIo } from "@/types/types";
import { NextApiRequest } from "next";
import { truncateByDomain } from "recharts/types/util/ChartUtils";

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
        GET /api/notifications
    */
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          userId: currentUser.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          type: true,
          content: true,
          isRead: true,
          createdAt: true,
          updatedAt:true,
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
          usersWhoInteract:true,
          
        },
      });

      return res.status(200).json(notifications);
    } catch (error) {
      console.log("[NOTIFICATION_GET]", error);
      return res.status(500).json({ message: "Internal error" });
    }
  } else if (req.method === "POST") {
    /* 
        POST /api/notifications
    */
    try {
      const result = CreateNotificationSchema.safeParse(req.body);

      if (!result.success) {
        console.log("[NOTIFICATION_POST]", result.error);
        return res.status(400).json({
          errors: result.error.flatten().fieldErrors,
          message: "Invalid body parameter",
        });
      }

      const { type, content, userId, postId, commentId, likeId } = result.data;

      // check if user exists
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // check if post exists

      if (postId) {
        const post = await prisma.post.findUnique({
          where: {
            id: postId,
          },
        });

        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
      }

      // check if comment exists
      if (commentId) {
        const comment = await prisma.comment.findUnique({
          where: {
            id: commentId,
          },
        });

        if (!comment) {
          return res.status(404).json({ message: "Comment not found" });
        }
      }

      // check if like exists
      if (likeId) {
        const like = await prisma.like.findUnique({
          where: {
            id: likeId,
          },
        });

        if (!like) {
          return res.status(404).json({ message: "Like not found" });
        }
      }

      const notification = await prisma.notification.create({
        data: {
          type,
          content,
          userId: userId,
          postId: postId,
          likeId: likeId,
        },
      });

      return res.status(200).json(notification);
    } catch (error) {
      console.log("[NOTIFICATION_POST]", error);
      return res.status(500).json({ message: "Internal error" });
    }
  } else {
    // Handle any other HTTP method
    return res.status(405).json({ message: "Invalid HTTP method!" });
  }
}
