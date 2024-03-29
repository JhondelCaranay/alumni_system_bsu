"use client";

import { GroupChatSchemaType } from "@/schema/groupchats";
import { useSearchParams, usePathname, useRouter, useParams } from "next/navigation";
import React from "react";
import qs from "query-string";
import { GroupChatMessageSchemaType } from "@/schema/groupchat-message";
import { cn } from "@/lib/utils";
import Avatar from "@/components/Avatar";
import { Clock } from "lucide-react";
import { format } from "timeago.js";
import useRouterPush from "@/hooks/useRouterPush";
import { ConversationSchemaType } from "@/schema/conversation";
import { DirectMessage, User } from "@prisma/client";
import { SafeUser, UserWithProfile } from "@/types/types";
import { GetCurrentUserType } from "@/actions/getCurrentUser";

type InboxConversationItemProps = {
  data: ConversationSchemaType & { participants: UserWithProfile[], messages: DirectMessage[] };
  currentUser: GetCurrentUserType
};

const InboxConversationItem: React.FC<InboxConversationItemProps> = ({ data, currentUser }) => {
  const params = useParams();
  const conversationId = params?.conversationId
  const {redirectTo} = useRouterPush()
  const onClick = () => {
    redirectTo(`/messages/conversations/${data.id}`)
  };
  
  const lastMessage = data?.messages?.[data?.messages?.length - 1]
  const otherUser = data?.participants?.find((user) => user.id != currentUser?.id)
  return (
    <div
      className={cn(
        "flex max-h-[95px] overflow-hidden border border-x-0 border-t-0 border-b-1 p-2 gap-x-2 cursor-pointer",
        conversationId === data?.id && "bg-zinc-100 dark:bg-slate-800 "
      )}
      onClick={onClick}
    >
      <div className=" flex justify-center items-center">
        <Avatar
          src={otherUser?.image}
          className="w-12 h-12 object-cover m-auto rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <h2 className="text-[1.2em] font-semibold text-zinc-600 dark:text-gray-400">
          {otherUser?.profile.firstname} {otherUser?.profile.lastname}
        </h2>
        <p className="text-[0.9em] line-clamp-2 ">
          {lastMessage?.content ?? "This is the start of your group chat conversation"}
        </p>
        <time className={cn("text-xs flex items-center gap-x-1")}>
         <Clock className="w-3 h-3 fill-zinc-200"/> {format(lastMessage?.createdAt || data.updatedAt  || new Date())}
        </time>
      </div>
    </div>
  );
};
export default InboxConversationItem;
