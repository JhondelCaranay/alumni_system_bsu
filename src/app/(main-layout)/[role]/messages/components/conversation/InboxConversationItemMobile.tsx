"use client";

import { GroupChatSchemaType } from "@/schema/groupchats";
import { useSearchParams, usePathname, useRouter, useParams } from "next/navigation";
import React from "react";
import qs from "query-string";
import { GroupChatMessageSchemaType } from "@/schema/groupchat-message";
import { cn } from "@/lib/utils";
import Avatar from "@/components/Avatar";
import useRouterPush from "@/hooks/useRouterPush";
import { UserWithProfile } from "@/types/types";
import { DirectMessage } from "@prisma/client";
import { ConversationSchemaType } from "@/schema/conversation";
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
    redirectTo(`/messages/conversations/${conversationId}`)
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
    </div>
  );
};

export default InboxConversationItem;
