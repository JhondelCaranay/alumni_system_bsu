"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import InboxItem from "./InboxItem";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/useModalStore";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { GroupChatSchemaType } from "@/schema/groupchats";

type InboxProps = {
  currentUser:GetCurrentUserType
}
const Inbox:React.FC<InboxProps> = ({currentUser}) => {

  const inboxes = useQueryProcessor<GroupChatSchemaType[]>('/groupchats', null, ['groupchats']);
  
  const { onOpen } = useModal();
  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] flex-[0.4] rounded-xl">
      <div className="flex flex-col p-5 gap-y-5 border border-x-0 border-t-0 border-b-1">
        <div className="flex items-center">
          <h1 className="text-[1.5em]">Messages</h1>
          <Plus className="h-6 w-6 ml-auto cursor-pointer" onClick={() => onOpen('createGroupChat', {user: currentUser})} />
        </div>
        <Select>
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
        {
          (() => {
            if(inboxes.status === 'pending' || inboxes.isFetching) {
              return <div>loading...</div>
            }

            if(inboxes.status === 'error') {
              return <div>errror...</div>
            }

            return inboxes.data.map((inbox) => (
              <InboxItem data={inbox} />
            ))
          })()
        }
      </div>
    </div>
  );
};

export default Inbox;
