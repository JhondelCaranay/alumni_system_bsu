"use client";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useModal } from "@/hooks/useModalStore";
import { GroupChatSchemaType } from "@/schema/groupchats";
import { UserWithProfile } from "@/types/types";
import { Role } from "@prisma/client";
import {
  ChevronDown,
  ChevronUp,
  Gavel,
  MoreHorizontal,
  MoreVertical,
  UserPlus,
} from "lucide-react";
import React, { useState } from "react";

type ChatHeaderProps = {
  data: GroupChatSchemaType & { users: UserWithProfile[] };
  currentUser:GetCurrentUserType
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ data, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { onOpen } = useModal();
  const allowedRoles = ["ADMIN", "ADVISER"]
  const canKick = allowedRoles.includes(currentUser?.role as string)
  return (
    <div className="border border-b-1 border-x-0 border-t-0 w-full flex p-3 gap-x-3 items-center">
      <div className="">
        <Avatar
          src={data?.image}
          className="w-12 h-12 object-cover rounded-full"
        />
      </div>
      <div className="flex justify-between w-full items-center">
        <div className="flex flex-col">
          <h1 className="font-semibold text-[1.3em] text-black dark:text-white line-clamp-1">
            {data.name}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-gray-400 line-clamp-1">
            {data.department.name} {data.section.course_year}{" "}
            {data.section.name}
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <MoreVertical className="h-7 w-7 text-zinc-500 cursor-pointer" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit group chat</SheetTitle>
              <SheetDescription>
                Make changes to your group chat here.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col mt-20 w-full gap-y-3">
              <Button
                variant={"ghost"}
                size="sm"
                className="w-full flex justify-between"
                onClick={() => onOpen("addNewMember", { groupChat: data })}
              >
                <span>Add new member</span>
                <UserPlus className=" w-5 h-5 " />
              </Button>
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className=" space-y-2"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className=" w-full flex justify-between"
                  >
                    <span>Chat members</span>
                    {!isOpen ? (
                      <ChevronDown className=" w-5 h-5 " />
                    ) : (
                      <ChevronUp className=" w-5 h-5 " />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                  {data.users.map((member) => (
                    <div
                      className="rounded-md px-4 py-3 font-mono text-sm flex items-center  justify-between"
                      key={member.id}
                    >
                      <div className="flex items-center gap-x-3  font-semibold">
                        <Avatar src={member.image} /> {member.profile.firstname}{" "}
                        {member.profile.lastname}
                      </div>
                     { canKick && <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100" 
                          onClick={() => onOpen('removeMember', {groupChat: data, user: member})}
                          >
                            <Gavel className="h-4 w-4 mr-2" />
                            Kick member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>}
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ChatHeader;
