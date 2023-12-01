import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { UpdateUsersSchema } from "@/schema/users";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    const { userId } = params;

    if (!userId) return new NextResponse("User ID missing", { status: 400 });

    if (userId === currentUser?.id)
      return new NextResponse("Something went wrong...", { status: 400 });

    const user = await prisma.user.findUnique({
      where: {
        id: userId as string,
      },
      include: {
        profile: true,
        department: true,
        section: true,
      },
    });

    if (!user) {
      return new NextResponse("User Not Found", { status: 404 });
    }

    const { hashedPassword, ...rest } = user;

    return NextResponse.json({ ...rest });
  } catch (error) {
    console.log("[USERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    const { userId } = params;

    if (!userId) return new NextResponse("User ID missing", { status: 400 });

    if (userId === currentUser?.id)
      return new NextResponse("Something went wrong...", { status: 400 });

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        isArchived: false,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId as string,
        isArchived: false,
      },
      data: {
        isArchived: true,
      },
    });

    const { hashedPassword, ...rest } = updatedUser;

    return NextResponse.json({ ...rest });
  } catch (error) {
    console.log("[USERS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const currentUser = await getCurrentUser();

  try {
    const result = UpdateUsersSchema.safeParse(await request.json());

    if (!result.success) {
      return NextResponse.json(
        {
          errors: result.error.flatten().fieldErrors,
          message: "Invalid body parameters",
        },
        { status: 400 }
      );
    }
    const { userId } = params;

    if (!userId) {
      return new NextResponse("User ID missing", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        isArchived: false,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const {
      personal_email,
      bsu_email,
      image,
      currentPassword,
      password,
      confirmPassword,
      ...rest
    } = result.data;

    // if there's a password update
    if (password && currentPassword && confirmPassword) {
      const isMatched = await bcrypt.compare(
        currentPassword,
        user.hashedPassword as string
      );

      if (!isMatched) {
        return new NextResponse("Current password do not match", {
          status: 400,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(password, salt);

      const updatedPassword = await prisma.user.update({
        where: {
          id: userId as string,
        },
        data: {
          hashedPassword: newPassword,
        },
      });
      const { hashedPassword, ...props } = updatedPassword;
      return NextResponse.json({ ...props });
    }

    // else only general information
    const updatedUser = await prisma.user.update({
      where: {
        id: userId as string,
      },
      data: {
        email: bsu_email,
        image,
        profile: {
          update: {
            alternative_email: personal_email,
            ...rest,
          },
        },
      },
    });

    const { hashedPassword, ...props } = updatedUser;

    return NextResponse.json({ ...props });
  } catch (error) {
    console.log("[USERS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
