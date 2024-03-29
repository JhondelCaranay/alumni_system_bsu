import getCurrentUser from "@/actions/getCurrentUser";
import getCurrentUserPages from "@/actions/getCurrentUser-pages";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { CreateCommentSchema } from "@/schema/comment";
import { allowedUserFields } from "@/schema/users";
import { NextApiResponseServerIo } from "@/types/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  const currentUser = await getCurrentUserPages(req, res);

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // const currentUser = {
  //   id: "clo6w1zfq0007v9q8yieljh9r",
  // };
  if (req.method === "GET") {
    /* 
      GET /api/comments
    */
    const QuerySchema = z.object({
      postId: z.string().optional(),
    });

    const result = QuerySchema.safeParse(req.query);

    if (!result.success) {
      console.log("[COMMENTS_GET]", result.error);
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
        message: "Invalid query parameter",
      });
    }

    try {
      const comments = await prisma.comment.findMany({
        where: {
          AND: [
            {
              isArchived: false,
              postId: result.data.postId,
            },
            {
              postId: {
                not: null,
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
        include: {
          user: {
            select: allowedUserFields,
          },
          replies: {
            where: {
              isArchived:false
            },
            include: {
              user: {
                select: allowedUserFields,
              },
            },
          },
        },
      });

      return res.status(200).json(comments);
    } catch (error) {
      console.log("[COMMENTS_GET]", error);
      return res.status(500).json({ message: "Internal error" });
    }
  } else if (req.method === "POST") {
    /* 
      POST /api/comments
    */
    const result = CreateCommentSchema.safeParse(req.body);

    if (!result.success) {
      console.log("[COMMENTS_POST]", result.error);
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameter",
      });
    }

    try {
      const post = await prisma.post.findUnique({
        where: {
          id: result.data.postId
        }
      })

      if(!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = await prisma.comment.create({
        data: {
          ...result.data,
          userId: currentUser.id,
        },
        include: {
          user: {
            select: allowedUserFields,
          },
          replies: {
            include: {
              user: {
                select: allowedUserFields,
              },
            },
          },
        },
      });

      if(currentUser.id !== post.userId) {
          const notification = await prisma.notification.create({
            data: {
              content: `${currentUser.profile?.firstname} ${currentUser.profile?.lastname} commented on your post`,
              userId: post.userId,
              commentId: comment.id,
              postId: post.id,
              usersWhoInteract: {
                connect: {
                  id: currentUser.id,
                },
              },
              type: 'COMMENT_ON_POST'
            },
            include: {
              comment:true,
              like:true,
              post:true,
              user:true,
              usersWhoInteract:true
            }
          });
          // socket here (optional)
          const Key = `notification:${post.userId}:create`;
          console.log("new notification socket:", Key);

          res.socket?.server?.io.emit(Key, notification);
      }

      const Key = `posts:${result.data.postId}:comments`;

      console.log("new message socket:", Key);
      res.socket?.server?.io.emit(Key, comment);

      return res.status(200).json(comment);
    } catch (error) {
      console.log("[COMMENTS_POST]", error);
      return res.status(500).json({ message: "Internal error" });
    }

    // Process a POST request
  } else {
    // Handle any other HTTP method
    return res.status(405).json({ message: "Invalid HTTP method!" });
  }
}
