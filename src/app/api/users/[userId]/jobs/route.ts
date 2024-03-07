import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { CreateJobSchema } from "@/schema/jobs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // const currentUser = await getCurrentUser();

    const { userId } = params;

    if (!userId) return new NextResponse("User ID missing", { status: 400 });

    // if (userId !== currentUser?.id)
    //   return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({
      where: {
        id: userId as string,
      },
    });

    if (!user) {
      return new NextResponse("User Not Found", { status: 404 });
    }

    const jobs = await prisma.job.findMany({
      where: {
        userId: userId as string,
        isArchived: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!jobs) {
      return new NextResponse("Jobs Not Found", { status: 404 });
    }
    return NextResponse.json(jobs);
  } catch (error) {
    console.log("[USERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/* 
create user job
*/
export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId } = params;

    if (!userId) return new NextResponse("User ID missing", { status: 400 });

    if (userId !== currentUser?.id)
      return new NextResponse("You can only add jobs to your profile", {
        status: 400,
      });

    const user = await prisma.user.findUnique({
      where: {
        id: userId as string,
      },
    });

    if (!user) {
      return new NextResponse("User Not Found", { status: 404 });
    }

    const result = await CreateJobSchema.safeParseAsync(await req.json());

    if (!result.success) {
      console.log("[JOBS_POST]", result.error);

      return NextResponse.json(
        {
          errors: result.error.flatten().fieldErrors,
          message: "Invalid body parameters",
        },
        { status: 400 }
      );
    }

    const { jobTitle, company, location, yearStart, yearEnd, isCurrentJob } =
      result.data;

    /* 
        if user add new current job, set all previous job to isCurrentJob false
    */
    if (isCurrentJob) {
      await prisma.job.updateMany({
        where: {
          userId: userId as string,
          isArchived: false,
        },
        data: {
          isCurrentJob: false,
        },
      });
    }

    /* 
        create new job
    */
    const job = await prisma.job.create({
      data: {
        jobTitle,
        company,
        location,
        yearStart: new Date(yearStart),
        yearEnd: yearEnd ? new Date(yearEnd) : undefined,
        isCurrentJob,
        userId: userId,
      },
    });

    /* 
        find all job where isCurrentJob is true
    // */
    const jobs = await prisma.job.findFirst({
      where: {
        userId: userId as string,
        isArchived: false,
        isCurrentJob: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
      },
    });

    /* 
        if user have current job, user is employed
        else user is unemployed
    */
    await prisma.profile.update({
      where: {
        userId: userId,
      },
      data: {
        isEmployed: jobs ? true : false,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log("[USERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
