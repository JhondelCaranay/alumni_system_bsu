import { useSocket } from "@/components/providers/SocketProvider";
import { GroupChatMessageSchemaType } from "@/schema/groupchat-message";
import { GroupChatSchemaType } from "@/schema/groupchats";
import { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type InboxGroupchatSocketProps = {
  inboxKey: string;
  queryKey: (string | any)[];
};

export const useInboxGroupchatSocket = ({ queryKey, inboxKey }: InboxGroupchatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(inboxKey, (data: (GroupChatSchemaType & { messages: GroupChatMessageSchemaType[] })) => {
        queryClient.setQueryData(
          queryKey,
          (oldData:(GroupChatSchemaType & { messages: GroupChatMessageSchemaType[] })[]) => {
            const filteredGroupchat = oldData.filter((groupchat) => groupchat.id != data.id) as (GroupChatSchemaType & { messages: GroupChatMessageSchemaType[] })[]
            return [data, ...filteredGroupchat]
          }
        );
      }
    );

    return () => {
      socket.off(inboxKey);
    };

  }, [inboxKey, queryKey]);
};
