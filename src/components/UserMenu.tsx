import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SafeUser } from "@/types/types";
import Avatar from "./Avatar";
import { ModeToggle } from "./ModeToggle";
import { signOut } from "next-auth/react";
import { capitalizeWords } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

type UserMenuProps = {
  currentUser?: SafeUser | null;
};
const UserMenu = ({ currentUser }: UserMenuProps) => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className="
          p-[2px]
          border-[1px] 
          border-neutral-200 
          flex 
          flex-row 
          items-center 
          justify-center
          rounded-full 
          cursor-pointer 
          hover:shadow-md 
          transition"
        >
          <div className=" relative w-10 h-10">
            <Image
              src={currentUser?.image as string}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-full object-cover"
              alt="profile image"
            />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {capitalizeWords(currentUser?.role!)}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            router.push(`/${currentUser?.role.toLowerCase()}/profile`)
          }
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ModeToggle />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserMenu;
