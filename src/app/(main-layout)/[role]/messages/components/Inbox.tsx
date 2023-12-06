import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import React from "react";
import InboxItem from "./InboxItem";

const Inbox = () => {
  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] flex-[0.4] rounded-xl">
      <div className="flex flex-col p-5 gap-y-5 border border-x-0 border-t-0 border-b-1">
        <h1 className="text-[1.5em]">Messages</h1>
        <Select >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Inbox">Inbox</SelectItem>
              <SelectItem value="Archive">Archive</SelectItem>
              <SelectItem value="Spam">Spam</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col">
        <InboxItem />
        <InboxItem />
        <InboxItem />
        <InboxItem />
      </div>
    </div>
  );
};

export default Inbox;
