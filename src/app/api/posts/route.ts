import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { CreatePostSchema } from "@/schema/post";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        isArchived: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.log("[POSTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await CreatePostSchema.safeParseAsync(await req.json());

  if (!result.success) {
    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.post.create({
      data: {
        ...result.data,
        userId: currentUser.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log("[POST_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}