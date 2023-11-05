import getCurrentUser from "@/actions/getCurrentUser";
import getCurrentUserPages from "@/actions/getCurrentUser-pages";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { UpdateCommentSchema } from "@/schema/comment";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { commentId } = req.query;

  const currentUser = await getCurrentUserPages(req, res);


  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId as string,
      isArchived: false,
    },
  });

  if (!comment) {
    return res.status(200).json({
      message: "Comment not found",
    });
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
