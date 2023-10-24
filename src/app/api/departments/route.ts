import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.log("[DEPARTMENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: {} }) {
  try {
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

    const bodySchema = z.object({
      name: z
        .string({
          required_error: "Name is required",
        })
        .min(1, "Name must be at least 1 characters long"),
    });

    const result = await bodySchema.safeParseAsync(await req.json());

    if (!result.success) {
      // handle error then return
      console.log("[DEPARTMENTS_POST]", result.error);

      return NextResponse.json(
        {
          errors: result.error.errors,
          message: "Invalid body parameters",
        },
        { status: 400 }
      );
    }

    const { name } = result.data;

    const department = await prisma.department.create({
      data: {
        name,
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.log("[DEPARTMENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
