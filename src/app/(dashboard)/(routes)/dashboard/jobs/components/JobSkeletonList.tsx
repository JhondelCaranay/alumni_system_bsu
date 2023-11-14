import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const JobSkeletonList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-5">
      <div className="flex flex-col gap-10">
        {Array(5)
          .fill(0)
          .map((list, index) => {
            return (
              <div
                key={index}
                className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md"
              >
                <div className="flex w-full">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2 ml-5 ">
                    <Skeleton className="h-5 w-[350px]" />
                    <Skeleton className="h-5 w-[300px]" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <Skeleton className="w-[50%] h-5 my-1" />
                  <Skeleton className="w-[50%] h-5 my-1" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default JobSkeletonList;
