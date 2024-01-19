import prisma from "@/lib/prisma";

export type GetCurrentUserType = Awaited<ReturnType<typeof getUserById>>;
export default async function getUserById(id: string) {
  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        profile: {
          include: {
            parents: true,
          },
        },
        section: true,
        department: true,
        notifications: {
          include: {
            post: true,
            usersWhoInteract: true,
            comment: true,
            like: true,
            user: true,
          },
        },
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
