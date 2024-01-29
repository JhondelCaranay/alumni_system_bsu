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

type InboxGroupchatItemProps = {
  data: GroupChatSchemaType & { messages: GroupChatMessageSchemaType[] };
};

const InboxGroupchatItem: React.FC<InboxGroupchatItemProps> = ({ data }) => {
  const params = useParams();
  const pathname = usePathname();
  const groupchatId = params?.groupchatId
  const router = useRouter();
  const {redirectTo} = useRouterPush()
  const onClick = () => {
    redirectTo(`/messages/groupchats/${data?.id}`)
  };
  
  const lastMessage = data?.messages?.[data?.messages?.length - 1]

  return (
    <div
      className={cn(
        "flex max-h-[95px] overflow-hidden border border-x-0 border-t-0 border-b-1 p-2 gap-x-2 cursor-pointer",
        groupchatId === data?.id && "bg-zinc-100 dark:bg-slate-800 "
      )}
      onClick={onClick}
    >
      <div className=" flex justify-center items-center">
        <Avatar
          src={data?.image}
          className="w-12 h-12 object-cover m-auto rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <h2 className="text-[1.2em] font-semibold text-zinc-600 dark:text-gray-400">
          {data?.name}
        </h2>
        <p className="text-[0.9em] line-clamp-2 ">
          {lastMessage?.message ?? "This is the start of your group chat conversation"}
        </p>
        <time className={cn("text-xs flex items-center gap-x-1")}>
         <Clock className="w-3 h-3 fill-zinc-200"/> {format(lastMessage?.createdAt || data.updatedAt  || new Date())}
        </time>
      </div>
    </div>
  );
};
export default InboxGroupchatItem;
