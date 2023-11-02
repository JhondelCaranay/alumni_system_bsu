"use client";

import UserMenu from "@/components/UserMenu";
import { SafeUser } from "@/types/types";

type NavbarRoutesProps = {
  currentUser?: SafeUser | null;
};

export const NavbarRoutes = ({ currentUser }: NavbarRoutesProps) => {
  return (
    <>
      {/* <div className="dark:bg-[#020817] dark:text-white">NAV LINKS</div> */}

      <div className="flex gap-x-2 ml-auto items-center">
        {/* <Link href="/">
          <Button size="sm" variant="ghost">
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </Link> */}
        <p className="text-sm font-medium text-gray-500 dark:text-gray-200">{currentUser?.email}</p>
        <UserMenu currentUser={currentUser} />
      </div>
    </>
  );
};
