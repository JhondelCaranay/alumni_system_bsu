"use client";

import { useMutateProcessor, useQueryProcessor } from "@/hooks/useTanstackQuery";
import { CommentSchemaType } from "@/schema/comment";
import { PostSchemaType } from "@/schema/post";
import { SafeUser, UserWithProfile } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import JobCommentSkeleton from "../../components/JobCommentSkeleton";
import Comment from "../../components/Comment";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Archive,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Share2,
  XSquare,
} from "lucide-react";
import { useSession } from "next-auth/react";
import JobSkeletonInfo from "../../components/JobSkeletonInfo";
import { Role } from "@prisma/client";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CommentInput from "../../components/CommentInput";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { useCommentSocket } from "@/hooks/useCommentSocket";

const FroalaEditorView = dynamic(() => import("react-froala-wysiwyg/FroalaEditorView"), {
  ssr: false,
});

const DATE_FORMAT = `d MMM yyyy, HH:mm`;

type Props = {};
const JobDetailPage = (props: Props) => {
  const [isCommenting, setIsCommenting] = useState(true);
  const params = useParams();

  const jobId = params?.jobId as string;

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

  const comments = useQueryProcessor<(CommentSchemaType & { user: UserWithProfile })[]>(
    `/comments`,
    { postId: job.data?.id },
    ["jobs", job.data?.id, "comments"],
    {
      enabled:
        typeof job.data?.id === "string" &&
        typeof job.data?.id !== "object" &&
        typeof job.data?.id !== "undefined" &&
        isCommenting,
    }
  );

  const deleteJob = useMutateProcessor<string, unknown>(
    `/posts/${jobId}`,
    null,
    "DELETE",
    ["jobs"],
    {
      enabled:
        typeof jobId === "string" && typeof jobId !== "object" && typeof jobId !== "undefined",
    }
  );

  useCommentSocket({ postKey: `posts:${jobId}:comments`, queryKey: ["jobs", jobId, "comments"] });

  const onDelete = () => {
    deleteJob.mutate(jobId as string);
    router.push("/dashboard/jobs");
  };

  const onClose = () => {
    router.push("/dashboard/jobs");
  };

  const session = useSession();
  const router = useRouter();

  if (job.status === "pending" || job.fetchStatus === "fetching")
    return (
      <div className="px-3">
        <JobSkeletonInfo />
      </div>
    );
  if (job.status === "error" || !job.data) return null;

  const isOwner = session.data?.user.id === job.data.userId;
  const isAdmin = session.data?.user.role === Role.ADMIN;

  const canEditOrDelete = isOwner || isAdmin;

  return (
    <article className="w-full flex-1 space-y-2 rounded-lg h-fit px-3">
      {/* JOB POST */}
      <div className="shadow-lg p-3 bg-white dark:bg-gray-800 dark:text-white rounded-md relative">
        {canEditOrDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute top-3 right-3">
              <MoreHorizontal className="h-6 w-6 text-zinc-500 " />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="">
              <DropdownMenuItem
                className="text-xs cursor-pointer hover:bg-zinc-400 md:hidden"
                onClick={onClose}
              >
                <XSquare className="h-4 w-4 mr-2" />
                Go back
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer hover:bg-zinc-400"
                onClick={() => router.push(`/dashboard/jobs/${job.data.id}/edit`)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100"
                onClick={onDelete}
              >
                <Archive className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className="flex items-center space-x-4">
          <Avatar className="w-7 h-7 rounded-full" src={job.data?.user?.image as string} />
          <span className="font-medium dark:text-white">{job.data?.user?.name}</span>
          <span className="text-sm">{format(new Date(job.data.createdAt), DATE_FORMAT)}</span>
        </div>
        <div className="my-5 p-2 bg-white">
          <FroalaEditorView model={job.data.description} />
        </div>

        <div className="flex justify-end">
          <Button variant={"ghost"} size={"icon"}>
            <Heart className="w-5 h-5" />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setIsCommenting((prev) => true)}
            className={cn(
              "bg-white dark:bg-gray-800",
              isCommenting && "bg-[#F1F5F9] dar:bg-gray-400"
            )}
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
          <Button variant={"ghost"} size={"icon"}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* COMMENTS FORM */}

      <section className="bg-white dark:bg-gray-800 py-3 antialiased shadow-lg rounded-md">
        <div className="max-w-2xl mx-auto px-4 space-y-3">
          {isCommenting && <CommentInput />}

          <div className="flex justify-between items-center">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white">
              Discussion ({comments?.data?.length || 0})
            </h2>
          </div>

          {/* comments */}

          {(() => {
            if (comments.status === "pending") return <JobCommentSkeleton />;

            if (comments.status === "error") return <h1>Loading comments error</h1>;

            return comments.data.map((comment) => <Comment data={comment} key={comment.id} />);
          })()}
        </div>
      </section>
    </article>
  );
};
export default JobDetailPage;
