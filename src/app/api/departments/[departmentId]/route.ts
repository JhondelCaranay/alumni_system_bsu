import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
  try {
    const { departmentId } = params;

    const departments = await prisma.department.findUnique({
      where: {
        id: departmentId,
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
  try {
    const { departmentId } = params;
    const user = await getCurrentUser();

    /* 
      TODO: UNCOMMENT WHEN USER CAN NOW LOGIN
    */
    // if (!user) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    /* 
      TODO: ADD ROLE AUTHORIZATION
    */

    const departments = await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!departments) {
      return NextResponse.json("Department not found", { status: 404 });
    }

    const bodySchema = z.object({
      name: z
        .string({
          required_error: "Name is required",
        })
        .min(1, "Name must be at least 1 characters long"),
    });

    const result = await bodySchema.safeParseAsync(await req.json());

    if (!result.success) {
      console.log("[DEPARTMENT_PATCH]", result.error);
      return NextResponse.json(
        {
          errors: result.error.errors,
          message: "Invalid body parameters",
        },
        { status: 400 }
      );
    }

    const { name } = result.data;

    const updatedDepartment = await prisma.department.update({
      where: {
        id: departmentId,
      },
      data: {
        name,
      },
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
  try {
    const { departmentId } = params;
    const user = await getCurrentUser();

    /* 
      TODO: UNCOMMENT WHEN USER CAN NOW LOGIN
    */
    // if (!user) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    /* 
      TODO: ADD ROLE AUTHORIZATION
    */

    const departments = await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!departments) {
      return NextResponse.json("Department not found", { status: 404 });
    }

    const archivedDepartment = await prisma.department.update({
      where: {
        id: departmentId,
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
