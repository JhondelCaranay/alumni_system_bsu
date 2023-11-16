import { useSocket } from "@/components/providers/SocketProvider";
import { CommentSchemaType } from "@/schema/comment";
import { CommentSchema, UserWithProfile } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  commentsKey:string;
  repliesKey: string;
  queryKey: (string | any)[];
};

export const useCommentSocket = ({ queryKey, repliesKey, commentsKey }: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    // comment listener
    socket.on(
      commentsKey,
      (data: CommentSchema) => {
        queryClient.setQueryData(
          queryKey,
          (oldData:CommentSchema[]) => {
            if(oldData?.length <= 0) {
              const newData = [data];
              return newData;
            }
            
            const newData = [data, ...oldData];
              return newData;
            
          }
        );
      }
    );

    // reply listener
    socket.on(
      repliesKey,
      (data:CommentSchema) => {
        queryClient.setQueryData(
          queryKey,
          (oldData:CommentSchema[]) => {
            if(oldData?.length <= 0) {
              const newData = [data];
              return newData;
            }

            return oldData.map((comments) => {
              if(comments.id !== data.id) return comments;
              return data;
            })
          }
        );
      }
    );

    return () => {
      socket.off(commentsKey);
      socket.off(repliesKey);
    };
  }, [commentsKey, queryKey, repliesKey]);
};
