"use client";
import React from "react";
import Post from "./Post";
import CreateFeedInput from "./CreateFeedInput";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import JobSkeletonList from "../../jobs/components/JobSkeletonList";
import { PostSchemaType } from "@/schema/post";
import { UserWithProfile } from "@/types/types";

const Feed = () => {
  const feed = useQueryProcessor<(PostSchemaType & { user: UserWithProfile })[]>(
    "/posts",
    { type: "feed" },
    ["discussions"]
  );

  if (feed.status === "pending" || feed.isFetching) {
    return <JobSkeletonList />;
  }
  if (feed.status === "error") {
    return <div>someting went wrong...</div>;
  }
  return (
    <div className="flex-1 flex flex-col items-center gap-y-5 max-h-[87vh] overflow-y-auto px-10">
      <CreateFeedInput />
      {feed.data.map((feedData) => (
        <Post key={feedData.id} postData={feedData} />
      ))}
    </div>
  );
};

export default Feed;
