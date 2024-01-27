import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      groupchatId: string;
      userId: string;
    };
  }
) {
  const { groupchatId, userId } = params;
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const groupChats = await prisma.groupChat.findUnique({
    where: {
      id: groupchatId,
    },
  });

  if (!groupChats) {
    return NextResponse.json(
      { message: "GroupChat not found" },
      { status: 404 }
    );
  }

  try {
    // remove student from groupchat
    const groupChat = await prisma.groupChat.update({
      where: {
        id: groupchatId,
      },
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    return NextResponse.json(groupChat);
  } catch (error) {
    console.log("[GROUPCHAT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
