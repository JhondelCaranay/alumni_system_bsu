import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { CreateGuardianSchema } from "@/schema/guardian";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
export async function GET(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const GetGuardiansQueriesSchema = z.object({
    studentProfileId: z.string().optional(),
  });

  const queries = Object.fromEntries(req.nextUrl.searchParams.entries());
  const result = await GetGuardiansQueriesSchema.safeParseAsync(queries);

  if (!result.success) {
    console.log("[GUARDIANS_GET]", result.error.flatten().fieldErrors);
    return new NextResponse("Invalid query parameters", { status: 400 });
  }

  const { studentProfileId } = result.data;
  console.log(
    "🚀 ~ file: route.ts:27 ~ GET ~ studentProfileId:",
    studentProfileId
  );

  try {
    const guardians = await prisma.guardian.findMany({
      where: {
        isArchived: false,
        childrenId: studentProfileId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(guardians);
  } catch (error) {
    console.log("[GUARDIANS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await CreateGuardianSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[GUARDIANS_POST]", result.error);

    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  // Check if guardian already exists
  const guardianExists = await prisma.guardian.findFirst({
    where: {
      firstname: result.data.firstname,
      lastname: result.data.lastname,
      isArchived: false,
    },
  });

  if (guardianExists) {
    return NextResponse.json(
      { message: "Guardian already exist" },
      { status: 400 }
    );
  }

  // check if children exists
  const childrenExists = await prisma.profile.findFirst({
    where: {
      id: result.data.childrenId,
    },
  });

  if (!childrenExists) {
    return NextResponse.json(
      { message: "Children id does not exist" },
      { status: 400 }
    );
  }

  try {
    const guardian = await prisma.guardian.create({
      data: {
        ...result.data,
      },
    });

    return NextResponse.json(guardian);
  } catch (error) {
    console.log("[GUARDIANS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
