import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { CreatePostSchema, PostSchemaType } from "@/schema/post";
import { Post, PostType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type");

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        isArchived: false,
        type: type ? (type.toUpperCase() as PostType) : undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        comments: {
          include: {
            user: {
              select: {
                profile: true,
                name: true,
                email: true,
                image:true,
                role: true,
                createdAt: true,
                id: true,
              },
            },
          },
        },
        user: {
          select: {
            profile: true,
            name: true,
            email: true,
            image:true,
            role: true,
            createdAt: true,
            id: true,
          },
        },
        photos: true,
        department: true,
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

  const { department, photos, type, description, title, company, location } = result.data;

  try {
    let post:Post;

    if(type === 'FEED') {
       post = await prisma.post.create({
        data: {
          title,
          description,
          company,
          location,
          type,
          userId: currentUser.id,
          photos: {
            create: photos?.map((photo) => ({
              public_id: photo.public_id,
              public_url: photo.public_url,
            })),
          },
          department: {
            connect: department?.map((id) => ({ id })),
          },
        },
      });
    }

    else  {
      post = await prisma.post.create({
        data: {
          title,
          description,
          company,
          location,
          type,
          userId: currentUser.id,
        },
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.log("[POST_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
