"use client";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { SafeUser, UserWithProfile } from "@/types/types";
import { CommentSchemaType } from "@/schema/comment";
import { PostSchemaType } from "@/schema/post";
import { format } from "date-fns";
import Avatar from "@/components/Avatar";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import useWindowSize from "@/hooks/useWindowSize";

const FroalaEditorView = dynamic(() => import("react-froala-wysiwyg/FroalaEditorView"), {
  ssr: false,
});

type JobPostProps = {
  post: PostSchemaType;
  user: UserWithProfile;
  comments: CommentSchemaType & {
    user: UserWithProfile;
  };
};

const DATE_FORMAT = `d MMM yyyy, HH:mm`;

const JobPost: React.FC<JobPostProps> = ({ user, comments, post }) => {
  const windowSize = useWindowSize();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const f = searchParams?.get("f");
  const router = useRouter();

  const onClick = () => {
    if (windowSize.width > 768) {
      //  when the screen is bigger than 768px, we will use query string to store the id of the job post
      const url = qs.stringifyUrl(
        {
          url: pathname || "",
          query: {
            f: post.id,
          },
        },
        { skipNull: true }
      );

      router.push(url);
    } else {
      //  when the screen is smaller than 768px, redirect to the job post page
      router.push(pathname + `/${post.id}/view`);
    }
  };

  return (
    <article
      className={cn(
        "p-6 bg-white rounded-lg border shadow-md dark:bg-gray-800 cursor-pointer min-h-[200px] max-h-[350px] overflow-hidden relative",
        post.id === f && windowSize.width > 768
          ? "border-blue-500 "
          : "border-gray-200 dark:border-gray-700"
      )}
      onClick={onClick}
    >
      {/* <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="w-7 h-7 rounded-full" src={user?.image} />
          <span className="font-medium dark:text-white">{user?.name}</span>
        </div>
        <p className="text-sm">{format(new Date(post?.createdAt || new Date()), DATE_FORMAT)}</p>
      </div> */}
      <div className="flex items-center space-x-4">
        <Avatar className="w-7 h-7 rounded-full" src={user?.image} />
        <span className="font-medium dark:text-white">{user?.profile.firstname} {user?.profile.lastname}</span>
        <span className="text-sm">
          {format(new Date(post?.createdAt || new Date()), DATE_FORMAT)}
        </span>
      </div>

      <div className="my-5 max-h-[350px] overflow-hidden truncate p-2 bg-white dark:text-white dark:bg-[#1F2937]">
        <FroalaEditorView
          model={post?.description}
          config={{
            backgroundColor: "rgb(31, 41, 55)",
          }}
        />
      </div>
      {/* <div className="absolute top-3 right-3">
        <Button variant={"ghost"} size={"icon"}>
          <Heart className="w-5 h-5" />
        </Button>
        <Button variant={"ghost"} size={"icon"}>
          <MessageSquare className="w-5 h-5" />
        </Button>
        <Button variant={"ghost"} size={"icon"}>
          <Share2 className="w-5 h-5" />
        </Button>
      </div> */}
    </article>
  );
};

export default JobPost;
