import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { UpdateJobSchema } from "@/schema/jobs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      userId: string;
      jobId: string;
    };
  }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId, jobId } = params;

    const jobs = await prisma.job.findFirst({
      where: {
        id: jobId,
        userId: userId as string,
        isArchived: false,
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

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      userId: string;
      jobId: string;
    };
  }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId, jobId } = params;

    if (!userId) return new NextResponse("User ID missing", { status: 400 });

    if (userId !== currentUser?.id)
      return new NextResponse("You can only update your own profile jobs", {
        status: 400,
      });

    const result = await UpdateJobSchema.safeParseAsync(await req.json());

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

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }

    /* 
        if user add new current job, set all previous job to isCurrentJob false
    */
    if (isCurrentJob === true && job.isCurrentJob === false) {
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
        update job
    */
    await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        jobTitle,
        company,
        location,
        yearStart,
        yearEnd,
        isCurrentJob,
      },
    });

    /* 
        find all job where isCurrentJob is true
    */
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
        id: userId as string,
      },
      data: {
        isEmployed: jobs ? true : false,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log("[JOB_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      userId: string;
      jobId: string;
    };
  }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId, jobId } = params;

    if (!userId) return new NextResponse("User ID missing", { status: 400 });

    if (userId !== currentUser?.id)
      return new NextResponse("You can only delete your own profile jobs", {
        status: 400,
      });

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
        userId: userId as string,
        isArchived: false,
      },
    });

    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }

    /* 
        delete job
    */
    await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        isArchived: true,
      },
    });

    /* 
        if the job is current job, set user isEmployed to false
    */
    if (job.isCurrentJob === true) {
      await prisma.profile.update({
        where: {
          id: userId as string,
        },
        data: {
          isEmployed: false,
        },
      });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.log("[JOB_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
