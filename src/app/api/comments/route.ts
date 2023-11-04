import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/utils";
import { CreateCommentSchema } from "@/schema/comment";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  const {searchParams} = new URL(req.url)

  const postId = searchParams.get('postId')

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        isArchived: false,
        postId: postId ? postId : undefined
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
          }
        }
      }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.log("[COMMENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await CreateCommentSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[COMMENTS_POST]", result.error);

    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        ...result.data,
        userId: currentUser.id,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.log("[COMMENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
