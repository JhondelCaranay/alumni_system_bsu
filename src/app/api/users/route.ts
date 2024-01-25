import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { isUserAllowed } from "@/lib/utils";
import { CreateUserSchema } from "@/schema/users";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import sendMail from "@/lib/smtp";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const role = searchParams.get("role");
  const department = searchParams.get("department");

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            isArchived: false,
          },
          {
            role: {
              not: Role.ADMIN,
            },
          },
          {
            role: !role ? undefined : (role as Role),
          },
          {
            department: {
              name: !department ? undefined : (department as string),
            },
          },
        ],
      },
      orderBy: {
        name: "asc",
      },
      include: {
        profile: true,
        department: true,
        section: true,
      },
    });

    const safeUsers = users.map((user) => {
      const { hashedPassword, ...rest } = user;
      return rest;
    });

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.log("[USERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: {} }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isUserAllowed(currentUser.role, ["ALL"])) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await CreateUserSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[USERS_POST]", result.error.errors);
    return NextResponse.json(
      {
        message: "Invalid body parameters",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const {
    firstname,
    lastname,
    middlename,
    email,
    role,
    departmentId,
    sectionId,
    // age,
    barangay,
    city,
    contactNo,
    dateOfBirth,
    gender,
    homeNo,
    province,
    street,
  } = result.data;

  const bday = new Date(dateOfBirth || new Date());
  const saltRounds = await bcrypt.genSalt(10);
  console.log(bday);
  const pass = `@${firstname}${bday.getDate()}${
    bday.getMonth() + 1 < 10 ? `0${bday.getMonth() + 1}` : bday.getMonth() + 1
  }${bday.getFullYear()}`;
  console.log(pass);
  const hashedPassword = await bcrypt.hash(pass, saltRounds);
  try {
    const user = await prisma.user.create({
      data: {
        email,
        role,
        hashedPassword,
        name: firstname + " " + lastname,
        department: departmentId
          ? {
              connect: {
                id: departmentId,
              },
            }
          : undefined,
        section: sectionId
          ? {
              connect: {
                id: sectionId,
              },
            }
          : undefined,
      },
      select: {
        id: true,
        role: true,
        email: true,
        emailVerified: true,
        image: true,
        isArchived: true,
        createdAt: true,
        updatedAt: true,
        department: true,
        section: true,
        profile: true,
      },
    });

    // create profile
    const profile = await prisma.profile.create({
      data: {
        firstname,
        lastname,
        middlename,
        // age: Number(age),
        barangay,
        city,
        contactNo,
        dateOfBirth: bday,
        gender,
        homeNo,
        province,
        street,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    //     const content = `<div>
    //     <h3> hello ${profile.firstname} ${profile.lastname} </h3>

    //     <h4>These are your credentials</h4>

    //     <section>
    //       <div> <strong> Contact: </strong> <label> ${profile.contactNo} </label> </div>
    //       <div> <strong> Email: </strong> <label> ${user.email} </label> </div>
    //       <div> <strong> Password: </strong> <label> ${pass} </label> </div>
    //     </section>

    //     <p> please keep this credentials secure and dont share it to other people, Thank you!  </p>

    //     <small> - CIT-ADMIN </small>
    // </div>`;

    //     sendMail({ content, subject: "CIT", emailTo: user.email || "" });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
