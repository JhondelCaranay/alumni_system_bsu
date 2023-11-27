import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryDestroy = async (public_id: string) => {
  try {

    const key = public_id.includes('next-alumni-system') ? public_id : `next-alumni-system/${public_id}`
    const result = await cloudinary.uploader.destroy(
      key
    );

    console.log(result);
    return result;
  } catch (error) {
    console.error("error cloudinary upload", error);
  }
};
