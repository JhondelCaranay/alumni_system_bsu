"use client";
import React from "react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import { useParams, useSearchParams } from "next/navigation";
import { MessageSquareDashed } from "lucide-react";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Loader, Loader2 } from "@/components/ui/loader";
import { GroupChatSchemaType } from "@/schema/groupchats";
import { DirectMessage, User } from "@prisma/client";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import { UserWithProfile } from "@/types/types";
import { ConversationSchemaType } from "@/schema/conversation";

type ChatBoxProps = {
  currentUser: GetCurrentUserType;
};

const ChatBox: React.FC<ChatBoxProps> = ({ currentUser }) => {
  const params = useParams();
  const conversationId = params?.conversationId

  const conversation = useQueryProcessor<
    (ConversationSchemaType & { participants: UserWithProfile[], messages: DirectMessage[] })
  >(`/conversations/${conversationId}`, null, ["conversations", conversationId], { enabled: !!conversationId });

  if (!conversationId) {
    return (
      <div className="flex flex-1 gap-x-3 bg-[#FFFFFF] rounded-xl dark:bg-slate-900">
        <h1 className="text-zinc-500 text-center w-full flex items-center justify-center gap-x-2 text-sm md:text-md">
          {" "}
          <MessageSquareDashed className="w-10 h-10" />{" "}
          <span>No chats selected</span>{" "}
        </h1>
      </div>
    );
  }

  if (conversation.status === "pending") {
    return (
      <div className="flex flex-1 gap-x-3 bg-[#FFFFFF] rounded-xl justify-center items-center dark:bg-slate-900 h-full">
        <Loader2 color="#3498db" size={30} />
      </div>
    );
  }

  if (conversation.status === "error") {
    return (
      <div className="flex flex-col h-full bg-[#FFFFFF] rounded-xl flex-1 justify-center items-center">
        {" "}
        Conversation not found
      </div>
    );
  }

  return (
    <div className="flex flex-1 gap-x-3 h-full">
      <div className="flex flex-col h-full bg-[#FFFFFF] rounded-xl flex-1 dark:dark:bg-slate-900">
        <ChatHeader data={conversation.data} currentUser={currentUser} />
        <ChatBody currentUser={currentUser} />
        <ChatFooter data={conversation.data} />
      </div>
    </div>
  );
};

export default ChatBox;
