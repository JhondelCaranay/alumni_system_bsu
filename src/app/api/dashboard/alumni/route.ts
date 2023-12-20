import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
export async function GET(req: NextRequest) {
  try {
    const GetPostsQueriesSchema = z.object({
      year_span: z.coerce.number(),
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

    const { year_span } = result.data;

    interface GraduationData {
      id: number;
      year: number;
      graduates: number;
    }

    const graduationData: GraduationData[] = [];

    /* 
        get graduates count per year
    */
    for (let i = 0; i < year_span; i++) {
      const currentYear = new Date().getFullYear() - i; // 2021 - 0 = 2021, 2021 - 1 = 2020, 2021 - 2 = 2019, etc.
      const startDate = new Date(currentYear, 0, 1, 0, 0, 0, 0); // January 1st, 00:00:00
      const endDate = new Date(currentYear + 1, 0, 1, 0, 0, 0, 0); // January 1st of the next year, 00:00:00

      const graduates = await prisma.profile.count({
        where: {
          user: {
            role: "ALUMNI",
          },
          yearGraduated: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      graduationData.push({
        id: i + 1,
        year: currentYear,
        graduates: graduates || 0,
      });
    }

    return NextResponse.json(graduationData);
  } catch (error) {
    console.log("[DASHBOARD_ALUMNI_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
