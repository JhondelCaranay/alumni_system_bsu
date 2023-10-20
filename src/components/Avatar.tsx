"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

type AvatarProps = {
  src: string | null | undefined;
  className?: string
} 

const Avatar = ({ src, className }: AvatarProps) => {
  return (
    <Image
      className={ cn(`rounded-full object-cover ${className}`)}
      height={"35"}
      width={"35"}
      alt="Avatar"
      src={src || "/images/placeholder.jpg"}
      
    />
  );
};
export default Avatar;
