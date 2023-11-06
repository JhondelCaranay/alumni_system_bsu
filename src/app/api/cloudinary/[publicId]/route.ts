import { cloudinaryDestroy } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: {publicId:string} }) {
    try {
        if(!params.publicId) {
            return new NextResponse("Public ID Missing", { status: 400 });
        }

        const result = cloudinaryDestroy(params.publicId)

        return NextResponse.json(result)
    } catch (error) {
      console.log("[CLOUDINARY_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }