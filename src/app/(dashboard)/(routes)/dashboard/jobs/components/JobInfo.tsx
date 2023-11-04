"use client";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useMutateProcessor, useQueryProcessor } from "@/hooks/useTanstackQuery";
import { CommentSchemaType } from "@/schema/comment";
import { PostSchemaType } from "@/schema/post";
import { SafeUser, UserWithProfile } from "@/types/types";
import {
  Archive,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Send,
  Share2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import Avatar from "@/components/Avatar";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import EmojiPicker from "@/components/EmojiPicker";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import JobSkeletonList from "./JobSkeletonList";
import Comment from "./Comment";

const FroalaEditorView = dynamic(
  () => import("react-froala-wysiwyg/FroalaEditorView"),
  {
    ssr: false,
  }
);

const DATE_FORMAT = `d MMM yyyy, HH:mm`;

const formSchema = z.object({
  content: z.string().min(1),
});

type formType = z.infer<typeof formSchema>;

const JobInfo = () => {
  const [isCommenting, setIsCommenting] = useState(true);
  const searchParams = useSearchParams();
  const f = searchParams.get("f");

  const job = useQueryProcessor<PostSchemaType & {comments: CommentSchemaType & {user: UserWithProfile;};
 user: UserWithProfile;}>(`/posts/${f}`,{type: "jobs",},["jobs", f],{enabled: typeof f === "string" && typeof f !== "object" && typeof f !== "undefined",}
);

const comments = useQueryProcessor<(CommentSchemaType & {user: UserWithProfile})[]>(`/comments`,{postId: job.data?.id,},['job', job.data?.id, 'comments'],{enabled: typeof job.data?.id === "string" && typeof job.data?.id !== "object" && typeof job.data?.id !== "undefined",}
);

type AddCommentSchema = {
  description: string;
  postId: string
}

const addComment = useMutateProcessor<AddCommentSchema, Comment>('/comments', null, 'POST', ['job', job.data?.id, 'comments'], {
  enabled: typeof job.data?.id === "string" && typeof job.data?.id !== "object" &&  typeof job.data?.id !== "undefined",
})

const deleteJob = useMutateProcessor<string, unknown>(`/posts/${f}`, null, 'DELETE', ['jobs'], {
  enabled: typeof f === "string" && typeof f !== "object" && typeof f !== "undefined",
})


  // start~ add comments ~
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
    mode: "all",
  });

  const isLoading = form.formState.isSubmitting;

  const { handleSubmit } = form;
  const { toast } = useToast()

  const onSubmit: SubmitHandler<formType> = async (values) => {
    addComment.mutate({
      description: values.content,
      postId: f as string // this is the id of job post
    }, {
      onSuccess(data, variables, context) {
        toast({
          variant: 'default',
          description: "Your comment has been sent.",
        })
        form.reset();
      },
    })
    try {
    } catch (error) {
      console.error(error);
    }
  };

  // end~ add comments ~

  const onDelete = () => {
    deleteJob.mutate(f as string)
    router.push('/dashboard/jobs')
  }

  useEffect(() => {
    job.refetch();
  }, [f]);

  const session = useSession();
  const router = useRouter()

  if (job.status === "error" || !job.data) return null;

  const isOwner = session.data?.user.id === job.data.userId;
  const isAdmin = session.data?.user.role === Role.ADMIN;

  const canEditOrDelete = isOwner || isAdmin;

  return (
    <article className=" flex-1 p-6 bg-white rounded-lg h-fit relative">
      {canEditOrDelete && (
        <DropdownMenu>
          <DropdownMenuTrigger className="absolute top-10 right-2">
            <MoreHorizontal className="h-6 w-6 text-zinc-500 " />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
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
        <Avatar
          className="w-7 h-7 rounded-full"
          src={job.data?.user?.image as string}
        />
        <span className="font-medium dark:text-white">
          {job.data?.user?.name}
        </span> 
        <span className="text-sm">
          {format(new Date(job.data.createdAt), DATE_FORMAT)}
        </span>
      </div>
      <div className="my-5">
        <FroalaEditorView model={job.data.description} />
      </div>

      <div className="flex justify-end">
        <Button variant={"ghost"} size={"icon"}>
          <Heart className="w-5 h-5" />
        </Button>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => setIsCommenting((prev) => !prev)}
          className={cn("bg-white", isCommenting && "bg-[#F1F5F9]")}
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
        <Button variant={"ghost"} size={"icon"}>
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
        <div className="max-w-2xl mx-auto px-4">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              {isCommenting && (
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="my-5">
                      <FormControl>
                        <div className="flex items-center border rounded-md border-zinc-500 px-2">
                          <EmojiPicker
                            onChange={(emoji: any) => {
                              field.onChange(`${field.value}${emoji.native}`);
                            }}
                          />
                          <Input
                            className="border-none border-0 active:outline-none hover:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                            {...field}
                            placeholder="Write your thoughts"
                          />
                          <Button
                            variant={"ghost"}
                            className="hover:bg-transparent"
                            size={"icon"}
                          >
                            <Send className="w-5 h-5" />{" "}
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
              Discussion ({comments?.data?.length})
            </h2>
          </div>

          {/* comments */}

          {
            (() => {
              if(comments.status === 'pending') return <JobSkeletonList />

              if(comments.status === 'error') return <h1>Loading comments error</h1>

              return comments.data.map((comment) => <Comment data={comment} />)
            })()
          }
        </div>
      </section>
    </article>
  );
};

export default JobInfo;
