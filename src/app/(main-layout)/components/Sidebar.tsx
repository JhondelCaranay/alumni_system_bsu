import { SafeUser } from "@/types/types";
import { Logo } from "./Logo";
import { SidebarRoutes } from "./SidebarRoutes";

type SidebarProps = {
  currentUser?: SafeUser | null;
};

export const Sidebar = ({ currentUser }: SidebarProps) => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm dark:bg-[#020817] dark:text-white">
      <div className="p-6 flex items-center justify-center">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        {currentUser?.role && <SidebarRoutes role={currentUser?.role} />}
      </div>
    </div>
  );
};
