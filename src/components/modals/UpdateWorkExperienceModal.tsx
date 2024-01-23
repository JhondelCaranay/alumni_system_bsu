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
import { Input } from "../ui/input";
import { Loader2 } from "../ui/loader";
import { useModal } from "@/hooks/useModalStore";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import toast from "react-hot-toast";
import {
  JobSchemaType,
  UpdateJobSchemaType,
  UpdateJobSchema,
} from "@/schema/jobs";
import { Checkbox } from "../ui/checkbox";

const UpdateWorkExperienceModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "updateWorkExperience";

  const onHandleClose = () => {
    onClose();
  };

  const form = useForm<UpdateJobSchemaType>({
    resolver: zodResolver(UpdateJobSchema),
    defaultValues: {
      company: "",
      isCurrentJob: false,
      jobTitle: "",
      location: "",
    },
    mode: "all",
  });

  const getMonthAndYear = (dateTime: string) => {
    const m = new Date(dateTime).getMonth() + 1;
    const month = m < 10 ? `0${m}` : m;
    const year = new Date(dateTime).getFullYear();

    return `${year}-${month}`;
  };

  const setChildren = () => {
    form.setValue("company", data?.workExperience?.company as string);
    form.setValue(
      "isCurrentJob",
      data?.workExperience?.isCurrentJob as boolean
    );
    form.setValue("jobTitle", data?.workExperience?.jobTitle as string);
    form.setValue("location", data?.workExperience?.location as string);
    form.setValue(
      "yearStart",
      getMonthAndYear(data?.workExperience?.yearStart.toString() as string)
    );
    if (data?.workExperience?.yearEnd) {
      form.setValue(
        "yearEnd",
        getMonthAndYear(data?.workExperience?.yearEnd?.toString() as string)
      );
    }
  };

  useEffect(() => {
    setChildren();
  }, [isModalOpen]);

  const updateJobExperience = useMutateProcessor<
    UpdateJobSchemaType,
    JobSchemaType
  >(`/users/${data.user?.id}/jobs/${data.workExperience?.id}`, null, "PATCH", [
    "users",
    "jobs",
    data.user?.id,
  ]);

  const onSubmit: SubmitHandler<UpdateJobSchemaType> = async (values) => {
    updateJobExperience.mutate(values, {
      onSuccess(data, variables, context) {
        toast.success("Work experience has been updated");
        form.reset();
        onHandleClose();
      },
      onError(error, variables, context) {
        console.log(error);
      },
    });
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="max-h-[95vh] max-w-[90vw] md:w-[550px] overflow-y-auto dark:bg-[#020817] dark:text-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
              Edit work experience
            </DialogTitle>
            <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
              Edit information about your current job/past experience.
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
                          Year Ended
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="month"
                            disabled={
                              isLoading || form.getValues("isCurrentJob")
                            }
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
                        <div className="flex items-center gap-x-3">
                          {" "}
                          Creating <Loader2 size={20} />
                        </div>
                      );
                    return "Update work experience";
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

export default UpdateWorkExperienceModal;
