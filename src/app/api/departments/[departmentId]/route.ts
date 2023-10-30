import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/utils";
import { UpdateDepartmentSchema } from "@/schema/department";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      departmentId: string;
    };
  }
) {
  const { departmentId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const departments = await prisma.department.findUnique({
      where: {
        id: departmentId,
        isArchived: false,
      },
    });

    if (!departments) {
      return NextResponse.json("Department not found", { status: 404 });
    }

    return NextResponse.json(departments);
  } catch (error) {
    console.log("[DEPARTMENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      departmentId: string;
    };
  }
) {
  const { departmentId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const departments = await prisma.department.findUnique({
    where: {
      id: departmentId,
      isArchived: false,
    },
  });

  if (!departments) {
    return NextResponse.json("Department not found", { status: 404 });
  }

  const result = await UpdateDepartmentSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[DEPARTMENT_PATCH]", result.error);
    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  try {
    const updatedDepartment = await prisma.department.update({
      where: {
        id: departmentId,
        isArchived: false,
      },
      data: result.data,
    });

    return NextResponse.json(updatedDepartment);
  } catch (error) {
    console.log("[DEPARTMENT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      departmentId: string;
    };
  }
) {
  const { departmentId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const departments = await prisma.department.findUnique({
    where: {
      id: departmentId,
      isArchived: false,
    },
  });

  if (!departments) {
    return NextResponse.json("Department not found", { status: 404 });
  }

  try {
    const archivedDepartment = await prisma.department.update({
      where: {
        id: departmentId,
        isArchived: false,
      },
      data: {
        isArchived: true,
      },
    });

    return NextResponse.json(archivedDepartment);
  } catch (error) {
    console.log("[DEPARTMENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
