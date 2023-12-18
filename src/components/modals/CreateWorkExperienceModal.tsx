"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
import { Input } from "../ui/input";
import { Loader } from "../ui/loader";
import { useModal } from "@/hooks/useModalStore";
import {
  CreateGuardianInput,
  CreateGuardianSchema,
  GuardianSchemaType,
} from "@/schema/guardian";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import toast from "react-hot-toast";
import { CreateJobSchema } from "@/schema/jobs";
import { Checkbox } from "../ui/checkbox";

const CreateWorkExperienceModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "createJobExperience";

  const onHandleClose = () => {
    onClose();
  };

  const form = useForm<CreateJobSchema>({
    resolver: zodResolver(CreateJobSchema),
    defaultValues: {
      company: "",
      isCurrentJob: false,
      jobTitle: "",
      location: "",
    },
    mode: "all",
  });

  const onSubmit: SubmitHandler<CreateJobSchema> = async (values) => {};

  const isLoading = form.formState.isSubmitting;

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className=" overflow-hidden dark:bg-[#020817] dark:text-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
              Add work experience
            </DialogTitle>

            <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
              Add information about your current job/past experience.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-5"
            >
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Job Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="focus-visible:ring-0  focus-visible:ring-offset-0"
                          placeholder={`Enter job title`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Company name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                          placeholder={`Enter company name`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                          placeholder={`Enter location`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full ">
                <FormField
                  control={form.control}
                  name="isCurrentJob"
                  render={({ field }) => (
                    <FormItem className="w-full flex items-center gap-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>

                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        I am currently working on this job.
                      </FormLabel>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-x-5">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="yearStart"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Year started
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="month"
                            disabled={isLoading}
                            className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                            placeholder={`Enter the year you started the job`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="yearEnd"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Year started
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="month"
                            disabled={isLoading}
                            className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                            placeholder={`Enter the year you left the job`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter className="py-4">
                <Button
                  variant={"default"}
                  type="submit"
                  className=" dark:text-white"
                  disabled={isLoading}
                >
                  {(() => {
                    if (isLoading)
                      return (
                        <div className="flex items-center gap-x-1">
                          {" "}
                          saving <Loader size={20} />
                        </div>
                      );
                    return "Add work experience";
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

export default CreateWorkExperienceModal;
