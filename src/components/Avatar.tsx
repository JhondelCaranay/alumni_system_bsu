"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

type AvatarProps = {
  src: string | null | undefined;
  className?: string;
};

const Avatar = ({ src, className }: AvatarProps) => {
  return (
    <div className={cn("relative w-10 h-10", className)}>
      <Image
        className={`rounded-full object-cover object-center`}
        // height={500}
        // width={500}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt="Avatar"
        src={src || "/images/placeholder.jpg"}
      />
    </div>
  );
};
export default Avatar;
