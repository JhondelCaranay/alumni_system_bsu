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
      groupChatId: string;
      studentId: string;
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
    // remove student from groupchat
    const groupChat = await prisma.groupChat.update({
      where: {
        id: groupChatId,
      },
      data: {
        students: {
          disconnect: {
            id: params.studentId,
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
