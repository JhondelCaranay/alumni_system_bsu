import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const JobSkeletonList = () => {

    const numberOfList = [1,2,3,4,5]
  return (
    <div className="flex flex-col">
        {
            numberOfList.map(() => {
                return <div className="flex flex-col">

                <div className="flex w-full">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2 ml-5 ">
                    <Skeleton className="h-9 w-[350px]" />
                    <Skeleton className="h-9 w-[300px]" />
                    </div>
                    </div>
        
                <div className="my-10 gap-y-5">
                <Skeleton className="w-[50%] h-5 my-1"/>
                    <Skeleton className="w-[50%] h-5 my-1"/>
                    <Skeleton className="w-[50%] h-5 my-1"/>
                    <Skeleton className="w-[50%] h-5 my-1"/>
                    <Skeleton className="w-[50%] h-5 my-1"/>
                </div>
                </div>
            })
        }
       
    </div>
  );
};

export default JobSkeletonList;
