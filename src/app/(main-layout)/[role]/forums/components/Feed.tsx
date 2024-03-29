"use client";
import React from "react";
import Post from "./Post";
import CreateFeedInput from "./CreateFeedInput";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import JobSkeletonList from "../../jobs/components/JobSkeletonList";
import { PostSchemaType } from "@/schema/post";
import { UserWithProfile } from "@/types/types";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import { Like, PollOption } from "@prisma/client";

type FeedProps = {
  currentUser: GetCurrentUserType
}

const Feed:React.FC<FeedProps> = ({currentUser}) => {

  const feed = useQueryProcessor<
    (PostSchemaType & { 
      user: UserWithProfile,
       poll_options: (PollOption & {voters: UserWithProfile[]}) [];
       likes: Like[]
       })[]
  >("/posts", { type: "feed" }, ["discussions"]);

  if (feed.status === "pending" || feed.isFetching) {
    return (
      <div className="flex-1 flex flex-col items-center gap-y-5 max-h-[87vh] overflow-y-auto max-w-[95%] sm:max-w-[80%] md:max-w-[700px]">
        <JobSkeletonList />
      </div>
    );
  }
  if (feed.status === "error") {
    return <div>someting went wrong...</div>;
  }

  return (
    <div className="flex-1 flex flex-col items-center gap-y-5 max-h-[87vh] overflow-y-auto max-w-[95%] sm:max-w-[80%] md:max-w-[700px]">
      <CreateFeedInput />
    
      {feed.data.map((feedData) => (
        <Post key={feedData?.id || new Date().toString()} currentUser={currentUser} postData={feedData} isCommentSectionOpen={false} />
      ))}
    </div>
  );
};

export default Feed;