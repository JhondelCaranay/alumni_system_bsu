import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { CreateGroupChatSchema } from "@/schema/groupchats";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const GetGroupChatsQueriesSchema = z.object({
    userId: z.string().optional(),
  });

  const queries = Object.fromEntries(req.nextUrl.searchParams.entries());
  const result = await GetGroupChatsQueriesSchema.safeParseAsync(queries);

  if (!result.success) {
    console.log("Invalid query parameters", result.error.flatten().fieldErrors);
    return new NextResponse("Invalid query parameters", { status: 400 });
  }

  const { userId } = result.data;

  try {
    const groupChats = await prisma.groupChat.findMany({
      where: {
        users: {
          every: {
            id: userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        users: true,
        section: true,
        department: true,
      },
    });

    return NextResponse.json(groupChats);
  } catch (error) {
    console.log("[GROUPCHATS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ADMIN", "ADVISER"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await CreateGroupChatSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[GROUPCHATS_POST]", result.error);

    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }
  const { name, adviserId, departmentId, sectionId, year } = result.data;

  // check if groupChat already exist
  const groupChatExists = await prisma.groupChat.findFirst({
    where: {
      name,
    },
  });

  if (groupChatExists) {
    return NextResponse.json(
      { message: "Groupchat already exist" },
      { status: 400 }
    );
  }

  // check if department exist
  const department = await prisma.department.findFirst({
    where: {
      id: departmentId,
    },
  });

  if (!department) {
    return NextResponse.json(
      { message: "Department does not exist" },
      { status: 400 }
    );
  }

  // check if section exist
  const section = await prisma.section.findFirst({
    where: {
      id: sectionId,
    },
  });

  if (!section) {
    return NextResponse.json(
      { message: "Section does not exist" },
      { status: 400 }
    );
  }

  // check if adviser exist
  if (adviserId) {
    const adviser = await prisma.user.findFirst({
      where: {
        id: adviserId,
      },
    });

    if (!adviser) {
      return NextResponse.json(
        { message: "Adviser does not exist" },
        { status: 400 }
      );
    }
  }

  try {
    const groupChat = await prisma.groupChat.create({
      data: {
        name,
        departmentId,
        sectionId,
        year,
        users: {
          connect: {
            id: adviserId,
          },
        },
      },
    });

    return NextResponse.json(groupChat);
  } catch (error) {
    console.log("[GROUPCHATS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
