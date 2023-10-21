import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
