"use client";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import JobPost from "./JobPost";
import JobInfo from "./JobInfo";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { PostSchemaType } from "@/schema/post";
import { CommentSchemaType } from "@/schema/comment";
import { SafeUser } from "@/types/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import JobSkeletonList from "./JobSkeletonList";
import useWindowSize from "@/hooks/useWindowSize";

const JobsClient = () => {
  const windowSize = useWindowSize();

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
  const f = searchParams?.get("f");
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (jobs?.data && jobs?.data.length > 0 && !f) {
      const url = qs.stringifyUrl(
        {
          url: pathname || "",
          query: {
            f: jobs?.data[0].id,
          },
        },
        { skipNull: true }
      );

      router.push(url);
    }

    return () => {
      console.log("jobs exit");
    };
  }, [jobs?.data, f, pathname, router]);

  useEffect(() => {
    jobs.refetch();
  }, []);

  if (jobs.status === "pending") return <JobSkeletonList />;

  if (jobs.status === "error") return <h1 className="text-zinc-500">Something went wrong</h1>;

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
      <div className="flex flex-col gap-y-5 max-h-[calc(100vh-120px)] overflow-auto md:pr-1">
        {jobs.data.length > 0 &&
          jobs?.data?.map(({ user, comments, ...rest }) => (
            <JobPost key={{ ...rest }.id} post={{ ...rest }} user={user} comments={comments} />
          ))}
      </div>
      {/* <Separator orientation="vertical" className="flex h-full text-sm w-2" /> */}
      <div className="hidden md:inline-flex order-first md:order-none max-h-[calc(100vh-120px)] overflow-auto">
        {f && <JobInfo />}
      </div>
    </main>
  );
};

export default JobsClient;
