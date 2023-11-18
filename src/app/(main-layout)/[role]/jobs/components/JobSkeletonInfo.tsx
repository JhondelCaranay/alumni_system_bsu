import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const JobSkeletonInfo = () => {
  return (
    <div className="order-first md:order-none w-full flex flex-col gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md self-start">
      <div className="flex w-full">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 ml-5 ">
          <Skeleton className="h-5 w-[350px]" />
        </div>
      </div>
      <div className="flex flex-col gap-2 ">
        {Array(20)
          .fill(0)
          .map((_, i) => {
            return <Skeleton key={i} className="w-full h-5 my-1" />;
          })}
      </div>
    </div>
  );
};

export default JobSkeletonInfo;
