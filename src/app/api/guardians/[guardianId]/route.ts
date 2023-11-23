import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { UpdateGuardianSchema } from "@/schema/guardian";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      guardianId: string;
    };
  }
) {
  const { guardianId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const guardians = await prisma.guardian.findUnique({
      where: {
        id: guardianId,
        isArchived: false,
      },
    });

    if (!guardians) {
      return NextResponse.json(
        { message: "Guardian not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(guardians);
  } catch (error) {
    console.log("[GUARDIAN_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      guardianId: string;
    };
  }
) {
  const { guardianId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const guardian = await prisma.guardian.findUnique({
    where: {
      id: guardianId,
      isArchived: false,
    },
  });

  if (!guardian) {
    return NextResponse.json(
      { message: "Guardian not found" },
      { status: 404 }
    );
  }

  const result = await UpdateGuardianSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[GUARDIAN_PATCH]", result.error);
    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  // const guardianExists = await prisma.guardian.findFirst({
  //   where: {
  //     firstname: result.data.firstname,
  //     lastname: result.data.lastname,
  //   },
  // });

  // if (guardianExists && guardianExists.id !== guardianId) {
  //   return NextResponse.json(
  //     { message: "Guardian already exist" },
  //     { status: 400 }
  //   );
  // }

  try {
    const updatedGuardian = await prisma.guardian.update({
      where: {
        id: guardianId,
      },
      data: result.data,
    });

    return NextResponse.json(updatedGuardian);
  } catch (error) {
    console.log("[GUARDIAN_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      guardianId: string;
    };
  }
) {
  const { guardianId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const guardians = await prisma.guardian.findUnique({
    where: {
      id: guardianId,
      isArchived: false,
    },
  });

  if (!guardians) {
    return NextResponse.json(
      { message: "Guardian not found" },
      { status: 404 }
    );
  }

  try {
    const archivedGuardian = await prisma.guardian.update({
      where: {
        id: guardianId,
        isArchived: false,
      },
      data: {
        isArchived: true,
      },
    });

    return NextResponse.json(archivedGuardian);
  } catch (error) {
    console.log("[GUARDIAN_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
