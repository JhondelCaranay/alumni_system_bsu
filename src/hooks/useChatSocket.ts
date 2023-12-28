import { useSocket } from "@/components/providers/SocketProvider";
import { GroupChatMessageSchemaType } from "@/schema/groupchat-message";
import { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  chatKey: string;
  queryKey: (string | any)[];
};

export const useChatSocket = ({ queryKey, chatKey }: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on(chatKey, (data: (GroupChatMessageSchemaType & {sender: User})) => {
        queryClient.setQueryData(
          queryKey,
          (oldData:(GroupChatMessageSchemaType & {sender: User})[]) => {
            return [...oldData, data]
          }
        );
      }
    );

    return () => {
      socket.off(chatKey);
    };

  }, [chatKey, queryKey]);
};
