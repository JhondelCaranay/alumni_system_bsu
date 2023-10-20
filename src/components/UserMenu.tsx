import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SafeUser } from "@/types/types";
import { Button } from "./ui/button";
import { AlignJustify } from "lucide-react";
import Avatar from "./Avatar";

type UserMenuProps = {
  currentUser?: SafeUser | null;
};
const UserMenu = ({ currentUser }: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className="
          p-1
          border-[1px] 
          border-neutral-200 
          flex 
          flex-row 
          items-center 
          justify-center
          rounded-full 
          cursor-pointer 
          hover:shadow-md 
          transition
          "
        >
          <Avatar src={currentUser?.image} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserMenu;
