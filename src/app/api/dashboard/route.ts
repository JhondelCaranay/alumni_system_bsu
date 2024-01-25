import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import axios from 'axios'
import { SafeUser } from "@/types/types";

export const dynamic = "force-dynamic";

export async function GET(request:Request) {
  try {
    // getting users
    const users = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users`) as SafeUser[];
    const students = users.filter((user) => user.role === Role.STUDENT);
    const alumni = users.filter((user) => user.role === Role.ALUMNI);
    
    return NextResponse.json({});


  } catch (error) {
    console.log("[DASHBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
