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
      pollOptionId: string;
    };
  }
) {
  try {
    const { postId } = params;

    const currentUser = await getCurrentUser();

    if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // const currentUser = { id: "clqf57d4b000lv970mhjowosn" };

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

    // check if user has already voted
    const hasVoted = await prisma.pollOption.findFirst({
      where: {
        postId,
        voters: {
          some: {
            id: currentUser.id,
          },
        },
      },
    });

    if (hasVoted) {
      return new NextResponse("Already voted", { status: 400 });
    }

    // get poll option by id
    const pollOption = await prisma.pollOption.findUnique({
      where: {
        id: params.pollOptionId,
      },
    });

    // check if poll option exists
    if (!pollOption) {
      return new NextResponse("Poll option not found", { status: 404 });
    }

    // update poll option
    const updatedPollOption = await prisma.pollOption.update({
      where: {
        id: params.pollOptionId,
      },
      data: {
        votes: {
          increment: 1,
        },
        voters: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    return NextResponse.json(updatedPollOption);
  } catch (error) {
    console.log("[POST_ADD_POLL]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
