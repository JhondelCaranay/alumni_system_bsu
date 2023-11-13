"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

type AvatarProps = {
  src: string | null | undefined;
  className?: string;
};

const Avatar = ({ src, className }: AvatarProps) => {
  return (
    <Image
      className={cn(`rounded-full object-cover object-center`, className)}
      height={40}
      width={40}
      alt="Avatar"
      src={src || "/images/placeholder.jpg"}
    />
  );
};
export default Avatar;
