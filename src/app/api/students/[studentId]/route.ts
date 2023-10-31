import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/utils";
import { Role } from "@prisma/client";
import { UpdateStudentsSchema } from "@/schema/students";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      studentId: string;
    };
  }
) {
  const { studentId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const student = await prisma.user.findUnique({
      where: {
        id: studentId,
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

    if (!student) {
      return NextResponse.json("Student not found", { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.log("[STUDENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      studentId: string;
    };
  }
) {
  const { studentId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: studentId,
      isArchived: false,
    },
  });

  if (!user) {
    return NextResponse.json("Student not found", { status: 404 });
  }

  const result = await UpdateStudentsSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[STUDENT_PATCH]", result.error);
    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  const {
    email,
    role,
    studentNumber,
    firstname,
    lastname,
    middlename,
    departmentId,
    sectionId,
    isEmployed,
    schoolYear,
    yearEnrolled,
    yearGraduated,
    alternative_email,
    age,
    religion,
    gender,
    placeOfBirth,
    dateOfBirth,
    homeNo,
    street,
    barangay,
    city,
    corUrl,
    province,
    contactNo,
  } = result.data;

  try {
    const updatedStudent = await prisma.user.update({
      where: {
        id: studentId,
      },
      data: {
        email,
        role,
        departmentId,
        sectionId,
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
    await prisma.profile.update({
      where: {
        id: updatedStudent.profile?.id,
        userId: studentId,
      },
      data: {
        studentNumber,
        firstname,
        lastname,
        middlename,
        isEmployed,
        schoolYear,
        yearEnrolled,
        yearGraduated,
        alternative_email,
        age,
        religion,
        gender,
        placeOfBirth,
        dateOfBirth,
        homeNo,
        street,
        barangay,
        city,
        corUrl,
        province,
        contactNo,
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.log("[STUDENT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      studentId: string;
    };
  }
) {
  const { studentId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const student = await prisma.user.findUnique({
    where: {
      id: studentId,
      isArchived: false,
    },
  });

  if (!student) {
    return NextResponse.json("Student not found", { status: 404 });
  }

  try {
    const archivedStudent = await prisma.user.update({
      where: {
        id: studentId,
      },
      data: {
        isArchived: true,
      },
    });

    return NextResponse.json(archivedStudent);
  } catch (error) {
    console.log("[STUDENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
