import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/utils";
import { PostSchemaType, UpdatePostSchema } from "@/schema/post";
import { PostType } from "@prisma/client";

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

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        type: type ? (type.toUpperCase() as PostType) : undefined,
        isArchived: false,
      },
      include: {
        comments: {
          include: {
            user: {
              select: {
                profile: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                id: true,
                image:true,
              },
            },
          },
        },
        user: {
          select: {
            profile: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            id: true,
            image:true,
          },
        },
        photos: true,
        department: true,
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
    include: {
      comments: {
        include: {
          user: {
            select: {
              profile: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
              id: true,
              image:true,
            },
          },
        },
      },
      user: {
        select: {
          profile: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          id: true,
          image:true,
        },
      },
      photos: true,
      department: true,
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

  const { department, photos, type, description, title, company, location } = result.data;

  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        description,
        company,
        location,
        type,
        // userId: currentUser.id,
      },
    });

    // if photos update
    if (photos) {
      await prisma.photos.deleteMany({
        where: {
          postId: postId,
        },
      });

      //TODO: DELETE ASSETS FROM CLOUDINARY

      await prisma.photos.createMany({
        data: photos.map((photo) => ({
          postId: postId,
          public_url: photo.public_url,
          public_id: photo.public_id,
        })),
      });
    }

    // if department update post department
    if (department) {
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          department: {
            disconnect: posts.department.map((department) => ({ id: department.id })),
            connect: department.map((id) => ({ id })),
          },
        },
      });
    }

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
