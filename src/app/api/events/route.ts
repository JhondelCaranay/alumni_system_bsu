import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/utils";
import { createEventsSchema } from "./_schema";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.log("[EVENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: {} }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !isUserAllowed(currentUser.role, [Role.ADMIN])) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const result = await createEventsSchema.safeParseAsync(await req.json());

    if (!result.success) {
      console.log("[EVENTS_POST]", result.error);

      return NextResponse.json(
        {
          errors: result.error.errors,
          message: "Invalid body parameters",
        },
        { status: 400 }
      );
    }

    const { title, description, dateStart, timeStart, timeEnd } = result.data;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        dateStart,
        timeStart,
        timeEnd,
        user: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.log("[EVENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
