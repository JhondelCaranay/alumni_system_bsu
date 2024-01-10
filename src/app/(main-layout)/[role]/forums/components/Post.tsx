"use client";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Archive,
  Heart,
  MessageSquareDashed,
  MessagesSquare,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CreateCommentInput from "./CreateCommentInput";
import { PostSchemaType } from "@/schema/post";
import { CommentSchema, UserWithProfile } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Comment from "./Comment";
import {
  apiClient,
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { Loader } from "@/components/ui/loader";
import { useCommentSocket } from "@/hooks/useCommentSocket";
import { Badge } from "@/components/ui/badge";
import { Like, Role } from "@prisma/client";
import { useModal } from "@/hooks/useModalStore";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import { PollOption } from "@prisma/client";

// @ts-ignore
// @ts-nocheck
import Poll from "react-polls";
import useRouterPush from "@/hooks/useRouterPush";
import { cn } from "@/lib/utils";
import { unknown } from "zod";

const DATE_FORMAT = `d MMM yyyy, HH:mm`;

type PostTypeProps = {
  postData: PostSchemaType & {
    user: UserWithProfile;
    poll_options: (PollOption & { voters: UserWithProfile[] })[];
    likes: Like[]
  };
  currentUser: GetCurrentUserType;
};

const pollStyle = {
  questionSeparator: false,
  questionSeparatorWidth: "question",
  questionBold: false,
  questionColor: "#4fbbd6",
  align: "center",
  theme: "blue",
};

const Post: React.FC<PostTypeProps> = ({ postData, currentUser }) => {

  const {redirectTo} = useRouterPush()
  const pollOptions = postData?.poll_options?.map((pollOption) => ({
    id: pollOption.id,
    option: pollOption?.option,
    votes: pollOption?.votes,
    voters: pollOption.voters,
  }))
  const [isLiked, setIsLiked] = useState(() => postData.likes.some((like) => like.userId === currentUser?.id))
  const [pollOpts, setPollOpts] = useState(() => pollOptions)
  const isVoted = pollOptions?.find((poll) =>
    poll?.voters?.some((voter) => voter?.id == currentUser?.id)
  )

  const [isCommenting, setIsCommenting] = useState(false);
  const { onOpen } = useModal();

  const comments = useQueryProcessor<
    (CommentSchema & { replies: CommentSchema[] })[]
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
  const likePost = useMutateProcessor<null, any>(`/like`, {postId: postData.id}, 'POST', ['like', postData.id])
  const isOwner = currentUser?.id === postData.userId;
  const isAdmin = currentUser?.id === Role.ADMIN;
  const canEditOrDelete = isOwner || isAdmin;

  useCommentSocket({
    commentsKey: `posts:${postData.id}:comments`,
    repliesKey: `posts:${postData.id}:reply`,
    editCommentsKey: `posts:comment-update`,
    deleteCommentsKey: `posts:comment-delete`,
    queryKey: ["discussions", postData.id, "comments"],
  });

  const commentsCount = comments.data?.reduce(
    (count, comment) => count + (1 + comment.replies.length || 0),
    0
  );

    const [likesCount, setLikesCount] = useState(() => postData.likes.length)
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
              onClick={() => redirectTo(`forums/${postData.id}`)}
            >
              {format(new Date(postData?.updatedAt || new Date()), DATE_FORMAT)}
            </time>
          </p>
        </div>

        {canEditOrDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute top-5 right-5" asChild>
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
                onClick={() => onOpen("editDiscussion", { post: postData })}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100"
                onClick={() => onOpen("deletePost", { post: postData })}
              >
                <Archive className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="">
        <p className="dark:text-zinc-400 whitespace-pre-wrap">
          {postData?.description}
        </p>
      </div>
      {(() => {
        if (pollOpts?.length) {
            return <Poll
              customStyles={pollStyle}
              question={postData.pollQuestion}
              noStorage
              answers={pollOpts}
              vote={isVoted ? isVoted.option : undefined}
              onVote={async (option: string) => {
                const chosenPoll = pollOpts?.find(
                  (poll) => option == poll.option
                );

                if(chosenPoll) {
                  chosenPoll?.voters.push(currentUser as any)
                  chosenPoll.votes = chosenPoll.votes + 1;
                  setPollOpts((prev) => {
                    return prev.map((pollOption) => {
                      if(pollOption.id === chosenPoll?.id) {
                        return chosenPoll
                      }
                      return pollOption
                    })
                  })
                  apiClient.post(
                    `/posts/${postData.id}/poll/${chosenPoll?.id}`
                  );
                }
                  
              }}
            />
        }
        return null;
      })()}
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
          className={cn("w-fit h-fit gap-x-2 text-zinc-500", isLiked && 'text-rose-500')}
          variant={"link"}
          size={"sm"}
          onClick={() => {
            likePost.mutate(null, {
              onError(error, variables, context) {
                console.error('error like', error)
              },
              onSuccess(data, variables, context) {
                setIsLiked(data.addedLike)
                setLikesCount(prev => data.addedLike ? prev + 1 : prev - 1)
              },
            })
          }}
        >
          <Heart className={cn("w-4 h-4 fill-zinc-500", isLiked && 'fill-rose-500')} /> {likesCount || 0} Likes {" "}
        </Button>
        <Button
          className="w-fit h-fit gap-x-2 text-zinc-500"
          variant={"link"}
          size={"sm"}
          onClick={() => setIsCommenting((prev) => !prev)}
        >
          <MessagesSquare className="w-4 h-4 fill-zinc-500" /> {commentsCount}{" "}
          comments{" "}
        </Button>
      </div>

      {isCommenting && (
        <>
          <div>
            <CreateCommentInput
              postId={postData.id}
              apiUrl="/comments"
              placeholder="Write a comment."
            />
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
                  <div className=" flex justify-center items-center text-center text-sm text-zinc-500 dark:text-zinc-400 gap-x-2 ">
                    <MessageSquareDashed /> No comments yet
                  </div>
                );
              }

              return comments.data?.map((comment) => (
                <Comment
                  key={comment.id}
                  data={comment}
                  currentUserId={currentUser!.id!}
                  postId={postData.id}
                />
              ));
            })()}
          </section>
        </>
      )}
    </div>
  );
};

export default Post;
