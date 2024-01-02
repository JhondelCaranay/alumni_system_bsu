import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { CreatePostSchema, PostSchemaType } from "@/schema/post";
import { allowedUserFields } from "@/schema/users";
import { Post, PostType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const GetPostsQueriesSchema = z.object({
    // type: z
    //   .enum([PostType.FEED, PostType.JOBS])
    //   .transform((val) => val.toUpperCase()),
    type: z.string().transform((val) => val.toUpperCase()),
  });

  const queries = Object.fromEntries(req.nextUrl.searchParams.entries());
  const result = await GetPostsQueriesSchema.safeParseAsync(queries);

  if (!result.success) {
    console.log("[POSTS_GET]", result.error.flatten().fieldErrors);
    return new NextResponse("Invalid query parameters", { status: 400 });
  }

  const { type } = result.data;

  // const { searchParams } = new URL(req.url);
  // const type = searchParams.get("type")?.toUpperCase();

  try {
    if (type === "FEED") {
      let queryData = {};

      if (currentUser.role === "STUDENT" || currentUser.role === "ALUMNI") {
        queryData = {
          department: {
            some: {
              name: currentUser?.department?.name,
            },
          },
        };
      }

      const posts = await prisma.post.findMany({
        take: 50,
        where: {
          isArchived: false,
          ...queryData,
          type: type,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          comments: {
            include: {
              user: {
                select: allowedUserFields,
              },
            },
          },
          user: {
            select: allowedUserFields,
          },
          photos: true,
          department: true,
          poll_options: true,
        },
      });

      return NextResponse.json(posts);
    } else if (type === "JOBS") {
      const jobs = await prisma.post.findMany({
        take: 50,
        where: {
          isArchived: false,
          type: type,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          comments: {
            include: {
              user: {
                select: allowedUserFields,
              },
            },
          },
          user: {
            select: allowedUserFields,
          },
          photos: true,
          department: true,
        },
      });

      return NextResponse.json(jobs);
    } else {
      return new NextResponse("Invalid post type", { status: 400 });
    }
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

  const {
    department,
    photos,
    type,
    description,
    title,
    company,
    location,
    pollOptions,
    pollQuestion
  } = result.data;

  try {
    let post: Post;

    if (type === "FEED") {
      post = await prisma.post.create({
        data: {
          title,
          description,
          company,
          location,
          pollQuestion,
          type,
          userId: currentUser.id,
          photos: {
            create: photos?.map((photo) => ({
              public_id: photo.public_id,
              public_url: photo.public_url,
            })),
          },
          poll_options: {
            create: pollOptions?.map((option) => ({
              option,
            })),
          },
          department: {
            connect: department?.map((id) => ({ id })),
          },
        },
      });
    } else {
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
