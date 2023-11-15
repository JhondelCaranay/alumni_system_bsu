import getCurrentUser from "@/actions/getCurrentUser";
import getCurrentUserPages from "@/actions/getCurrentUser-pages";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { CreateCommentSchema } from "@/schema/comment";
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
        include: {
          user: {
            select: {
              profile: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
              id: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  profile: true,
                  name: true,
                  email: true,
                  role: true,
                  createdAt: true,
                  id: true,
                },
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
      const comment = await prisma.comment.create({
        data: {
          ...result.data,
          userId: currentUser.id,
        },
        include: {
          user: {
            select: {
              profile: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
              id: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  profile: true,
                  name: true,
                  email: true,
                  role: true,
                  createdAt: true,
                  id: true,
                },
              },
            },
          },
        },
      });

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
