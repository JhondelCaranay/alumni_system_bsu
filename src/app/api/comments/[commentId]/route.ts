import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/utils";
import { UpdateCommentSchema } from "@/schema/comment";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      commentId: string;
    };
  }
) {
  const { commentId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const comments = await prisma.comment.findUnique({
      where: {
        id: commentId,
        isArchived: false,
      },
    });

    if (!comments) {
      return NextResponse.json("Comment not found", { status: 404 });
    }

    return NextResponse.json(comments);
  } catch (error) {
    console.log("[COMMENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      commentId: string;
    };
  }
) {
  const { commentId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const comments = await prisma.comment.findUnique({
    where: {
      id: commentId,
      isArchived: false,
    },
  });

  if (!comments) {
    return NextResponse.json("Comment not found", { status: 404 });
  }

  const result = await UpdateCommentSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[COMMENT_PATCH]", result.error);
    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
        isArchived: false,
      },
      data: result.data,
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.log("[COMMENT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      commentId: string;
    };
  }
) {
  const { commentId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const comments = await prisma.comment.findUnique({
    where: {
      id: commentId,
      isArchived: false,
    },
  });

  if (!comments) {
    return NextResponse.json("Comment not found", { status: 404 });
  }

  try {
    const archivedComment = await prisma.comment.update({
      where: {
        id: commentId,
        isArchived: false,
      },
      data: {
        isArchived: true,
      },
    });

    return NextResponse.json(archivedComment);
  } catch (error) {
    console.log("[COMMENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
