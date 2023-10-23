import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: Request, {params}: {params: {userId: string}}) {

  try {
    const currentUser = await getCurrentUser()

    const {userId} = params;

    if(!userId) return new NextResponse('User ID missing', {status:400})

    if(userId === currentUser?.id) return new NextResponse("Something went wrong...", {status:400})

    const user = await prisma.user.update({
        where: {
            id: userId as string
        },
        data: {
            archive: true
        }
    })
    return NextResponse.json(user);

  } catch (error) {
    console.log("[USERS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
