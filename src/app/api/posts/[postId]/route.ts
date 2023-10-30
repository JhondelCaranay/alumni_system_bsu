import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/utils";
import { UpdatePostSchema } from "@/schema/post";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      postId: string;
    };
  }
) {
  const { postId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        isArchived: false,
      },
    });

    if (!post) {
      return NextResponse.json("Post not found", { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.log("[POST_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      postId: string;
    };
  }
) {
  const { postId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const posts = await prisma.post.findUnique({
    where: {
      id: postId,
      isArchived: false,
    },
  });

  if (!posts) {
    return NextResponse.json("Post not found", { status: 404 });
  }

  const result = await UpdatePostSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[POST_PATCH]", result.error);
    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: result.data,
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.log("[POST_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      postId: string;
    };
  }
) {
  const { postId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const posts = await prisma.post.findUnique({
    where: {
      id: postId,
      isArchived: false,
    },
  });

  if (!posts) {
    return NextResponse.json("Post not found", { status: 404 });
  }

  try {
    const archivedPost = await prisma.post.update({
      where: {
        id: postId,
        isArchived: false,
      },
      data: {
        isArchived: true,
      },
    });

    return NextResponse.json(archivedPost);
  } catch (error) {
    console.log("[POST_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
