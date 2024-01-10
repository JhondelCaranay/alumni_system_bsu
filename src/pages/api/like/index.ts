import getCurrentUser from "@/actions/getCurrentUser";
import getCurrentUserPages from "@/actions/getCurrentUser-pages";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { NextApiResponseServerIo } from "@/types/types";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { MdCatchingPokemon } from "react-icons/md";

export default async function hanlder(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  try {
    const { postId } = req.query;
    const currentUser = await getCurrentUserPages(req, res);
    if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
      return res.status(401).json("Unauthorize");
    }

    if (!postId) {
      return res.status(400).json("Post ID missing");
    }

    // get post by id

    const post = await prisma.post.findUnique({
      where: {
        id: postId as string,
      },
    });

    if (!post) {
      return res.status(400).json("Post missing");
    }

    if (req.method === "POST") {
      const like = await prisma.like.findFirst({
        where: {
          postId: postId as string,
          userId: currentUser.id,
        },
      });
      // check if the notification is exist with this post
      const notificationExist = await prisma.notification.findFirst({
        where: {
          postId: postId as string,
        },
        include: {
          usersWhoInteract: true,
        },
      });
      // if already liked, delete the like
      if (like) {
        await prisma.like.delete({
          where: {
            id: like.id,
          },
        });

        // check if currentUser is not equal to the one who post
        // we dont want to create a notification if the one who post is the current user
        if (currentUser.id !== post.userId) {
          if (notificationExist) {
            const updatedNotification = await prisma.notification.update({
              where: {
                id: notificationExist.id,
              },
              data: {
                content: `${
                  notificationExist.usersWhoInteract.length - 1
                } people liked your post`,
                usersWhoInteract: {
                  disconnect: {
                    id: currentUser.id,
                  },
                },
              },
            });
            // socket here (optional)
          }
        }

        return res.status(200).json({ addedLike: false });
      } else {
        // creating like and notification
        const like = await prisma.like.create({
          data: {
            post: {
              connect: {
                id: postId as string,
              },
            },
            user: {
              connect: {
                id: currentUser.id,
              },
            },
          },
        });

        // check if currentUser is not equal to the one who post
        // we dont want to create a notification if the one who post is the current user
        if (currentUser.id !== post.userId) {
          if (!notificationExist) {
            const createdNotification = await prisma.notification.create({
              data: {
                content: `${currentUser.profile?.firstname} ${currentUser.profile?.lastname} liked your post`,
                type: "POST_LIKE",
                userId: post.userId,
                postId: postId as string,
                usersWhoInteract: {
                  connect: {
                    id: currentUser.id,
                  },
                },
              },
            });
            // socket here
          } else {
            const updatedNotification = await prisma.notification.update({
              where: {
                id: notificationExist.id,
              },
              data: {
                content: `${
                  notificationExist.usersWhoInteract.length + 1
                } people liked your post`,
                usersWhoInteract: {
                  connect: {
                    id: currentUser.id,
                  },
                },
              },
            });
          }
          // socket here
        }
        return res.status(200).json({ addedLike: true });
      }
    } else {
      return res.status(500).json({ message: "Internal error" });
    }
  } catch (error) {
    console.log("[LIKE_UNLIKE_POST]", error);
    return res.status(405).json({ message: "Invalid HTTP method!" });
  }
}
