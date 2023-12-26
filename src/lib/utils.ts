import { apiClient } from "@/hooks/useTanstackQuery";
import { Role } from "@prisma/client";
import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getOrdinal = (number: number) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = number % 100;
  return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

export function capitalizeWords(str: string) {
  // Split the string into words
  let words = str?.split(" ");

  // Capitalize the first letter of each word
  for (let i = 0; i < words?.length; i++) {
    words[i] =
      words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }

  // Join the words back together
  return words?.join(" ");
}

export function isUserAllowed(role: string, allowedRoles: (Role | "ALL")[]) {
  return allowedRoles.includes("ALL") || allowedRoles.includes(role as Role);
}

export const handleImageDeleteOrReplace = async (publicId: string) => {
  apiClient.delete(`/cloudinary/${publicId}`);
  // const {secure_url, public_id} = await cloudinaryUpload(file, 'next-alumni-system')
};

export const uploadPhoto = async (file: File) => {
  const formData = new FormData();
  formData.append("upload_preset", "next-alumni-system");
  formData.append("file", file);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/iamprogrammer/auto/upload`,
    formData,
    {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    }
  );

  return {
    url: res.data.url,
    public_id:  res.data.url
  };
};

export const uploadPhotoForum = async (data: {
  file: File;
  id: number | string;
}) => {
  const formData = new FormData();
  formData.append("upload_preset", "next-alumni-system");
  formData.append("file", data.file);
  const res = await axios.post(
    `${"https://api.cloudinary.com/v1_1/iamprogrammer/auto/upload"}`,
    formData,
    {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    }
  );

  return {
    public_url: res.data.url,
    public_id: res.data.public_id,
  };
};

export const dataURItoBlob = (dataURI:string) => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], {type: mimeString});

}
