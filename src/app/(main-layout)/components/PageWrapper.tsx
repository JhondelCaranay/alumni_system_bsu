"use client";

import { useSidebarModeStore } from "@/hooks/useSidebarModeStore";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};
const PageWrapper = ({ children }: Props) => {
  const { mode } = useSidebarModeStore();

  return (
    <main
      className={cn(
        "md:pl-56 pt-[80px] h-full 2 ",
        mode === "mini" && "md:pl-20"
      )}
    >
      {children}
    </main>
  );
};
export default PageWrapper;
