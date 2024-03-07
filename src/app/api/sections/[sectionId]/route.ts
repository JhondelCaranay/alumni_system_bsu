import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/utils";
import { UpdateSectionSchema } from "@/schema/section";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      sectionId: string;
    };
  }
) {
  const { sectionId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const sections = await prisma.section.findUnique({
      where: {
        id: sectionId,
        isArchived: false,
      },
    });

    if (!sections) {
      return NextResponse.json("Section not found", { status: 404 });
    }

    return NextResponse.json(sections);
  } catch (error) {
    console.log("[SECTION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      sectionId: string;
    };
  }
) {
  const { sectionId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const sections = await prisma.section.findUnique({
    where: {
      id: sectionId,
      isArchived: false,
    },
  });

  if (!sections) {
    return NextResponse.json("Section not found", { status: 404 });
  }

  const result = await UpdateSectionSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[SECTION_PATCH]", result.error);
    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  // check if section already exists
  const section = await prisma.section.findFirst({
    where: {
      isArchived: false,
      name: result.data.name,
      school_year: result.data.school_year,
      departmentId: result.data.departmentId,
    },
  });

  if (section && section.id !== sectionId) {
    return NextResponse.json(
      {
        errors: {
          name: "Section with same department and school year is already exists",
          school_year: "Already exists",
          departmentId: "Already exists",
        },
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  try {
    const updatedSection = await prisma.section.update({
      where: {
        id: sectionId,
        isArchived: false,
      },
      data: result.data,
    });

    return NextResponse.json(updatedSection);
  } catch (error) {
    console.log("[SECTION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      sectionId: string;
    };
  }
) {
  const { sectionId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const sections = await prisma.section.findUnique({
    where: {
      id: sectionId,
      isArchived: false,
    },
  });

  if (!sections) {
    return NextResponse.json("Section not found", { status: 404 });
  }

  try {
    const archivedSection = await prisma.section.update({
      where: {
        id: sectionId,
        isArchived: false,
      },
      data: {
        isArchived: true,
      },
    });

    return NextResponse.json(archivedSection);
  } catch (error) {
    console.log("[SECTION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
