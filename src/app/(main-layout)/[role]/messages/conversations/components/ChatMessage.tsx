import { GetCurrentUserType } from "@/actions/getCurrentUser";
import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { DirectMessageSchemaType } from "@/schema/direct-message";
import { GroupChatMessageSchemaType } from "@/schema/groupchat-message";
import { UserWithProfile } from "@/types/types";
import { User } from "@prisma/client";
import { Clock } from "lucide-react";
import React from "react";
import { format } from "timeago.js";

type ChatMessageProps = {
  data: (DirectMessageSchemaType & {sender: UserWithProfile})
  currentUser:GetCurrentUserType;

}

const ChatMessage:React.FC<ChatMessageProps> = ({data, currentUser}) => {
  return (
    <div className={ cn("flex w-full md:w-fit gap-x-3", data.senderId == currentUser?.id && 'flex-row-reverse ml-auto')}>
      <div className="flex w-[70px] mt-2">
        
        <Avatar src={data?.sender?.image}/>
      </div>
      
      <div className="flex flex-col w-full gap-y-3">
        <h1 className={cn(" text-sm md:text-[1em] line-clamp-1", data.senderId == currentUser?.id && 'text-end' )}>{data?.sender?.profile?.firstname} {data?.sender?.profile?.lastname}</h1>
        <p className={cn("text-[13px] md:text-sm", data.senderId == currentUser?.id && 'text-end' )}>
          {data?.content}
        </p>
        <time className={cn("text-xs flex items-center gap-x-1", data?.senderId == currentUser?.id && 'self-end')}>
         <Clock className="w-3 h-3 fill-zinc-200"/> {format(data.createdAt || new Date())}
        </time>
      </div>
      
    </div>
  );
};

export default ChatMessage;
