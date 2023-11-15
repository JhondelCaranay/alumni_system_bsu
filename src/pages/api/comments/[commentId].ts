import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { UpdateCommentSchema, CreateReplySchema } from "@/schema/comment";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { commentId } = req.query;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // const currentUser = {
  //   id: "clo6w1zfq0007v9q8yieljh9r",
  // };
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId as string,
      isArchived: false,
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

  if (!comment) {
    return res.status(200).json({
      message: "Comment not found",
    });
  }

  if (req.method === "POST") {
    const result = await CreateReplySchema.safeParseAsync(req.body);

    if (!result.success) {
      console.log("[COMMENT_POST]", result.error);
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
        message: "Invalid request body",
      });
    }

    try {
      const updatedComment = await prisma.comment.update({
        where: {
          id: comment.id,
          isArchived: false,
        },
        data: {
          replies: {
            create: {
              description: result.data.description,
              userId: currentUser.id,
            },
          },
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

      return res.status(200).json(updatedComment);
    } catch (error) {
      console.log("[COMMENT_POST]", error);
      return res.status(500).json({ message: "Internal error" });
    }
  }

  if (req.method === "GET") {
    /* 
      GET /api/comments/[commentId]
    */
    return res.status(200).json(comment);
  } else if (req.method === "PATCH") {
    /* 
      PATCH /api/comments/[commentId]
    */
    const result = await UpdateCommentSchema.safeParseAsync(req.body);

    if (!result.success) {
      console.log("[COMMENT_PATCH]", result.error);
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
        message: "Invalid request body",
      });
    }

    try {
      const updatedComment = await prisma.comment.update({
        where: {
          id: comment.id,
          isArchived: false,
        },
        data: result.data,
      });

      return res.status(200).json(updatedComment);
    } catch (error) {
      console.log("[COMMENT_PATCH]", error);
      return res.status(500).json({ message: "Internal error" });
    }
  } else {
    // Handle any other HTTP method
    return res.status(405).json({ message: "Invalid HTTP method!" });
  }
}
