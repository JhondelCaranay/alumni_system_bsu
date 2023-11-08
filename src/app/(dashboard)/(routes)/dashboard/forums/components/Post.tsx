"use client";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Heart, MessagesSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import CommentInput from "./CommentInput";
const DATE_FORMAT = `d MMM yyyy, HH:mm`;

const Post = () => {
  const { data } = useSession();
  return (
    <div className="bg-white shadow-md flex flex-col w-full p-5 rounded-lg gap-y-5 px-10">
      <div className="flex gap-x-2">
        <Avatar src={data?.user?.image} />
        <div className="flex flex-col">
          <span>{data?.user.name}</span>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time title={new Date()?.toString()}>
              {format(new Date(), DATE_FORMAT)}
            </time>
          </p>
        </div>
      </div>

      <div>
        <p>
          Hi @everyone, the new designs are attached. Go check them out and let
          me know if I missed anything. Thanks!
        </p>
      </div>

      <div className="flex py-5 gap-x-5">
        <Image
          src={
            "https://flowbite.com/application-ui/demo/images/feed/image-1.jpg"
          }
          height={150}
          width={150}
          alt="post image"
        />
        <Image
          src={
            "https://flowbite.com/application-ui/demo/images/feed/image-2.jpg"
          }
          height={150}
          width={150}
          alt="post image"
        />
      </div>

      <div className="border border-y-2 flex items-center h-10 border-x-0 ">
        <Button
          className="w-fit h-fit gap-x-2 text-zinc-500"
          variant={"link"}
          size={"sm"}
        >
          <MessagesSquare className="w-4 h-4 fill-zinc-500" /> 7 comments{" "}
        </Button>
        <Button
          className="w-fit h-fit gap-x-2 text-zinc-500"
          variant={"link"}
          size={"sm"}
        >
          <Heart className="w-4 h-4 fill-zinc-500" /> 7 Likes{" "}
        </Button>
      </div>

      <div>
        <CommentInput />
      </div>
    </div>
  );
};

export default Post;
