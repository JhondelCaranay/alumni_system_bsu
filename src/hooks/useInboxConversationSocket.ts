import { useSocket } from "@/components/providers/SocketProvider";
import { ConversationSchemaType } from "@/schema/conversation";
import { GroupChatMessageSchemaType } from "@/schema/groupchat-message";
import { GroupChatSchemaType } from "@/schema/groupchats";
import { UserWithProfile } from "@/types/types";
import { DirectMessage, User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type InboxConversationSocketProps = {
  inboxKey: string;
  queryKey: (string | any)[];
};

export const useInboxConversationSocket = ({ queryKey, inboxKey }: InboxConversationSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(inboxKey, (data: (ConversationSchemaType & { participants: UserWithProfile[], messages: DirectMessage[] })) => {
        queryClient.setQueryData(
          queryKey,
          (oldData:(ConversationSchemaType & { participants: UserWithProfile[], messages: DirectMessage[] })[]) => {
            const filteredConversation = oldData?.filter((conversation) => conversation.id != data.id) as (ConversationSchemaType & { participants: UserWithProfile[], messages: DirectMessage[] })[]
            return [, ...filteredConversation, data]
          }
        );
      }
    );

    return () => {
      socket.off(inboxKey);
    };

  }, [inboxKey, queryKey]);
};
