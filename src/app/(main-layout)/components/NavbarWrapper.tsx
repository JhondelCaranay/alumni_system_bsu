"use client";

import { useSidebarModeStore } from "@/hooks/useSidebarModeStore";
import { cn } from "@/lib/utils";

type NavbarWrapperProps = {
  children: React.ReactNode;
};
const NavbarWrapper = ({ children }: NavbarWrapperProps) => {
  const { mode } = useSidebarModeStore();

  return (
    <main
      className={cn(
        "h-[80px] fixed inset-y-0 w-full z-50",
        mode === "mini" ? "md:pl-20" : "md:pl-56"
      )}
    >
      {children}
    </main>
  );
};
export default NavbarWrapper;
