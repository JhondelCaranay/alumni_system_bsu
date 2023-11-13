"use client";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Heart, MessagesSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import CommentInput from "./CommentInput";
import { PostSchemaType } from "@/schema/post";
import { UserWithProfile } from "@/types/types";
const DATE_FORMAT = `d MMM yyyy, HH:mm`;

type PostTypeProps = {
  postData: (PostSchemaType & {user: UserWithProfile})
}
const Post:React.FC<PostTypeProps> = ({postData}) => {
  console.log(postData.user)
  return (
    <div className="bg-white shadow-md flex flex-col w-full p-5 rounded-lg gap-y-5 px-5 dark:bg-[#1F2937] ">
      <div className="flex gap-x-2">
        <Avatar src={postData?.user?.image} />
        <div className="flex flex-col">
          <span>{postData?.user?.name || `${postData?.user?.profile?.firstname} ${postData?.user?.profile?.lastname}`}</span>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time title={ postData?.updatedAt?.toString() || new Date()?.toString()}>
              {format( new Date(postData?.updatedAt || new Date()) , DATE_FORMAT)}
            </time>
          </p>
        </div>
      </div>

      <div className="">
        <p className="dark:text-zinc-400 whitespace-pre-wrap">
          {postData?.description}
        </p>
      </div>

      <div className="flex py-5 gap-5 flex-wrap gap justify-center">
        {
          postData?.photos?.map((photo) => ((
            <Image
            src={
              photo.public_url
            }
            height={150}
            width={150} 
            alt="post image"
            className="rounded-md object-cover"
          />
          )))
        }
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
        >
          <MessagesSquare className="w-4 h-4 fill-zinc-500" /> 7 comments{" "}
        </Button>
      </div>

      <div>
        <CommentInput />
      </div>
    </div>
  );
};

export default Post;
