"use client";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/useModalStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader } from "../ui/loader";
import Avatar from "../Avatar";
import { useSession } from "next-auth/react";
import DepartmentComboBox from "@/app/(dashboard)/(routes)/dashboard/forums/components/DepartmentComboBox";

const CreateDiscussion = () => {
  const { data: session } = useSession();
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "createDiscussion";

  const onHandleClose = () => {
    onClose();
    setDepartmentId("");
    form.reset();
  };

  const formSchema = z.object({
    description: z.string().min(1, { message: "Description is required" }),
  });

  type formSchemaType = z.infer<typeof formSchema>;

  const [departmentId, setDepartmentId] = useState("");

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
    mode: "all",
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [form]);

  const onSubmit: SubmitHandler<formSchemaType> = async (values) => {
    console.log(values)
  };

  const [_, textareaHeightUpdater] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaHeight(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaHeight(textAreaRef.current);
  }, [form.getValues('description')]);

  const updateTextAreaHeight = (textArea?: HTMLTextAreaElement) => {
    if (!textArea) return;
    textArea.style.height = "0";
    textArea.style.height = `${textArea.scrollHeight}px`;
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="bg-white text-black overflow-hidden dark:bg-[#020817] dark:text-white">
          <DialogHeader className=" ">
            <DialogTitle className="text-2xl text-center font-bold dark:text-white">
              Create Discussion
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="flex gap-x-3 w-full">
                <Avatar
                  src={session?.user.image}
                  className="w-[50px] h-[50px]"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-zinc-500">
                    {session?.user.name}
                  </span>
                  <DepartmentComboBox
                    value={departmentId}
                    setValue={setDepartmentId}
                  />
                </div>
              </div>

              <div className="w-full mt-5">
              {/* <p className="whitespace-pre-wrap"> {form.getValues('description')}</p> */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Textarea
                          ref={inputRef}
                          disabled={isLoading}
                          value={field.value}
                          className=" dark:bg-[#52525B] dark:text-white w-full overflow-hidden outline-none max-h-[20em] bg-white placeholder:text-lg placeholder:font-semibold placeholder:text-zinc-400 focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none border-0"
                          placeholder={`Write your thoughts here...`}
                          // dont remove this textareaHeightUpdater(e.target.value)
                          onChange={(e) => { textareaHeightUpdater(e.target.value), field.onChange(e)}}
                          
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className=" py-4">
                <Button
                  variant={"default"}
                  type="submit"
                  className=" dark:text-white"
                  disabled={isLoading}
                >
                  {(() => {
                    if (isLoading)
                      return (
                        <div>
                          {" "}
                          Adding discussion <Loader />
                        </div>
                      );
                    return "Submit";
                  })()}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateDiscussion;
