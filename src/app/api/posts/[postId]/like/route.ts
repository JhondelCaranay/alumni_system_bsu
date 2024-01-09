import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      postId: string;
    };
  }
) {
  try {
    const { postId } = params;

    const currentUser = await getCurrentUser();

    if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // get post by id
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    // check if post exists
    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    // check if user has already liked unlike post else like post
    const like = await prisma.like.findFirst({
      where: {
        postId,
        userId: currentUser.id,
      },
    });

    if (like) {
      await prisma.like.delete({
        where: {
          id: like.id,
        },
      });

      return NextResponse.json({addedLike: false}, { status: 200 });
    } else {
      await prisma.like.create({
        data: {
          post: {
            connect: {
              id: postId,
            },
          },
          user: {
            connect: {
              id: currentUser.id,
            },
          },
        },
      });

      return NextResponse.json({addedLike: true}, { status: 200 });
    }
  } catch (error) {
    console.log("[LIKE_UNLIKE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
