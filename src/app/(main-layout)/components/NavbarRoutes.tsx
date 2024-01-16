"use client";

import { GetCurrentUserType } from "@/actions/getCurrentUser";
import UserMenu from "@/components/UserMenu";
import UserNotification from "@/components/UserNotification";
import { SafeUser } from "@/types/types";

type NavbarRoutesProps = {
  currentUser?: GetCurrentUserType;
};

export const NavbarRoutes = ({ currentUser }: NavbarRoutesProps) => {
  return (
    <>
      {/* <div className="dark:bg-[#020817] dark:text-white">NAV LINKS</div> */}

      <div className="flex gap-x-3 ml-auto items-center">
        <div className="flex items-center">
          <UserMenu currentUser={currentUser} />
        </div>
        <div>
          <UserNotification currentUser={currentUser} />
        </div>

        {/* <Link href="/">
          <Button size="sm" variant="ghost">
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </Link> */}
      </div>
    </>
  );
};
