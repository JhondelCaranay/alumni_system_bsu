import { useSocket } from "@/components/providers/SocketProvider";
import { CommentSchemaType } from "@/schema/comment";
import { CommentSchema, UserWithProfile } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  commentsKey?:string;
  repliesKey: string;
  editCommentsKey: string;
  deleteCommentsKey: string;
  queryKey: (string | any)[];
};

export const useCommentSocket = ({ queryKey, repliesKey, commentsKey, editCommentsKey, deleteCommentsKey }: ChatSocketProps) => {
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

    // reply listener
    socket.on(
      repliesKey,
      (data:CommentSchema) => {
        queryClient.setQueryData(
          queryKey,
          (oldData:CommentSchema[]) => {
            if( typeof oldData === 'undefined' || oldData?.length <= 0) {
              const newData = [data];
              return newData;
            }

            return oldData?.map((comments) => {
              if(comments.id !== data.id) return comments;
              
              return data;
            })
          }
        );
      }
    );

    // edit comment/reply listener
    socket.on(
      editCommentsKey,
      (data:CommentSchema & {comment: CommentSchema}) => {
        queryClient.setQueryData(
          queryKey,
          (oldData:(CommentSchema & {replies: CommentSchema[]})[]) => {

            // this is a reply that updated
             if(data.commentId && !data.postId) {
              return oldData?.map((comments) => {
                if(data.commentId !== comments.id) return comments;
                
                return data.comment;
              })
             }
             // this is a comment that updated
             else {
              return oldData?.map((comments) => {
                if(data.id !== comments.id) return comments;
                return data;
              })
             }

          }
        );
      }
    );

    // delete comment/reply listener
    socket.on(
      deleteCommentsKey,
      (data:CommentSchema & {comment: CommentSchema}) => {
        queryClient.setQueryData(
          queryKey,
          (oldData:(CommentSchema & {replies: CommentSchema[]})[]) => {

            // this is a reply that updated
             if(data.commentId && !data.postId) {
              return oldData?.map((comments) => {
                if(data.commentId !== comments.id) return comments;
                
                return data.comment;
              })
             }
             // this is a comment that updated
             else {
              return oldData?.filter((comments) => data.id !== comments.id)
             }

          }
        );
      }
    );

    return () => {
      socket.off(commentsKey);
      socket.off(repliesKey);
      socket.off(editCommentsKey);
      socket.off(deleteCommentsKey);
    };
  }, [commentsKey, queryKey, repliesKey, editCommentsKey, deleteCommentsKey]);
};
