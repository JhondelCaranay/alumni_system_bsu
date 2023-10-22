import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const queriesSchema = z.object({
  role: z.enum([Role.STUDENT, Role.ALUMNI, "ALL"]).optional().default("ALL"),
  schoolYear: z.coerce.number().optional(),
  department: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const searchParams = req.nextUrl.searchParams;
  const queries = Object.fromEntries(searchParams.entries());
  const result = await queriesSchema.safeParseAsync(queries);

  if (!result.success) {
    console.log("[STUDENTS_GET]", result.error.errors);
    return new NextResponse("Invalid query parameters", { status: 400 });
  }

  const { role, schoolYear, department } = result.data;

  const allowedRoles = role === "ALL" ? [Role.STUDENT, Role.ALUMNI] : [role];

  try {
    const students = await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        role: {
          in: allowedRoles,
        },
        profile: {
          schoolYear: schoolYear || undefined,
        },
        department: {
          name: department || undefined,
        },
      },
      include: {
        profile: true,
        department: true,
      },
    });

    const safeStudents = students.map((student) => {
      const { hashedPassword, ...rest } = student;
      return rest;
    });

    return NextResponse.json(safeStudents);
  } catch (error) {
    console.log("[STUDENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
