import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import getCurrentUser from "@/actions/getCurrentUser";
import { isUserAllowed } from "@/lib/utils";

import { Role } from "@prisma/client";
import { z } from "zod";
import { CreateStudentsSchema } from "@/schema/students";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const GetStudentsQueriesSchema = z.object({
    role: z.enum([Role.STUDENT, Role.ALUMNI]).optional(),
    schoolYear: z.number().optional(),
    department: z.string().optional(),
  });

  const searchParams = req.nextUrl.searchParams;
  const queries = Object.fromEntries(searchParams.entries());
  const result = await GetStudentsQueriesSchema.safeParseAsync(queries);

  if (!result.success) {
    console.log("[STUDENTS_GET]", result.error.flatten().fieldErrors);
    return new NextResponse("Invalid query parameters", { status: 400 });
  }

  const { role, schoolYear, department } = result.data;

  const allowedRoles =
    role === undefined ? [Role.STUDENT, Role.ALUMNI] : [role];

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
        isArchived: false,
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
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await CreateStudentsSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[STUDENTS_POST]", result.error.errors);
    return NextResponse.json(
      {
        message: "Invalid body parameters",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const {
    studentNumber,
    firstname,
    lastname,
    middlename,
    email,
    role,
    departmentId,
    sectionId,
    age,
    barangay,
    city,
    contactNo,
    dateOfBirth,
    gender,
    homeNo,
    province,
    street,
  } = result.data;

  try {
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
        section: true,
        profile: true,
      },
    });

    // create profile
    await prisma.profile.create({
      data: {
        studentNumber: studentNumber,
        firstname,
        lastname,
        middlename,
        age: Number(age),
        barangay,
        city,
        contactNo,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        homeNo,
        province,
        street,
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
