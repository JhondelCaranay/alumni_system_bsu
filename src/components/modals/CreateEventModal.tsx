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
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/useModalStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { Input } from "../ui/input";
import { Loader } from "../ui/loader";

const CreateEventModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "createEvent";

  const onHandleClose = () => {
    onClose();
  };

  const formCalendarSchema = z.object({
    id: z.string().cuid2(),
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    start: z.string(),
    end: z.string(),
    allDay: z.boolean(),
  });

  type formCalendarSchemaType = z.infer<typeof formCalendarSchema>;

  const { calendarApi } = data;

  const form = useForm<formCalendarSchemaType>({
    resolver: zodResolver(formCalendarSchema),
    defaultValues: {
      id: "",
      title: "",
      description: "",
      start: "",
      end: "",
      allDay: false,
    },
    mode: "all",
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (calendarApi) {
      form.setValue("id", createId());
      form.setValue("start", calendarApi.startStr);
      form.setValue("end", calendarApi.endStr);
      form.setValue("allDay", calendarApi.allDay);
    }

    return () => {
        form.reset();
    }
  }, [calendarApi, form]);

  const onSubmit: SubmitHandler<formCalendarSchemaType> = async (values) => {
    calendarApi?.view?.calendar?.addEvent(values);
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="text-black overflow-hidden dark:bg-[#020817] dark:text-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
              Create Event{" "}
            </DialogTitle>

            <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
              Customize the title, description, time and date of your event.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="w-full mt-5">
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
                        disabled={isLoading}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                          type="type"
                          placeholder={`Enter title`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full mt-5">
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
                        disabled={isLoading}
                        cols={7}
                        rows={7}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                          placeholder={`Enter description`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className=" py-4">
                <Button variant={"default"} type="submit" className=" dark:text-white"
                disabled={isLoading}>

                  {
                    (() => {
                      if(isLoading) return <div> Adding event <Loader /></div>
                      return 'Add event'
                    })()
                  }

                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateEventModal;
