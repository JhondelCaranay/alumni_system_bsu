"use client";
import React, { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/useModalStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Loader } from "../ui/loader";
import { Pencil } from "lucide-react";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { Event } from "@prisma/client";
import toast from "react-hot-toast";

const ViewEventModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "viewEvent";

  const onHandleClose = () => {
    onClose();
  };

  const formCalendarSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
  });

  type formCalendarSchemaType = z.infer<typeof formCalendarSchema>;

  const { calendarApi } = data;

  const form = useForm<formCalendarSchemaType>({
    resolver: zodResolver(formCalendarSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "all",
  });

  const updateEvent = useMutateProcessor<formCalendarSchemaType, Event>(`/events/${calendarApi?.event?._def.publicId}`, null, 'PUT', ['events'], {
    enabled: typeof calendarApi !== 'undefined' && typeof calendarApi?.event?._def?.publicId !== 'undefined' 
  })

  const isUpdateLoading = form.formState.isSubmitting || updateEvent.isPending;


  useEffect(() => {
    if (calendarApi) {
      form.setValue("title", calendarApi?.event?._def?.title);
      form.setValue(
        "description",
        calendarApi?.event?._def.extendedProps?.description
      );
    }
    return () => {
      form.reset();
      setEdit(false);
    };
  }, [calendarApi, form]);

  const [edit, setEdit] = useState(false);

  const onSubmit: SubmitHandler<formCalendarSchemaType> = async (values) => {
    updateEvent.mutate(values, {
        onSuccess(data, variables, context) {
            setEdit(false)
            toast.success('Event updated')
        },
        onError(error, variables, context) {
            toast.error('Event did not update')
        },
    })
  };

  const onDelete = () => {
    calendarApi.event.remove();
    onClose()
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="bg-white text-black overflow-hidden dark:bg-[#020817] dark:text-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
              Event
            </DialogTitle>

            {!edit ? (
              <>
                <DialogDescription className="text-center text-zinc font-semibold dark:text-white ">
                  You can view, edit and delete your event.
                </DialogDescription>
                <div
                  className="relative ml-auto hover:bg-zinc-300 p-3 rounded-full cursor-pointer -mr-3 my-0"
                  onClick={() => setEdit(true)}
                >
                  <div className="animate-pulse transition-all h-[5px] w-[5px] rounded-full bg-[orange] absolute top-[11px] left-[12px]" />
                  <Pencil className="" />
                </div>
              </>
            ) : (
              <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white ">
                Customize the title and description of your event.
              </DialogDescription>
            )}
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="w-full mt-5">
                {(() => {
                  if (edit) {
                    return (
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                              Title
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={isUpdateLoading}
                                className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                type="type"
                                placeholder={`Enter title`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  }

                  return (
                    <div className="w-full flex flex-col max-h-[200px] overflow-y-auto">
                      <label className="uppercase text-sm font-bold text-zinc-500 dark:text-secondary/70">
                        Title
                      </label>
                      <span className="text-sm ml-1">
                        {form.getValues("title")}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="w-full mt-5">
                {(() => {
                  if (edit) {
                    return (
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                              Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={isUpdateLoading}
                                cols={7}
                                rows={7}
                                className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none"
                                placeholder={`Enter description`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  }

                  return (
                    <div className="w-full flex flex-col max-h-[200px] overflow-y-auto">
                      <label className="uppercase text-sm font-bold text-zinc-500 dark:text-secondary/70">
                        Description
                      </label>
                      <span className="text-sm ml-1">
                        {form.getValues("description")}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <DialogFooter className=" py-4 flex w-full">
                {(() => {
                  if (edit) {
                    return (
                      <div className="flex justify-between w-full gap-x-3">
                        <Button
                          className="flex-1 bg-zinc-100"
                          onClick={() => setEdit(false)}
                          type="submit"
                          variant={"ghost"}
                        >
                          Cancel
                        </Button>

                        <Button
                          type="submit"
                          className=" dark:text-white flex-1 "
                          disabled={isUpdateLoading}
                        >
                          {(() => {
                            if (isUpdateLoading)
                              return (
                                <div className="flex items-center">
                                    <span className="mr-2">Updating</span> <Loader size={20} />
                                </div>
                              )
                            return "Save update"
                          })()}
                        </Button>
                      </div>
                    );
                  }

                  return (
                    <Button
                      variant={"destructive"}
                      type="button"
                      className=" dark:text-white"
                      onClick={onDelete}
                    >
                     delete event
                    </Button>
                  );
                })()}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewEventModal;
