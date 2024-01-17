"use client";

import { useSidebarModeStore } from "@/hooks/useSidebarModeStore";
import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      height={80}
      width={80}
      alt="logo"
      className="object-contain"
      src={"/images/CIT.png"}
    />
  );
};
