import { useSocket } from "@/components/providers/SocketProvider";
import { CommentSchemaType } from "@/schema/comment";
import { UserWithProfile } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  postKey: string;
  queryKey: (string | any)[];
};

export const useCommentSocket = ({ postKey, queryKey }: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(
      postKey,
      (data: CommentSchemaType & { user: UserWithProfile }) => {
        queryClient.setQueryData(
          queryKey,
          (oldData: CommentSchemaType & { user: UserWithProfile }[]) => {
            if(oldData.length <= 0) {
              const newData = [data];
              return newData;
            }
            
            const newData = [data, ...oldData];
              return newData;
            
          }
        );
      }
    );

    return () => {
      socket.off(postKey);
    };
  }, [postKey, queryKey]);
};
