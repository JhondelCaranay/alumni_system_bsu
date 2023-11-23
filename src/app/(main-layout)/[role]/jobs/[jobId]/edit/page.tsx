"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { PostSchemaType, UpdatePostSchemaType } from "@/schema/post";
import { CommentSchemaType } from "@/schema/comment";
import { SafeUser } from "@/types/types";
import { setEnvironmentData } from "worker_threads";
import toast from "react-hot-toast";
import useRouterPush from "@/hooks/useRouterPush";
// import Editor from "../../components/Editor"
const Editor = dynamic(() => import("../../components/Editor"), {
  ssr: false,
});

const EditAJobPage = () => {
  const { redirectTo } = useRouterPush();
  const [model, setModel] = useState("");
  const router = useRouter();

  const params = useParams();

  const jobId = params?.jobId as string;

  useEffect(() => {
    const savedContent = localStorage.getItem("savedContent");
    if (savedContent) {
      setModel(savedContent);
    }

    return () => {
      localStorage.removeItem("savedContent");
    };
  }, []);

  const job = useQueryProcessor<
    PostSchemaType & {
      comments: CommentSchemaType & {
        user: SafeUser;
      };
      user: SafeUser;
    }
  >(
    `/posts/${jobId}`,
    {
      type: "jobs",
    },
    ["jobs", jobId],
    {
      enabled: typeof jobId !== "undefined",
    }
  );

  const updateJob = useMutateProcessor<UpdatePostSchemaType, PostSchemaType>(
    `/posts/${jobId}`,
    null,
    "PATCH",
    ["jobs", jobId]
  );

  const onUpdate = () => {
    updateJob.mutate(
      {
        type: "JOBS",
        description: model,
      },
      {
        onSuccess(data, variables, context) {
          localStorage.removeItem("savedContent");
          toast.success("Job has been updated.");
          redirectTo("jobs");
        },
      }
    );
  };

  const onCancel = () => {
    localStorage.removeItem("savedContent");
    redirectTo("jobs");
  };
  return (
    <div className="p-5 dark:bg-[#020817]">
      <div className="flex items-center bg-[rgb(237,243,248)] my-10 rounded-md p-5 dark:bg-zinc-600 dark:text-white">
        <Lightbulb className="text-[rgb(195,125,22)]" />{" "}
        <h1 className=" text-zinc-500 text-sm dark:text-white">
          Edit your job post.
        </h1>
      </div>
      <Editor
        model={model || (job.data?.description as string)}
        onChange={(value) => setModel(value)}
      />

      <div className="flex justify-end mt-10 gap-x-3">
        <Button variant={"outline"} onClick={onCancel}>
          Cancel
        </Button>
        <Button variant={"default"} onClick={onUpdate}>
          Update
        </Button>
      </div>
    </div>
  );
};

export default EditAJobPage;
