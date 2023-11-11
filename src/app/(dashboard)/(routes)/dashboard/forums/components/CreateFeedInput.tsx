"use client";
import Avatar from "@/components/Avatar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/useModalStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const CreateFeedInput = () => {
  const { data } = useSession();

  const formSchema = z.object({
    content: z.string().min(1),
  });

  type formSchemaType = z.infer<typeof formSchema>;
  const form = useForm<formSchemaType>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(formSchema),
    mode: "all",
  });

  const onSubmit: SubmitHandler<formSchemaType> = (values) => {};

  const { onOpen } = useModal()
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full bg-white p-5 rounded-xl shadow-md dark:bg-[#1F2937]"
        autoComplete="off"
      >
        <div className="flex gap-x-3">
          <Avatar src={data?.user.image} className="w-[40px] h-[40px]" />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                  onClick={() => onOpen('createDiscussion')}
                  placeholder="Start a discussion..."
                    {...field}
                    readOnly
                    className=" dark:bg-zinc-600 dark:placeholder:text-white cursor-pointer resize-none focus-visible:ring-offset-0 focus-visible:ring-0 bg-zinc-100 rounded-2xl border-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Separator orientation="horizontal" className="my-5 dark:bg-zinc-400" />
      </form>
    </Form>
  );
};

export default CreateFeedInput;
