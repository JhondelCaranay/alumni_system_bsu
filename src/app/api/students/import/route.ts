import getCurrentUser from "@/actions/getCurrentUser";
import { z } from "zod";
import generator from "generate-password";
import bcrypt from "bcrypt";
import sendMail from "@/lib/smtp";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Gender, Role } from "@prisma/client";
import { MdCatchingPokemon } from "react-icons/md";
import {
  ImportStudentSchema,
  ImportStudentSchemaType,
} from "@/schema/students";

export async function POST(req: NextRequest) {
  // const currentUser = await getCurrentUser()

  // if(!currentUser || currentUser.role !== Role.ADMIN) {
  //   return new NextResponse('Unauthorized', {status:401})
  // }

  try {
    const values = (await req.json()) as ImportStudentSchemaType;

    const validatedValues = ImportStudentSchema.safeParse(values);

    if (!validatedValues.success) {
      return new NextResponse("invalid json data", { status: 400 });
    }

    //createUser student function
    const createUser = async (data: ImportStudentSchemaType[number]) => {
      const isUserExist = await prisma.user.findFirst({
        where: {
          email: data["Email"],
        },
      });

      if (isUserExist) {
        console.log("Student already exists");
        throw new Error("Student already exists");
      }

      const department = await prisma.department.findFirst({
        where: {
          name: data["Course"],
        },
      });

      if (!department) {
        throw new Error("Department not found");
      }

      const section = await prisma.section.findFirst({
        where: {
          name: data["Section"],
        },
      });

      if (!section) {
        throw new Error("Section not found");
      }
      const salt = await bcrypt.genSalt(10);

      const date = new Date(
        (data["Date of birth"] - 1) * 24 * 60 * 60 * 1000 + Date.UTC(1900, 0, 1)
      );
      date.setDate(date.getDate() - 1);

      const pass = `@${data["First Name"]}${date.getDate()}${
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1
      }${date.getFullYear()}`;

      const hashPw = await bcrypt.hash(pass, salt);
      const student = await prisma.user.create({
        data: {
          name: `${data["First Name"]} ${data["Last Name"]}`,
          hashedPassword: hashPw,
          email: data["Email"].toString(),
          role: Role.STUDENT,
          profile: {
            create: {
              studentNumber: data["Student Number"],
              contactNo: data["Contact Number"].toString(),
              gender: data["Gender"] as Gender,
              province: data["Province"].toString(),
              dateOfBirth: date,
              schoolYear: 1,
              age: Number(data["Age"]),
              barangay: data["Barangay"].toString(),
              city: data["City"].toString(),
              firstname: data["First Name"].toString(),
              lastname: data["Last Name"].toString(),
              middlename: data["Middle Name"].toString(),
              homeNo: data["Home No"].toString(),
              street: data["Street"],
            },
          },
          department: {
            connect: {
              id: department?.id,
            },
          },
          section: {
            connect: {
              id: section?.id,
            },
          },
        },
        include: {
          profile: true,
          department: true,
          section: true,
        },
      });
      // email sending here
      // const content = `<div>
      //     <h3> hello ${data["First Name"]} ${data['Last Name']} </h3>

      //     <h4>These are your credentials</h4>

      //     <section>
      //       <div> <strong> Contact: </strong> <label> ${data["Contact Number"]} </label> </div>
      //       <div> <strong> Email: </strong> <label> ${data["Email"]} </label> </div>
      //       <div> <strong> Password: </strong> <label> ${password} </label> </div>
      //     </section>

      //     <p> please keep this credentials secure and dont share it to other people, Thank you!  </p>

      //     <small> - BSU-FACULTY-ADMIN </small>
      // </div>`;

      // sendMail({ content, subject: "Almuni Bsu", emailTo: data["Email"] });

      const { hashedPassword, ...rest } = student;

      return { ...rest };
    };

    const students = await Promise.all(
      validatedValues.data.map((data) => createUser(data))
    );
    return NextResponse.json(students);
  } catch (error: any) {
    console.log("[STUDENTS_POST]", error);
    return new NextResponse(error, { status: 500 });
  }
}
