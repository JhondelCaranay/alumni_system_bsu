import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/utils";
import { UpdateTimeAndDateEventSchema, UpdateTitleAndDescriptionEventSchema } from "@/schema/event";

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
  const { eventId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const events = await prisma.event.findUnique({
      where: {
        id: eventId,
        isArchived: false,
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
  const { eventId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const events = await prisma.event.findUnique({
    where: {
      id: eventId,
      isArchived: false,
    },
  });

  if (!events) {
    return NextResponse.json("Event not found", { status: 404 });
  }

  const result = await UpdateTimeAndDateEventSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[EVENT_PATCH]", result.error);
    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  const { title, timeStart, timeEnd, allDay } = result.data;

  try {
    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        title,
        dateStart: timeStart,
        dateEnd: timeEnd,
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
  const { eventId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const events = await prisma.event.findUnique({
    where: {
      id: eventId,
      isArchived: false,
    },
  });

  if (!events) {
    return NextResponse.json("Event not found", { status: 404 });
  }

  const result = await UpdateTitleAndDescriptionEventSchema.safeParseAsync(await req.json());

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

  const { title, description } = result.data;

  try {
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
  const { eventId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const events = await prisma.event.findUnique({
    where: {
      id: eventId,
      isArchived: false,
    },
  });

  if (!events) {
    return NextResponse.json("Event not found", { status: 404 });
  }

  try {
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
