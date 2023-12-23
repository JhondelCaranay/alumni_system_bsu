import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { UploadStudentsSchema } from "@/schema/groupchats";
import { NextRequest, NextResponse } from "next/server";

/* 
    UPLOAD STUDENTS IDS TO GROUPCHAT
*/

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      groupchatId: string;
    };
  }
) {
  try {
    const currentUser = await getCurrentUser();

    if (
      !currentUser ||
      !isUserAllowed(currentUser.role, ["ADMIN", "ADVISER"])
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const result = await UploadStudentsSchema.safeParseAsync(await req.json());

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

    const { userIds } = result.data;

    // Check if groupChat  exists
    const groupChatExists = await prisma.groupChat.findUnique({
      where: {
        id: params.groupchatId,
      },
    });

    if (!groupChatExists) {
      return NextResponse.json(
        { message: "GroupChat does not exist" },
        { status: 404 }
      );
    }

    const users = userIds.map((userId) => ({
      id: userId,
    }));

    const groupChat = await prisma.groupChat.update({
      where: {
        id: params.groupchatId,
      },
      data: {
        users: {
          connect: users,
        },
      },
    });

    return NextResponse.json(groupChat);
  } catch (error) {
    console.log("[GROUPCHATS_UPLOAD_USER_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
