import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

export type GetCurrentUserType = Awaited<ReturnType<typeof getCurrentUser>>;
export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        profile: {
          include: {
            parents: true,
          },
        },
        // section:true,

        department: true,
      },
    });

    if (!currentUser) {
      return null;
    }

    const { hashedPassword, ...props } = currentUser;

    return {
      ...props,
      role: currentUser.role.toString(),
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    };
  } catch (error: any) {
    return null;
  }
}
