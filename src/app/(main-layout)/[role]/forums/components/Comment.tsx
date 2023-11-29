import Avatar from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommentSchema } from "@/types/types";
import { format } from "date-fns";
import { Archive, MoreHorizontal, Pencil } from "lucide-react";
import React, { useState } from "react";
import Reply from "./Reply";
import CommentInput from "./CommentInput";
const DATE_FORMAT = `d MMM yyyy, HH:mm`;

type CommentProps = {
  data: CommentSchema & { replies: CommentSchema[] };
};
const Comment: React.FC<CommentProps> = ({ data }) => {
  const [isReplying, setIsReplying] = useState(false);

  const onReplyInput = () => {
    setIsReplying((prev) => !prev);
  };

  return (
    <article className="px-6 py-3 text-base bg-white rounded-lg dark:bg-transparent">
      <footer className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
            <Avatar
              className="mr-2 w-6 h-6 rounded-full"
              src={data?.user?.image}
            />
            {data?.user?.name ||
              `${data?.user?.profile?.firstname} ${data?.user?.profile?.lastname}`}
          </div>
          <span className="text-xs">
            <Badge className="capitalize text-[10px]">
              {data?.user?.role?.toLowerCase()}
            </Badge>
          </span>
        </div>

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
            <DropdownMenuItem className="text-xs cursor-pointer hover:bg-zinc-400">
              <Pencil className="h-4 w-4 mr-2" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100">
              <Archive className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </footer>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        {" "}
        {data?.description}
      </p>
      <div className="flex items-center mt-4 space-x-4">
        <p className=" text-gray-600 dark:text-gray-400 text-xs cursor-pointer hover:underline">
          <time title={new Date().toString()}>
            {format(new Date(data?.createdAt || new Date()), DATE_FORMAT)}
          </time>
        </p>

        <button
          type="button"
          onClick={onReplyInput}
          className="flex items-center text-gray-500 hover:underline dark:text-gray-400 font-medium text-xs"
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
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
            />
          </svg>
          Reply
        </button>
      </div>

      <section className="flex flex-col px-6 py-0">
        {data.replies.map((reply) => (
          <Reply key={reply.id} data={reply} onReplyInput={onReplyInput} />
        ))}

        {isReplying && (
          <CommentInput
            postId={data?.postId}
            placeholder="Write a reply."
            apiUrl={`/comments/${data?.id}`}
          />
        )}
      </section>
    </article>
  );
};

export default Comment;
