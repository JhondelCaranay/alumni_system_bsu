"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect } from "react";
import InboxItem from "./groupchat/InboxGroupchatItem";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/useModalStore";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { GroupChatSchemaType } from "@/schema/groupchats";
import { Loader2 } from "@/components/ui/loader";
import { GroupChatMessageSchemaType } from "@/schema/groupchat-message";
import { Role } from "@prisma/client";
import { useInboxGroupchatSocket } from "@/hooks/useInboxGroupchatSocket";
import useRouterPush from "@/hooks/useRouterPush";
import InboxGroupchat from "./groupchat/InboxGroupchat";
import { usePathname } from "next/navigation";

type InboxProps = {
  currentUser: GetCurrentUserType;
};
const Inbox: React.FC<InboxProps> = ({ currentUser }) => {
  
  
  const {redirectTo} = useRouterPush()

  const onSelect = (page:string) => {
      redirectTo(`messages/${page}`)
  }

  const pathname = usePathname()
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
        <Select onValueChange={(e) => onSelect(e)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select"  />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="groupchats" >Groupchat</SelectItem>
              <SelectItem value="conversations">Conversations</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {
        (() => {
          if(pathname?.includes('groupchats'))
          return <InboxGroupchat currentUser={currentUser}/>

          if(pathname?.includes('conversations'))
          return null
        })()
      }
      
    </div>
  );
};

export default Inbox;
