import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, { params }: { params: {} }) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("role");

  const role =
    Role[query as keyof typeof Role] === Role.FACULTY_AlUMNI
      ? Role.FACULTY_AlUMNI
      : Role.FACULTY_STUDENT;

  try {
    const students = await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        role: role,
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.log("[STUDENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
