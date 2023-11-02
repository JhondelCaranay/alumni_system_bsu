"use client";
import React from "react";
// import JobSearch from "./JobSearch";
import { Separator } from "@/components/ui/separator";
import JobPost from "./JobPost";
import JobInfo from "./JobInfo";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Button } from "@/components/ui/button";
// import { Locate, MapPin } from "lucide-react";
// import Avatar from "@/components/Avatar";

const JobsClient = () => {
  // const useSearchParams();
  const searchParams = useSearchParams();
  const f = searchParams.get("f");

  return (
    <main className="flex w-full gap-x-5 ">
      <div className="flex flex-col flex-1 max-w-[50%] gap-y-5 max-h-[85vh] overflow-auto p-5">
        <JobPost />
        <JobPost />
        <JobPost />
        <JobPost />
        <JobPost />
        <JobPost />
      </div>
      <Separator orientation="vertical" className="flex h-full text-sm w-2" />
      {f && <JobInfo />}
    </main>
  );
};

export default JobsClient;
