import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/useModalStore";
import useRouterPush from "@/hooks/useRouterPush";
import {
  UserProfileWithDepartmentSection,
  UserWithProfile,
} from "@/types/types";
import { User } from "@prisma/client";
import { Archive, MoreHorizontal, Pencil } from "lucide-react";
import React from "react";

type ActionButtonProps = {
  user: User | UserWithProfile | UserProfileWithDepartmentSection;
};

const ActionButton: React.FC<ActionButtonProps> = ({ user }) => {
  const { onOpen } = useModal();
  const { redirectTo } = useRouterPush();

  return (
    <div className={`h-full w-full cursor-pointer`}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="h-4 w-4 text-zinc-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-xs cursor-pointer hover:bg-zinc-400"
            onClick={() => redirectTo(`users/${user.id}`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100"
            onClick={() => onOpen("archiveUser", { user: user })}
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ActionButton;
