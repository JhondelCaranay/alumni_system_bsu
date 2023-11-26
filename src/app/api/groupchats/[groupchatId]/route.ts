import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { UpdateGroupChatSchema } from "@/schema/groupchats";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      groupChatId: string;
    };
  }
) {
  const { groupChatId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const groupChats = await prisma.groupChat.findUnique({
      where: {
        id: groupChatId,
      },
      include: {
        students: true,
        adviser: true,
        section: true,
        department: true,
      },
    });

    if (!groupChats) {
      return NextResponse.json(
        { message: "GrougroupChat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(groupChats);
  } catch (error) {
    console.log("[GROUgroupChat_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      groupChatId: string;
    };
  }
) {
  const { groupChatId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const groupChats = await prisma.groupChat.findUnique({
    where: {
      id: groupChatId,
    },
  });

  if (!groupChats) {
    return NextResponse.json(
      { message: "GroupChat not found" },
      { status: 404 }
    );
  }

  const result = await UpdateGroupChatSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[GROUPCHAT_PATCH]", result.error);
    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  const groupChatExists = await prisma.groupChat.findFirst({
    where: {
      name: result.data.name,
    },
  });

  if (groupChatExists && groupChatExists.id !== groupChatId) {
    return NextResponse.json(
      { message: "GroupChat already exist" },
      { status: 400 }
    );
  }

  try {
    const updatedGroupChat = await prisma.groupChat.update({
      where: {
        id: groupChatId,
      },
      data: result.data,
    });

    return NextResponse.json(updatedGroupChat);
  } catch (error) {
    console.log("[GROUPCHAT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      groupChatId: string;
    };
  }
) {
  const { groupChatId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const groupChats = await prisma.groupChat.findUnique({
    where: {
      id: groupChatId,
    },
  });

  if (!groupChats) {
    return NextResponse.json(
      { message: "GroupChat not found" },
      { status: 404 }
    );
  }

  try {
    // const archivedGroupChat = await prisma.groupChat.update({
    //   where: {
    //     id: groupChatId,
    //   },
    //   data: {
    //     isArchived: true,
    //   },
    // });
    // delete groupChat
    const groupChat = await prisma.groupChat.delete({
      where: {
        id: groupChatId,
      },
    });

    return NextResponse.json(groupChat);
  } catch (error) {
    console.log("[GROUPCHAT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
