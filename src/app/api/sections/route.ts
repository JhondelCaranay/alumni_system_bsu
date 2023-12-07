import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/utils";
import { CreateSectionSchema } from "@/schema/section";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const sections = await prisma.section.findMany({
      where: {
        isArchived: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        department: true,
      },
    });
    console.log("🚀 ~ file: route.ts:26 ~ GET ~ sections:", sections);

    return NextResponse.json(sections);
  } catch (error) {
    console.log("[SECTIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await CreateSectionSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[SECTIONS_POST]", result.error);

    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  // check if section already exists
  const section = await prisma.section.findUnique({
    where: {
      isArchived: false,
      name_school_year_departmentId: {
        name: result.data.name,
        school_year: result.data.school_year,
        departmentId: result.data.departmentId,
      },
    },
  });

  if (section) {
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
    const section = await prisma.section.create({
      data: {
        ...result.data,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.log("[SECTIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
