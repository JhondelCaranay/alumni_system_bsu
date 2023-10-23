import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {

  try {
    const users = await prisma.user.findMany({
      where: {
        archive: false,
        role: {
          not: Role.ADMIN
        }
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
