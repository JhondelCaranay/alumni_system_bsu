import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: Request, {params}: {params: {userId: string}}) {

  try {
    const currentUser = await getCurrentUser()

    const {userId} = params;

    if(!userId) return new NextResponse('User ID missing', {status:400})

    if(userId === currentUser?.id) return new NextResponse("Something went wrong...", {status:400})

    const user = await prisma.user.findUnique({
        where: {
            id: userId as string,
        },
        include: {
          profile:true
        }
    })

    if(!user) {
     return new NextResponse('User Not Found', {status:404})
    }

    const {hashedPassword, ...rest} = user;
    
    return NextResponse.json({...rest});

  } catch (error) {
    console.log("[USERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(request: Request, {params}: {params: {userId: string}}) {

  try {
    const currentUser = await getCurrentUser()

    const {userId} = params;

    if(!userId) return new NextResponse('User ID missing', {status:400})

    if(userId === currentUser?.id) return new NextResponse("Something went wrong...", {status:400})

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        isArchived: false,
      }
    })

    if(!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId as string,
            isArchived:false,
        },
        data: {
            archive: true,
            isArchived:true
        }
    })

    const {hashedPassword, ...rest} = updatedUser;

    return NextResponse.json({...rest});

  } catch (error) {
    console.log("[USERS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function PATCH (request:Request, {params}: {params: {userId: string}}) {

  const currentUser = await getCurrentUser();

  const formSchema = z.object({
    firstname: z.string().min(1, { message: "Required field" }),
    lastname: z.string().min(1, { message: "Required field" }),
    email: z
      .string()
      .min(1, { message: "Required field" })
      .email({ message: "Invalid email" }),
    middlename: z.string().min(1, { message: "Required field" }),
    city: z.string().min(1, { message: "Required field" }),
    homeNo: z.string().min(1, { message: "Required field" }),
    street: z.string().min(1, { message: "Required field" }),
    barangay: z.string().min(1, { message: "Required field" }),
    province: z.string().min(1, { message: "Required field" }),
    contactNo: z.string().min(1, { message: "Required field" }),
  });

  type formSchemaType = z.infer<typeof formSchema>;

  try {
    const data = await request.json() as formSchemaType
    
    const validatedData = formSchema.safeParse(data);

    if(!validatedData.success) {
      return new NextResponse("Missing field in form data", { status: 400 });
    }
    const {userId} = params;

    if(!userId) {
      return new NextResponse("User ID missing", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        isArchived: false,
      }
    })

    if(!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const {email, ...rest} = validatedData.data

    const updatedUser = await prisma.user.update({
      where: {
        id: userId as string
      },
      data: {
         email,
        profile: {
          update: {
            ...rest,
          }
        }
      }
    })

    const {hashedPassword, ...props} = updatedUser;

    return NextResponse.json({...props});

  } catch (error) {
    console.log("[USERS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
  
}