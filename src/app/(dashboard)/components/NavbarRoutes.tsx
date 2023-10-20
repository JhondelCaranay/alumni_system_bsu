"use client";

import UserMenu from "@/components/UserMenu";
import { SafeUser } from "@/types/types";

type NavbarRoutesProps = {
  currentUser?: SafeUser | null;
};

export const NavbarRoutes = ({ currentUser }: NavbarRoutesProps) => {
  return (
    <>
      <div className="">NAV LINKS</div>
      <div className="flex gap-x-2 ml-auto">
        {/* <Link href="/">
          <Button size="sm" variant="ghost">
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </Link> */}
        <UserMenu currentUser={currentUser} />
      </div>
    </>
  );
};
