import getCurrentUser from "@/actions/getCurrentUser";
import { z } from "zod";
import generator from "generate-password";
import bcrypt from "bcrypt";
import sendMail from "@/lib/smtp";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  // const currentUser = await getCurrentUser()

  // if(!currentUser || currentUser.role !== Role.ADMIN) {
  //   return new NextResponse('Unauthorized', {status:401})
  // }

  try {
    const excelToJsonSchema = z.array(
      z.object({
        ["Full Name"]: z.string().min(1),
        ["Email"]: z.string().email(),
        ["Student No."]: z.number().min(1),
        ["Gender"]: z.string().min(1),
        ["Level"]: z.string().min(1),
        ["Program"]: z.string().min(1),
        ["Contact"]: z.number().min(1),
      })
    );

    type ExcelToJsonSchemaType = z.infer<typeof excelToJsonSchema>;

    const values = (await req.json()) as ExcelToJsonSchemaType;

    const validatedValues = excelToJsonSchema.safeParse(values);

    if (!validatedValues.success) {
      return new NextResponse("invalid json data", { status: 400 });
    }

    //createUser student function
    const createUser = async (data: ExcelToJsonSchemaType[number]) => {
      const department = await prisma.department.findFirst({
        where: {
          name: data["Program"],
        },
      });

      if (!department) {
        return new NextResponse("Department not found", { status: 404 });
      }

      const password = generator.generate({
        length: 10,
        numbers: true,
      });

      const salt = await bcrypt.genSalt(10);
      const hashPw = await bcrypt.hash(password, salt);

      const student = await prisma.user.create({
        data: {
          name: data["Full Name"],
          hashedPassword: hashPw,
          email: data["Email"].toString(),
          role: Role.STUDENT,
          profile: {
            create: {
              studentNumber: data["Student No."],
              contactNo: data["Contact"].toString(),
              gender: data["Gender"] === "F" ? "FEMALE" : "MALE",
            },
          },
          department: {
            connect: {
              id: department?.id,
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

      const content = `<div> 
          <h3> hello ${data["Full Name"]} </h3>
  
          <h4>These are your credentials</h4>
  
          <section>
            <div> <strong> Contact: </strong> <label> ${data["Contact"]} </label> </div>
            <div> <strong> Email: </strong> <label> ${data["Email"]} </label> </div>
            <div> <strong> Password: </strong> <label> ${password} </label> </div>
          </section>
  
          <p> please keep this credentials secure and dont share it to other people, Thank you!  </p>
  
          <small> - BSU-FACULTY-ADMIN </small>
      </div>`;

      sendMail({ content, subject: "Almuni Bsu", emailTo: data["Email"] });

      const { hashedPassword, ...rest } = student;

      return { ...rest };
    };

    const students = await Promise.all(validatedValues.data.map((data) => createUser(data)));

    return NextResponse.json(students);
  } catch (error) {
    console.log("[STUDENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
