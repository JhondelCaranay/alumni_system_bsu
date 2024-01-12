"use client";

import { useSidebarModeStore } from "@/hooks/useSidebarModeStore";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};
const SidebarWrapper = ({ children }: Props) => {
  const { mode } = useSidebarModeStore();

  return (
    <main
      className={cn(
        "hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50 transition",
        mode === "mini" && "w-20"
      )}
    >
      {children}
    </main>
  );
};
export default SidebarWrapper;
