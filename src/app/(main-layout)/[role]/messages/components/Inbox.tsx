"use client";
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
import { Loader2 } from "@/components/ui/loader";
import { GroupChatMessageSchemaType } from "@/schema/groupchat-message";
import { Role } from "@prisma/client";
import { useInboxSocket } from "@/hooks/useInboxSocket";

type InboxProps = {
  currentUser: GetCurrentUserType;
};
const Inbox: React.FC<InboxProps> = ({ currentUser }) => {
  const inboxes = useQueryProcessor<
    (GroupChatSchemaType & { messages: GroupChatMessageSchemaType[] })[]
  >("/groupchats", { userId: currentUser?.id }, ["groupchats", currentUser?.id], {
    enabled: !!currentUser?.id,
  });
  
  const inboxKey = `inbox:${currentUser?.id}:sort`

  useInboxSocket({
    queryKey:  ["groupchats", currentUser?.id],
    inboxKey: inboxKey
  })
  const { onOpen } = useModal();
  return (
    <div className="hidden md:flex flex-col h-full bg-[#FFFFFF] flex-[0.4] rounded-xl dark:bg-slate-900">
      <div className="flex flex-col p-5 gap-y-5 border border-x-0 border-t-0 border-b-1">
        <div className="flex items-center">
          <h1 className="text-[1.5em]">Messages</h1>
          {(currentUser?.role === Role.ADMIN ||
            currentUser?.role === Role.ADVISER) && (
            <Plus
              className="h-6 w-6 ml-auto cursor-pointer"
              onClick={() => onOpen("createGroupChat", { user: currentUser })}
            />
          )}
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
        {(() => {
          if (inboxes.status === "pending" || inboxes.isFetching) {
            return (
              <Loader2
                size={30}
                className="mx-auto mt-20"
                color="#3498db"
              ></Loader2>
            );
          }

          if (inboxes.status === "error") {
            return <div>errror...</div>;
          }

          return inboxes.data.map((inbox) => (
            <InboxItem data={inbox} key={inbox?.id} />
          ));
        })()}
      </div>
    </div>
  );
};

export default Inbox;
