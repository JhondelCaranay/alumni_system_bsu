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
import { Filter, Plus } from "lucide-react";
import { useModal } from "@/hooks/useModalStore";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { GroupChatSchemaType } from "@/schema/groupchats";
import { Loader2 } from "@/components/ui/loader";
import { GroupChatMessageSchemaType } from "@/schema/groupchat-message";
import { Role } from "@prisma/client";
import InboxItemMobile from "./InboxItemMobile";
import { Hint } from "@/components/hint";

type Props = {
  currentUser: GetCurrentUserType;
};

const InboxMobile = ({ currentUser }: Props) => {
  
  const inboxes = useQueryProcessor<
    (GroupChatSchemaType & { messages: GroupChatMessageSchemaType[] })[]
  >("/groupchats", { userId: currentUser?.id }, ["groupchats"], {
    enabled: !!currentUser?.id,
  });

  const { onOpen } = useModal();
  return (
    <div className="flex md:hidden flex-col h-full w-[70px] bg-[#FFFFFF] rounded-xl dark:bg-slate-900 overflow-auto">
      <div className="w-full flex flex-col justify-center p-1 pt-3 gap-y-2 border border-x-0 border-t-0 border-b-1">
        <div className="flex items-center justify-center">
          {(currentUser?.role === Role.ADMIN ||
            currentUser?.role === Role.ADVISER) && (
            <Hint label={"Create group chat"} side="right">
              <Plus
                className="h-10 w-10 cursor-pointer bg-white text-black rounded-full"
                onClick={() => onOpen("createGroupChat", { user: currentUser })}
              />
            </Hint>
          )}
        </div>

        <div className="flex items-center justify-center">
          <Select>
            <Hint label={"Filter"} side="right" asChild>
              <SelectTrigger className="w-12 h-12 text-xs rounded-full">
                <Filter className="w-10 h-10" />
              </SelectTrigger>
            </Hint>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Inbox">Inbox</SelectItem>
                <SelectItem value="Archive">Archive</SelectItem>
                <SelectItem value="Spam">Spam</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
            <Hint label={inbox.name} side="right" key={inbox.id}>
              <InboxItemMobile data={inbox} />
            </Hint>
          ));
        })()}
      </div>
    </div>
  );
};
export default InboxMobile;
