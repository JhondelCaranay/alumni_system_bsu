import { useSocket } from "@/components/providers/SocketProvider";
import { DirectMessageSchemaType } from "@/schema/direct-message";
import { GroupChatMessageSchemaType } from "@/schema/groupchat-message";
import { UserWithProfile } from "@/types/types";
import { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  chatKey: string;
  queryKey: (string | any)[];
};

export const useConversationChatSocket = ({ queryKey, chatKey }: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on(chatKey, (data: (DirectMessageSchemaType & {sender: UserWithProfile})) => {
        queryClient.setQueryData(
          queryKey,
          (oldData:(DirectMessageSchemaType & {sender: UserWithProfile})[]) => {
            console.log(data, oldData)
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
