import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/useModalStore";
import { CommentSchema } from "@/types/types";
import { format } from "date-fns";
import { Archive, MoreHorizontal, Pencil } from "lucide-react";
import React, { useState } from "react";
import EditCommentInput from "./EditCommentInput";

type ReplyProps = {
  data: CommentSchema;
  currentUserId: string;
  onReplyInput: () => void;
  postId?: string;
};
const DATE_FORMAT = `d MMM yyyy, HH:mm`;

const Reply: React.FC<ReplyProps> = ({
  data,
  currentUserId,
  onReplyInput,
  postId,
}) => {
  const canEditOrDeleteComment = currentUserId === data.userId;

  console.log(currentUserId,
    data.userId)
  const { onOpen } = useModal();

  const [isUpdatingReplyOrComment, setIsUpdatingReplyOrComment] =
    useState(false);
  if (isUpdatingReplyOrComment) {
    return (
      <div className="flex items-center w-full gap-x-2">
        <EditCommentInput
          apiUrl={`/comments/${data.id}`}
          content={data.description}
          callback={() => setIsUpdatingReplyOrComment(false)}
        />
        <Button
          variant={"outline"}
          onClick={() => setIsUpdatingReplyOrComment(false)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
            <img
              className="mr-2 w-6 h-6 rounded-full"
              src={data?.user?.image as string}
              alt="Jese Leos"
            />
            {data?.user?.profile?.firstname} {data?.user?.profile?.lastname}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time title="February 12th, 2022">
              {format(new Date(data?.createdAt || new Date()), DATE_FORMAT)}
            </time>
          </p>
        </div>
        {canEditOrDeleteComment && (
          <DropdownMenu>
            <DropdownMenuTrigger className="" asChild>
              <Button
                className="inline-flex items-center text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-0 focus:outline-none dark:bg-transparent dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                type="button"
                variant={"ghost"}
                size={"icon"}
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="">
              <DropdownMenuItem
                className="text-xs cursor-pointer hover:bg-zinc-400"
                onClick={() => setIsUpdatingReplyOrComment(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100"
                onClick={() => onOpen("deleteComment", { comment: data })}
              >
                <Archive className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </footer>
      <p className="text-gray-500 dark:text-gray-400">{data.description}</p>
      <div className="flex items-center mt-4 space-x-4">
        <button
          type="button"
          className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
          onClick={onReplyInput}
        >
          <svg
            className="mr-1.5 w-3.5 h-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 18"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
            />
          </svg>
          Reply
        </button>
      </div>
    </article>
  );
};

export default Reply;
