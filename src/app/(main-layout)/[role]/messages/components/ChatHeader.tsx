"use client";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
import { User } from "@prisma/client";
import { Archive, ChevronDown, ChevronUp, MoreHorizontal, MoreVertical, Pencil, UserPlus } from "lucide-react";
import React, { useState } from "react";

type ChatHeaderProps = {
  data: GroupChatSchemaType & { users: User[] };
};
const ChatHeader: React.FC<ChatHeaderProps> = ({ data }) => {
  console.log(data);
  const [isOpen, setIsOpen] = useState(false);
  const { onOpen } = useModal();
  return (
    <div className="border border-b-1 border-x-0 border-t-0 w-full flex p-3 gap-x-3 items-center">
      <div className="">
        <img
          src={data?.image || "/images/logo.png"}
          alt="chat header profile"
          className="w-12 h-12 object-cover rounded-full"
        />
      </div>
      <div className="flex justify-between w-full items-center">
        <div className="flex flex-col">
          <h1 className="font-semibold text-[1.3em] text-black">{data.name}</h1>
          <p className="text-sm text-zinc-500">
            {data.department.name} {data.section.name}{" "}
            {data.section.course_year}
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
                onClick={() => onOpen("addNewMember")}
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
                    <div className="rounded-md px-4 py-3 font-mono text-sm flex items-center  justify-between">
                      <div className="flex items-center gap-x-3  font-semibold">
                        <Avatar src={member.image} /> {member.name}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-xs cursor-pointer hover:bg-zinc-400"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Update
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100"
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
