import getCurrentUserPages from "@/actions/getCurrentUser-pages";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { UpdateCommentSchema, CreateReplySchema } from "@/schema/comment";
import { allowedUserFields } from "@/schema/users";
import { NextApiResponseServerIo } from "@/types/types";
import { update } from "autosize";
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
      post:true
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

      if(currentUser.id !== updatedComment.userId) {
        const notificationForWhoGotReplied = await prisma.notification.create({
          data: {
            content: `${currentUser.profile?.firstname} ${currentUser.profile?.lastname} replied on your comment`,
            userId: updatedComment.userId,
            postId:comment.post?.id,
            commentId: comment.id,
            usersWhoInteract: {
              connect: {
                id: currentUser.id,
              },
            },
            type: 'REPLY_TO_COMMENT'
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
        // notification for the one who got replied
        const notificationForWhoGotRepliedKey = `notification:${updatedComment.userId}:create`;
        res.socket?.server?.io.emit(notificationForWhoGotRepliedKey, notificationForWhoGotReplied);

        if(comment.post?.userId !== updatedComment.userId) {
          const notificationForWhoPost = await prisma.notification.create({
            data: {
              content: `${currentUser.profile?.firstname} ${currentUser.profile?.lastname} replied to a comment on your post`,
              userId: comment.post?.userId as string,
              postId:comment.post?.id,
              commentId: comment.id,
              usersWhoInteract: {
                connect: {
                  id: currentUser.id,
                },
              },
              type: 'REPLY_TO_COMMENT'
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
         // notification for the one who posted
          const notificationForWhoPostKey = `notification:${comment.post?.userId}:create`;
        res.socket?.server?.io.emit(notificationForWhoPostKey, notificationForWhoPost);
        }
    }

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
        include: {
          user: {
            select: allowedUserFields,
          },
          comment:{
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
          },
          replies: {
            include: {
              user: {
                select: allowedUserFields,
              },
            },
          },
        },
        data: result.data,
      });
      const Key = `posts:comment-update`;
      
      res.socket?.server?.io.emit(Key, updatedComment);
      return res.status(200).json(updatedComment);
    } catch (error) {
      console.log("[COMMENT_PATCH]", error);
      return res.status(500).json({ message: "Internal error" });
    }
  } else if(req.method === "DELETE")  {
    try {
      const deletedComment = await prisma.comment.update({
        where: {
          id: comment.id,
          isArchived: false,
        },
        
        include: {
          user: {
            select: allowedUserFields,
          },
          comment:{
            include: {
              user: {
                select: allowedUserFields,
              },
              replies: {
                where: {
                  isArchived:false,
                },
                include: {
                  user: {
                    select: allowedUserFields,
                  },
                },
              },
            },
          },
          replies: {
            include: {
              user: {
                select: allowedUserFields,
              },
            },
          },
        },
        data: {
          isArchived:true
        }
      });

      const Key = `posts:comment-delete`;
      res.socket?.server?.io.emit(Key, deletedComment);
      return res.status(200).json(deletedComment);
    } catch (error) {
      console.log("[COMMENT_DELETE]", error);
      return res.status(500).json({ message: "Internal error" });
    }
  }
  else { // Handle any other HTTP method
    return res.status(405).json({ message: "Invalid HTTP method!" });
  }
}
