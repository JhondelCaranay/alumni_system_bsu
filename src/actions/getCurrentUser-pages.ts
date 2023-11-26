import { NextResponse } from "next/server";
import prismaDB from "@/lib/prisma";
import { getCsrfToken } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type TGetCurrentUser = Awaited<ReturnType<typeof getCurrentUserPages>>;

async function getCurrentUserPages(req: NextApiRequest, res: NextApiResponse) {
  try {
    const currentUser = await getServerSession(req, res, authOptions);

    const user = await prismaDB.user.findUnique({
      where: {
        email: currentUser?.user?.email as string,
      },
    });

    if (!user) {
      return null;
    }

    const { hashedPassword, ...props } = user;
    return {
      ...props,
      role: user.role.toString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      emailVerified: user.emailVerified?.toISOString() || null,
    };
  } catch (error) {
    console.error(error);
  }
}

export default getCurrentUserPages;
