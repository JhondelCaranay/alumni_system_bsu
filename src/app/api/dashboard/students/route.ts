import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";


export async function GET(req: NextRequest) {
  try {
    const GetPostsQueriesSchema = z.object({
      departmentId: z.string(),
      year: z.coerce.number(),
    });

    const queries = Object.fromEntries(req.nextUrl.searchParams.entries());
    const result = await GetPostsQueriesSchema.safeParseAsync(queries);

    if (!result.success) {
      console.log(
        "Invalid query parameters",
        result.error.flatten().fieldErrors
      );
      return new NextResponse("Invalid query parameters", { status: 400 });
    }

    const { departmentId, year } = result.data;

    interface TotalMaleFemaleStudents {
      id: number;
      year: string;
      male: number;
      female: number;
      total: number;
    }

    const totalMaleFemaleStudents: TotalMaleFemaleStudents[] = [];
    /* 
        get total male in female students 
    */
    const school_course_year = ["1ST YEAR", "2ND YEAR", "3RD YEAR", "4TH YEAR"];

    for (let i = 0; i < school_course_year.length; i++) {
      const isYearZero = year === 0;

      const startDate = new Date(year, 0, 1, 0, 0, 0, 0); // January 1st, 00:00:00
      const endDate = new Date(year + 1, 0, 1, 0, 0, 0, 0); // January 1st of the next year, 00:00:00

      const getMalesCount = await prisma.profile.count({
        where: {
          user: {
            departmentId: departmentId,
            role: "STUDENT",
          },

          gender: "MALE",
          schoolYear: i + 1,
          yearEnrolled: isYearZero
            ? undefined
            : {
                gte: startDate,
                lt: endDate,
              },
        },
      });

      const getFemalesCount = await prisma.profile.count({
        where: {
          user: {
            departmentId: departmentId,
            role: "STUDENT",
          },
          gender: "FEMALE",
          schoolYear: i + 1,
          yearEnrolled: isYearZero
            ? undefined
            : {
                gte: startDate,
                lt: endDate,
              },
        },
      });

      const getTotalCount = await prisma.profile.count({
        where: {
          user: {
            departmentId: departmentId,
            role: "STUDENT",
          },
          schoolYear: i + 1,
          yearEnrolled: isYearZero
            ? undefined
            : {
                gte: startDate,
                lt: endDate,
              },
        },
      });

      totalMaleFemaleStudents.push({
        id: i + 1,
        year: school_course_year[i],
        male: getMalesCount,
        female: getFemalesCount,
        total: getTotalCount,
      });
    }

    return NextResponse.json(totalMaleFemaleStudents);
  } catch (error) {
    console.log("[DASHBOARD_STUDENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
