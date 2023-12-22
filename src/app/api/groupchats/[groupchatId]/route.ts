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
      groupchatId: string;
    };
  }
) {
  const { groupchatId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const groupChats = await prisma.groupChat.findUnique({
      where: {
        id: groupchatId,
      },
      include: {
        users: true,
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
      groupchatId: string;
    };
  }
) {
  const { groupchatId } = params;

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

  const { name, adviserId, departmentId, sectionId, year } = result.data;

  const groupChatExists = await prisma.groupChat.findFirst({
    where: {
      name: name,
    },
  });

  // check if there is a groupChat with the same name
  if (groupChatExists && groupChatExists.id !== groupchatId) {
    return NextResponse.json(
      { message: "Groupchat with same name is already exist" },
      { status: 400 }
    );
  }

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

  if (departmentId) {
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
  }

  if (sectionId) {
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
  }

  try {
    const updatedGroupChat = await prisma.groupChat.update({
      where: {
        id: groupchatId,
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
      groupchatId: string;
    };
  }
) {
  const { groupchatId } = params;

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
        id: groupchatId,
      },
    });

    return NextResponse.json(groupChat);
  } catch (error) {
    console.log("[GROUPCHAT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
