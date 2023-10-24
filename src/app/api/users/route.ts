import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:Request) {
  const { searchParams } = new URL(request.url)

  const role = searchParams.get('role')
  const department = searchParams.get('department')
  
  try {
    const users = await prisma.user.findMany({
      where: {
        AND:[
          {
            archive:false
          },
          {
            role: {
              not: Role.ADMIN
            }
          },
          {
            role: role === 'All' ? undefined : role as Role,
          },
          {
            department: {
              name: department === 'All' ? undefined : department as string
            }
          }
        ]
      },
      orderBy: {
        name: "asc",
      },
      include: {
        profile: true,
        department: true,
      },
    });

    const safeUsers = users.map((user) => {
      const { hashedPassword, ...rest } = user;
      return rest;
    });

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.log("[USERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
