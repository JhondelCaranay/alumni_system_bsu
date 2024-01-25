import { useSocket } from "@/components/providers/SocketProvider";
import { GroupChatMessageSchemaType } from "@/schema/groupchat-message";
import { UserWithProfile } from "@/types/types";
import { Like, Post, User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type UseNotificationSocketProps = {
  notificationCreateKey: string;
  notificationUpdateKey: string;
  queryKey: (string | any)[];
};

export const useNotificationSocket = ({
  queryKey,
  notificationCreateKey,
  notificationUpdateKey,
}: UseNotificationSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(
      notificationCreateKey,
      (
        data: Notification & {
          post: Post;
          usersWhoInteract: User[];
          comment: Comment;
          like: Like;
          user: UserWithProfile;
        }
      ) => {
        queryClient.setQueryData(
          queryKey,
          (
            oldData: (Notification & {
              post: Post;
              usersWhoInteract: User[];
              comment: Comment;
              like: Like;
              user: UserWithProfile;
            })[]
          ) => {
            if(typeof oldData === 'undefined' || oldData?.length <= 0) {
                const newData = [data];
                return newData;
              }
              
              const newData = [data, ...oldData];
                return newData;
          }
        );
      }
    );

    socket.on(notificationUpdateKey, (data: any) => {
    });

    return () => {
      socket.off(notificationUpdateKey);
      socket.off(notificationCreateKey);
    };
  }, [notificationCreateKey, notificationUpdateKey, queryKey]);
};
