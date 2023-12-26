"use client";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import React from "react";
import Experience from "./Experience";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useModal } from "@/hooks/useModalStore";
import {useQueryProcessor } from "@/hooks/useTanstackQuery";
import { JobSchemaType } from "@/schema/jobs";
import { Loader, Loader2 } from "@/components/ui/loader";

type WorkExperiencesProps = {
  data: GetCurrentUserType;
  studentProfileId?: string;
};

const WorkExperiences: React.FC<WorkExperiencesProps> = ({data}) => {

  const experiences = useQueryProcessor<JobSchemaType[]>(`/users/${data?.id}/jobs`, null, ['users', 'jobs', data?.id])

  const {onOpen} = useModal()
  return (
    <div className="flex rounded-lg p-5 bg-white dark:bg-[#1F2937] ">
      <div className="flex flex-col gap-5 w-full">
        <h1 className="mb-5 text-3xl">Work Experiences</h1>

        <Button
        variant={"link"}
        className="flex items-center gap-x-2 w-fit h-fit p-0 my-10"
        onClick={() => onOpen("createWorkExperience", { user: data })}
      >
        <PlusCircleIcon />
        Add a job/work experience
      </Button>
      <div className="px-3">
      {
        (() => {
          if(experiences.status == 'pending' || experiences.isFetching) {
            return <Loader2 className="mx-auto" color="#3498db" size={30} />
          }
          return <ol className="relative border-s border-gray-200 dark:border-gray-700 gap-y-5">
          {
            experiences.data?.map((work) => (
              <Experience data={work} user={data} key={work.id} />
              ))
            }
        </ol>
        })()
      }
      </div>
      </div>
    </div>
  );
};

export default WorkExperiences;
