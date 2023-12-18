import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: Request) {
  try {
    const students = prisma.user.count({
      where: {
        role: "STUDENT",
        profile: {
          isDropOut: false,
          yearGraduated: null,
        },
      },
    });

    const alumni = prisma.user.count({
      where: {
        role: "ALUMNI",
        profile: {
          isDropOut: false,
          yearGraduated: { not: null },
        },
      },
    });

    // find Alumni and Students that is isEmployed
    const student_alumni_with_jobs = prisma.user.count({
      where: {
        profile: {
          isEmployed: true,
        },
        role: {
          in: ["ALUMNI", "STUDENT"],
        },
      },
    });

    // count all upcoming events that is not yet ucurred
    const upcomming_events = prisma.event.count({
      where: {
        dateStart: {
          gt: new Date(),
        },
      },
    });

    // promise all
    const data = await Promise.all([
      students,
      alumni,
      student_alumni_with_jobs,
      upcomming_events,
    ]);

    return NextResponse.json({
      students: data[0],
      alumni: data[1],
      student_alumni_with_jobs: data[2],
      upcomming_events: data[3],
    });
  } catch (error) {
    console.log("[DASHBOARD_TOTALS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
