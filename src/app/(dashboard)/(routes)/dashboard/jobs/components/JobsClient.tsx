"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import JobPost from "./JobPost";
import JobInfo from "./JobInfo";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { PostSchemaType } from "@/schema/post";
import { CommentSchemaType } from "@/schema/comment";
import { SafeUser } from "@/types/types";
import { useSearchParams } from "next/navigation";
import JobSkeletonList from "./JobSkeletonList";

const JobsClient = () => {
  const jobs = useQueryProcessor<
    (PostSchemaType & {
      comments: CommentSchemaType & {
        user: SafeUser;
      };
      user: SafeUser;
    })[]
  >(
    "/posts",
    {
      type: "jobs",
    },
    ["jobs"]
  );

  const searchParams = useSearchParams();
  
  if (jobs.status === "pending") return <JobSkeletonList />;

  if (jobs.status === "error") return <h1 className="text-zinc-500">Something went wrong</h1>;

  const f = searchParams.get("f");

  return (
    <main className="flex w-full gap-x-5 ">
      <div className="flex flex-col flex-1 max-w-[50%] gap-y-5 max-h-[85vh] overflow-auto p-5">
        {jobs.data.length > 0 &&
          jobs?.data?.map(({ user, comments, ...rest }) => (
            <JobPost key={{ ...rest }.id} post={{ ...rest }} user={user} comments={comments} />
          ))}
      </div>
      <Separator orientation="vertical" className="flex h-full text-sm w-2" />
      {f && <JobInfo />}
    </main>
  );
};

export default JobsClient;
