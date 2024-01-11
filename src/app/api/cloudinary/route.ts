import { env } from "@/env.mjs";
import { handleImageCompression } from "@/lib/utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: {} }) {
    try {
        const formData = await req.formData()
        formData.append('upload_preset', 'next-alumni-system')
        // const file = formData.get('file')
        // const compressedFile = await handleImageCompression(file as File)
        // formData.append('file', compressedFile as File)
        const res = await axios.post(`${env.CLOUDINARY_UPLOAD_URL}`, formData,{
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });

        return NextResponse.json({link:res.data.secure_url})

    } catch (error) {
      console.log("[CLOUDINARY_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }