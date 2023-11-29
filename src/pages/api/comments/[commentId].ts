import getCurrentUserPages from "@/actions/getCurrentUser-pages";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { UpdateCommentSchema, CreateReplySchema } from "@/schema/comment";
import { allowedUserFields } from "@/schema/users";
import { NextApiResponseServerIo } from "@/types/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  const { commentId } = req.query;

  // always use this in /pages/api it needs req, res arguments
  const currentUser = await getCurrentUserPages(req, res);

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

  if (!comment) {
    return res.status(200).json({
      message: "Comment not found",
    });
  }

  if (req.method === "POST") {
    console.log("commentId post");
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
      const Key = `posts:${updatedComment.postId}:reply`;
      res.socket?.server?.io.emit(Key, updatedComment);
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
