import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { createStudentsSchema, getStudentsQueriesSchema } from "./_schema";
import getCurrentUser from "@/actions/getCurrentUser";
import { isUserAllowed } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const queries = Object.fromEntries(searchParams.entries());
    const result = await getStudentsQueriesSchema.safeParseAsync(queries);

    if (!result.success) {
      console.log("[STUDENTS_GET]", result.error.errors);
      return new NextResponse("Invalid query parameters", { status: 400 });
    }

    const { role, schoolYear, department } = result.data;

    const allowedRoles = role === undefined ? [Role.STUDENT, Role.ALUMNI] : [role];

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
      select: {
        id: true,
        role: true,
        email: true,
        emailVerified: true,
        image: true,
        isArchived: true,
        createdAt: true,
        updatedAt: true,
        department: true,
        profile: true,
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.log("[STUDENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: {} }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || isUserAllowed(currentUser.role, [Role.ADMIN])) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const result = await createStudentsSchema.safeParseAsync(await req.json());

    if (!result.success) {
      console.log("[STUDENTS_POST]", result.error.errors);
      return NextResponse.json(
        {
          message: "Invalid body parameters",
          errors: result.error.errors,
        },
        { status: 400 }
      );
    }

    const { studentNumber, firstname, lastname, middlename, email, role, departmentId, sectionId } =
      result.data;

    const user = await prisma.user.create({
      data: {
        email,
        role,
        department: {
          connect: {
            id: departmentId,
          },
        },
        section: {
          connect: {
            id: sectionId,
          },
        },
      },
      select: {
        id: true,
        role: true,
        email: true,
        emailVerified: true,
        image: true,
        isArchived: true,
        createdAt: true,
        updatedAt: true,
        department: true,
        profile: true,
      },
    });

    // create profile
    await prisma.profile.create({
      data: {
        studentNumber,
        firstname,
        lastname,
        middlename,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[STUDENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
