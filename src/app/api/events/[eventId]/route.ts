import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { updateTimeAndDateEventsSchema, updateTitleAndDescriptionEventsSchema } from "../_schema";
import { isUserAllowed } from "@/lib/utils";
import { Role } from "@prisma/client";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      eventId: string;
    };
  }
) {
  try {
    const { eventId } = params;

    const events = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!events) {
      return NextResponse.json("Event not found", { status: 404 });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.log("[EVENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      eventId: string;
    };
  }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !isUserAllowed(currentUser.role, [Role.ADMIN])) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { eventId } = params;

    const events = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!events) {
      return NextResponse.json("Event not found", { status: 404 });
    }

    const result = await updateTimeAndDateEventsSchema.safeParseAsync(await req.json());

    if (!result.success) {
      console.log("[EVENT_PATCH]", result.error);
      return NextResponse.json(
        {
          errors: result.error.errors,
          message: "Invalid body parameters",
        },
        { status: 400 }
      );
    }

    const { title, timeStart, timeEnd, allDay } = result.data;

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        title,
        dateStart:timeStart,
        dateEnd:timeEnd,
        allDay,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.log("[EVENT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      eventId: string;
    };
  }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !isUserAllowed(currentUser.role, [Role.ADMIN])) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { eventId } = params;

    const events = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!events) {
      return NextResponse.json("Event not found", { status: 404 });
    }

    const result = await updateTitleAndDescriptionEventsSchema.safeParseAsync(await req.json());
    
    if (!result.success) {
      console.log("[EVENT_PUT]", result.error);
      return NextResponse.json(
        {
          errors: result.error.errors,
          message: "Invalid body parameters",
        },
        { status: 400 }
      );
    }

    const { title,description } = result.data;

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        description,
        title,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.log("[EVENT_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      eventId: string;
    };
  }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !isUserAllowed(currentUser.role, [Role.ADMIN])) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { eventId } = params;

    const events = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!events) {
      return NextResponse.json("Event not found", { status: 404 });
    }

    const archivedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        isArchived: true,
      },
    });

    return NextResponse.json(archivedEvent);
  } catch (error) {
    console.log("[EVENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}