"use client";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Archive,
  Heart,
  MessagesSquare,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import CommentInput from "./CommentInput";
import { PostSchemaType } from "@/schema/post";
import { UserWithProfile } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Comment from "./Comment";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { CommentSchemaType } from "@/schema/comment";
import { Loader } from "@/components/ui/loader";
import { useCommentSocket } from "@/hooks/useCommentSocket";
import { Badge } from "@/components/ui/badge";

const DATE_FORMAT = `d MMM yyyy, HH:mm`;

type PostTypeProps = {
  postData: PostSchemaType & { user: UserWithProfile };
};
const Post: React.FC<PostTypeProps> = ({ postData }) => {
  const [isCommenting, setIsCommenting] = useState(false);

  const comments = useQueryProcessor<
    (CommentSchemaType & { user: UserWithProfile })[]
  >(
    `/comments`,
    { postId: postData?.id },
    ["discussions", postData?.id, "comments"],
    {
      enabled:
        typeof postData?.id === "string" &&
        typeof postData?.id !== "object" &&
        typeof postData?.id !== "undefined",
      // isCommenting,
    }
  );

  useCommentSocket({
    postKey: `posts:${postData.id}:comments`,
    queryKey: ["discussions", postData.id, "comments"],
  });

  return (
    <div className="bg-white shadow-md flex flex-col w-full p-5 rounded-lg gap-y-5 px-5 dark:bg-[#1F2937] relative">
      <div className="flex gap-x-2 items-center">
        <Avatar src={postData?.user?.image} />
        <div className="flex flex-col">
          <span className="font-semibold flex">
            <span>
              {postData?.user?.name ||
                `${postData?.user?.profile?.firstname} ${postData?.user?.profile?.lastname}`}
            </span>
            <Badge className="capitalize ml-2 text-[10px]">
              {postData?.user?.role?.toLowerCase()}
            </Badge>
          </span>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            <time
              title={postData?.updatedAt?.toString() || new Date()?.toString()}
              className="cursor-pointer hover:underline"
            >
              {format(new Date(postData?.updatedAt || new Date()), DATE_FORMAT)}
            </time>
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="absolute top-5 right-5">
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
      </div>

      <div className="">
        <p className="dark:text-zinc-400 whitespace-pre-wrap">
          {postData?.description}
        </p>
      </div>

      <div className="flex py-5 gap-5 flex-wrap gap justify-center">
        {postData?.photos?.map((photo) => (
          <Image
            key={photo.id}
            src={photo.public_url}
            height={150}
            width={150}
            alt="post image"
            className="rounded-md object-cover"
          />
        ))}
      </div>

      <div className="border border-y-2 flex items-center h-10 border-x-0 dark:border-[#71717A]">
        <Button
          className="w-fit h-fit gap-x-2 text-zinc-500"
          variant={"link"}
          size={"sm"}
        >
          <Heart className="w-4 h-4 fill-zinc-500" /> 7 Likes{" "}
        </Button>
        <Button
          className="w-fit h-fit gap-x-2 text-zinc-500"
          variant={"link"}
          size={"sm"}
          onClick={() => setIsCommenting((prev) => !prev)}
        >
          <MessagesSquare className="w-4 h-4 fill-zinc-500" />{" "}
          {comments?.data?.length || 0} comments{" "}
        </Button>
      </div>

      {isCommenting && (
        <>
          <div>
            <CommentInput postId={postData.id} />
          </div>
          <section className="flex flex-col">
            {(() => {
              if (comments.status === "pending" || comments.isFetching) {
                return <Loader size={20} />;
              }

              if (comments.status === "error") {
                return <div>Something went wrong...</div>;
              }

              if (comments?.data?.length <= 0) {
                return (
                  <div className="text-center text-sm text-zinc-500 dark:text-white">
                    No comments yet
                  </div>
                );
              }

              return comments.data?.map((comment) => (
                <Comment data={comment} />
              ));
            })()}
          </section>
        </>
      )}
    </div>
  );
};

export default Post;
