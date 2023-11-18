import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

const UserSkeleton = () => {
  return <div className="flex px-10 flex-col gap-y-20">
    <Skeleton className="h-10 w-10" />

  <div className="flex w-full">

    <Skeleton className="h-16 w-16 rounded-full" />
    <div className="space-y-2 ml-5 ">
      <Skeleton className="h-9 w-[350px]" />
      <Skeleton className="h-9 w-[300px]" />
    </div>
  </div>

  <div className="flex w-full space-x-5">
      <div className="flex flex-col space-y-2 w-full flex-1">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-col space-y-2 w-full flex-1">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-full" />
      </div>
  </div>

  <div className="flex w-full space-x-5">
      <div className="flex flex-col space-y-2 w-full flex-1">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-col space-y-2 w-full flex-1">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-full" />
      </div>
  </div>

  <div className="flex w-full space-x-5">
      <div className="flex flex-col space-y-2 w-full flex-1">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-col space-y-2 w-full flex-1">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-full" />
      </div>
  </div>

  <div className="flex w-full space-x-5">
      <div className="flex flex-col space-y-2 w-full flex-1">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-col space-y-2 w-full flex-1">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-full" />
      </div>
  </div>

</div>;
}

export default UserSkeleton