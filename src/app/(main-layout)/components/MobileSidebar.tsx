import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { SafeUser } from "@/types/types";

type MobileSidebarProps = {
  currentUser?: SafeUser | null;
};

export const MobileSidebar = ({ currentUser }: MobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <Sidebar currentUser={currentUser} />
      </SheetContent>
    </Sheet>
  );
};
