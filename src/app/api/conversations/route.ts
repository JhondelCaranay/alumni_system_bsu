import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { CreateConversationSchema } from "@/schema/conversation";
import { CreateGroupChatSchema } from "@/schema/groupchats";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const GetConversationQueriesSchema = z.object({
    userId: z.string().optional(),
  });

  const queries = Object.fromEntries(req.nextUrl.searchParams.entries());
  const result = await GetConversationQueriesSchema.safeParseAsync(queries);

  if (!result.success) {
    console.log("Invalid query parameters", result.error.flatten().fieldErrors);
    return new NextResponse("Invalid query parameters", { status: 400 });
  }

  const { userId } = result.data;
  console.log("🚀 ~ file: route.ts:29 ~ GET ~ userId:", userId)
  try {
    const conversations = await prisma.conversation.findMany({
      where: currentUser.role === Role.ADMIN ? undefined : {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        participants:{
          include: {
            profile:true,
          },
        },
        messages:{
          orderBy: {
            createdAt: 'asc'
          }
        },
      }
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.log("[CONVERSATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


const createOrUpdateConversation = async (currentUserId:string, userId: string, message:string) => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      participants: {
        some: {
          id: userId
        }
      }
    },
    include: {
      participants:{
        include: {
          profile:true,
        },
      },
      messages:true,
    }
  })

  if(conversation) {
    const conversationExist = conversation.participants.find((user) => user.id === currentUserId)
    if(conversationExist && conversation.id) {
      const updateConversation = await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          updatedAt: new Date(),
          messages: {
            create: {
              content: message,
              senderId: currentUserId
            }
          }
        }
      })
      return updateConversation
    }

    return null;
  }

  const createConversation = await prisma.conversation.create({
    data: {
      messages: {
        create: {
          content: message,
          senderId: currentUserId
        }
      },
      participants: {
        connect: [
          {
            id: currentUserId,
          },
          {
            id: userId,
          }
        ]
      }
    }
  })

  return createConversation
}

export async function POST(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ADMIN", "ADVISER"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await CreateConversationSchema.safeParseAsync(await req.json());

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
  const { userIds, message } = result.data;


  try {
  // check if some user already have a conversation then update or create the conversation

    const users = await Promise.all(
      userIds.map((userId) => createOrUpdateConversation(currentUser.id, userId, message))
    );

    console.log(users)
    return NextResponse.json(users);
  } catch (error) {
    console.log("[GROUPCHATS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
