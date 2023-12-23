"use client";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
  ChevronDown,
  ChevronsUpDown,
  MoreVertical,
  UserPlus,
} from "lucide-react";
import React, { useState } from "react";

const ChatHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-b-1 border-x-0 border-t-0 w-full flex p-3 gap-x-3 items-center">
      <div className="">
        <img
          src="/images/logo.png"
          alt="chat header profile"
          className="w-12 h-12 object-cover"
        />
      </div>
      <div className="flex justify-between w-full items-center">
        <div className="flex flex-col">
          <h1 className="font-semibold text-[1.3em] text-black">
            Jr./Sr. Web Programmer
          </h1>
          <p className="text-sm text-zinc-500">
            Kooapps Philippines Corporation
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
                    <ChevronDown className=" w-5 h-5 " />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                  <div className="rounded-md px-4 py-3 font-mono text-sm">
                    Member 1
                  </div>
                  <div className="rounded-md px-4 py-3 font-mono text-sm">
                    Member 2
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            {/* <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter> */}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ChatHeader;
