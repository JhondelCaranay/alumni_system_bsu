import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { updateStudentsSchema } from "../_schema";

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
  try {
    const { studentId } = params;

    const student = await prisma.user.findUnique({
      where: {
        id: studentId,
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        image: true,
        archive: true,
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
  try {
    const currentUser = await getCurrentUser();

    // if (!currentUser || isUserAllowed(currentUser.role, [Role.ADMIN])) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const { studentId } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!user) {
      return NextResponse.json("Student not found", { status: 404 });
    }

    const result = await updateStudentsSchema.safeParseAsync(await req.json());

    if (!result.success) {
      console.log("[STUDENT_PATCH]", result.error);
      return NextResponse.json(
        {
          errors: result.error.errors,
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
        email: true,
        emailVerified: true,
        image: true,
        archive: true,
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
  try {
    const currentUser = await getCurrentUser();

    // if (!currentUser || isUserAllowed(currentUser.role, [Role.ADMIN])) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const { studentId } = params;

    const student = await prisma.user.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return NextResponse.json("Student not found", { status: 404 });
    }

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
