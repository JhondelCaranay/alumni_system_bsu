"use client";

import Image from "next/image";

type AvatarProps = {
  src: string | null | undefined;
};

const Avatar = ({ src }: AvatarProps) => {
  return (
    <Image
      className="rounded-full object-cover"
      height={"35"}
      width={"35"}
      alt="Avatar"
      src={src || "/images/placeholder.jpg"}
    />
  );
};
export default Avatar;
