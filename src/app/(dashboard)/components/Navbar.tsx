import { SafeUser } from "@/types/types";
import { MobileSidebar } from "./MobileSidebar";
import { NavbarRoutes } from "./NavbarRoutes";

type NavbarProps = {
  currentUser?: SafeUser | null;
};

export const Navbar = ({ currentUser }: NavbarProps) => {
  return (
    <div
      // className="p-4 border-b h-full flex items-center bg-white shadow-sm dark:bg-[#020817] dark:text-white"
      className="p-4 border-none border-0 h-full flex items-center bg-white dark:bg-[#020817] dark:text-white"
    >
      <MobileSidebar />
      <NavbarRoutes currentUser={currentUser} />
    </div>
  );
};
