"use client";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { useParams } from "next/navigation";
import React from "react";
import Post from "../../components/Post";
import { PostSchemaType } from "@/schema/post";
import { CommentSchema, UserWithProfile } from "@/types/types";
import { Like, PollOption } from "@prisma/client";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import { Loader } from "@/components/ui/loader";

type ForumDetailClientProps = {
  currentUser: GetCurrentUserType;
};
const ForumDetailClient: React.FC<ForumDetailClientProps> = ({
  currentUser,
}) => {
  const params = useParams();
  const postId = params?.postId as string;
  const discussion = useQueryProcessor<
    PostSchemaType & {
      user: UserWithProfile;
      poll_options: (PollOption & { voters: UserWithProfile[] })[];
      likes: Like[]
    }
  >(`/posts/${postId}`, { type: "FEED" }, ["discussion", postId]);

  if (discussion.status == "pending") {
    return <Loader />;
  }
  
  if (discussion.status == "error") {
    return null;
  }
  
  return (
    <div className="grid grid-cols-4 bg-[#F9FAFB] min-h-[90vh] w-full p-3 md:p-5 pb-0 dark:bg-[#020817]">
      <div className="hidden md:inline-block"></div>
      <div className="col-span-4 md:col-span-2 md:px-5">
        <Post currentUser={currentUser} postData={discussion.data} isCommentSectionOpen={true} />
      </div>
      <div className="hidden md:inline-block"></div>
    </div>
  );
};

export default ForumDetailClient;
