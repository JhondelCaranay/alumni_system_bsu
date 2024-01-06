import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { BulkUpdateStudentsSchema } from "@/schema/students";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: {} }) {
  // const currentUser = await getCurrentUser();

  // if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
  //   return new NextResponse("Unauthorized", { status: 401 });
  // }

  const result = await BulkUpdateStudentsSchema.safeParseAsync(
    await req.json()
  );

  if (!result.success) {
    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  const { students } = result.data;

  try {
    // get department
    const department = await prisma.department.findUnique({
      where: {
        id: result.data.departmentId,
      },
    });

    if (!department) {
      return new NextResponse("Department not found", { status: 404 });
    }

    // check if all students exists
    const studentNumbers = students.map((student) => student.studentNumber);

    const existingStudents = await prisma.profile.findMany({
      where: {
        studentNumber: {
          in: studentNumbers,
        },
      },
    });

    if (existingStudents.length !== students.length) {
      return new NextResponse("Students not found", { status: 404 });
    }

    // update students parallel
    await Promise.all(
      students.map(async (student) => {
        const studentdata = await prisma.profile.findFirst({
          where: {
            studentNumber: student.studentNumber,
            firstname: student.firstname,
            lastname: student.lastname,
          },
        });

        if (!studentdata || !studentdata.schoolYear || !department.courseYear) {
          return;
        }

        await prisma.profile.update({
          where: {
            id: studentdata.id,
          },
          data: {
            schoolYear: {
              increment: 1,
            },
            user: {
              update: {
                role:
                  studentdata.schoolYear + 1 > department.courseYear
                    ? "ALUMNI"
                    : undefined,
              },
            },
          },
        });

        console.log("====================================");
        console.log("schoolYear", studentdata.schoolYear + 1);
        console.log("courseYear", department.courseYear);
        console.log("====================================");
      })
    );

    return new NextResponse("Successfully updated students", { status: 200 });
  } catch (error) {
    console.log("[POST_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
