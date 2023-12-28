import { GetCurrentUserType } from "@/actions/getCurrentUser";
import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { GroupChatMessageSchemaType } from "@/schema/groupchat-message";
import { UserWithProfile } from "@/types/types";
import { User } from "@prisma/client";
import React from "react";

type ChatMessageProps = {
  data: GroupChatMessageSchemaType & {sender: UserWithProfile}
  currentUser:GetCurrentUserType;

}

const ChatMessage:React.FC<ChatMessageProps> = ({data, currentUser}) => {
  return (
    <div className={ cn("flex w-fit gap-x-3", data.senderId == currentUser?.id && 'flex-row-reverse ml-auto')}>
      <div className="flex w-[70px] mt-2">
        <Avatar src={data?.sender?.image}/>
      </div>
      <div className="flex flex-col w-full">
        <h1 className={cn("text-[1em]", data.senderId == currentUser?.id && 'text-end' )}>{data?.sender?.profile?.firstname} {data?.sender?.profile?.lastname}</h1>
        <p className={cn("text-sm", data.senderId == currentUser?.id && 'text-end' )}>
          {data?.message}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
