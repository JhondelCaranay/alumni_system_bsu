import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const GetPostsQueriesSchema = z.object({
      departmentId: z.string(),
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

    const { departmentId } = result.data;

    interface JobsPerYear {
      id: number;
      year: number;
      studentsWithJob: number;
      alumniWithJob: number;
    }

    const jobsPerYear: JobsPerYear[] = [];
    const year_span = 10;
    /* 
        get students with jobs per year
    */
    for (let i = 0; i < year_span; i++) {
      const currentYear = new Date().getFullYear() - i; // 2021 - 0 = 2021, 2021 - 1 = 2020, 2021 - 2 = 2019, etc.
      const startDate = new Date(currentYear, 0, 1, 0, 0, 0, 0); // January 1st, 00:00:00
      const endDate = new Date(currentYear + 1, 0, 1, 0, 0, 0, 0); // January 1st of the next year, 00:00:00

      const alumni = await prisma.profile.count({
        where: {
          user: {
            role: "ALUMNI",
            departmentId: departmentId,
          },
          isEmployed: true,
          yearGraduated: {
            gte: startDate,
            lt: endDate,
          },
        },
      });
      const students = await prisma.profile.count({
        where: {
          user: {
            role: "STUDENT",
            departmentId: departmentId,
          },
          isEmployed: true,
          schoolYear: {
            lte: 4,
            gte: 1,
          },
          yearEnrolled: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      jobsPerYear.push({
        id: i + 1,
        year: currentYear,
        alumniWithJob: alumni || 0,
        studentsWithJob: students || 0,
      });
    }

    return NextResponse.json(jobsPerYear);
  } catch (error) {
    console.log("[DASHBOARD_JOBS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
