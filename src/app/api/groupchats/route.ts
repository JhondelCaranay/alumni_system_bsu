import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { CreateGroupChatSchema } from "@/schema/groupchats";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const groupChats = await prisma.groupChat.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        students: true,
        adviser: true,
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

  // Check if groupChat already exists
  const groupChatExists = await prisma.groupChat.findFirst({
    where: {
      name: result.data.name,
    },
  });

  if (groupChatExists) {
    return NextResponse.json(
      { message: "GroupChat already exist" },
      { status: 400 }
    );
  }

  try {
    const groupChat = await prisma.groupChat.create({
      data: result.data,
    });

    return NextResponse.json(groupChat);
  } catch (error) {
    console.log("[GROUPCHATS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
