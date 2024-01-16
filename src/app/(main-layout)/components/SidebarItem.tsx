"use client";

import { Hint } from "@/components/hint";
import { SidebarModeType } from "@/hooks/useSidebarModeStore";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
  mode: SidebarModeType;
  icon: LucideIcon;
  label: string;
  href: string;
  setOpen?: (open: boolean) => void;
}

export const SidebarItem = ({
  mode,
  icon: Icon,
  label,
  href,
  setOpen,
}: SidebarItemProps) => {
  const pathname = usePathname();
  // const router = useRouter();

  const isActive = pathname?.startsWith(href);

  const onClick = () => {
    if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 dark:bg-[#020817] dark:text-white",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700 "
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-x-2 py-4">
        {mode === "mini" ? (
          <Hint label={label} side="right">
            <Icon
              size={18}
              className={cn(
                "text-slate-500 dark:bg-[#020817] dark:text-white",
                isActive && "text-sky-700"
              )}
            />
          </Hint>
        ) : (
          <Icon
            size={18}
            className={cn(
              "text-slate-500 dark:bg-[#020817] dark:text-white",
              isActive && "text-sky-700"
            )}
          />
        )}
        <span className={cn(mode === "mini" && "sr-only")}>{label}</span>
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </Link>
  );
};
