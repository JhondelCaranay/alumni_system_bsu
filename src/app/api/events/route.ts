import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/utils";
import moment from "moment-timezone";
import { CreateEventSchema } from "@/schema/event";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const date = new Date();
  date.setDate(date.getDate() - 1);
  const today = moment.utc(date).tz("Asia/Manila").format();

  try {
    const events = await prisma.event.findMany({
      where: {
        dateStart: {
          gte: today,
        },
        isArchived: false,
      },
      orderBy: {
        dateStart: "desc",
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.log("[EVENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await CreateEventSchema.safeParseAsync(await req.json());

  if (!result.success) {
    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  const { id, title, description, allDay, timeEnd, timeStart } = result.data;

  try {
    const event = await prisma.event.create({
      data: {
        id,
        title,
        description,
        allDay,
        dateStart: timeStart,
        dateEnd: timeEnd,
        userId: currentUser.id,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.log("[EVENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
