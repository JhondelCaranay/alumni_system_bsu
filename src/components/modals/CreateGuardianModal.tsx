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
import { Loader } from "../ui/loader";
import { useModal } from "@/hooks/useModalStore";
import { CreateGuardianInput, CreateGuardianSchema, GuardianSchemaType } from "@/schema/guardian";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import toast from "react-hot-toast";

const CreateGuardianModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "createGuardian";

  const onHandleClose = () => {
    onClose();
  };

  const form = useForm<CreateGuardianInput>({
    resolver: zodResolver(CreateGuardianSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      occupation: "",
      relationship: "",
    },
    mode: "all",
  });

  const setChildren = () => {
    form.setValue('childrenId', data?.user?.profile?.id as string)
  }

  useEffect(() => {
    setChildren()
  }, [isModalOpen])

  const createGuardian = useMutateProcessor<CreateGuardianInput, GuardianSchemaType>('/guardians', null, 'POST', ['guardians'])
  const isLoading = form.formState.isSubmitting || createGuardian.status === 'pending';

  const onSubmit: SubmitHandler<CreateGuardianInput> = async (values) => {
    createGuardian.mutate(values, {
      onSuccess(data, variables, context) {
        toast.success('Information has been added')
        form.reset()
        setChildren()
      },
    })
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className=" overflow-hidden dark:bg-[#020817] dark:text-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
              Add Guardian
            </DialogTitle>

            <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
              Add information about your family/guardian.
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
                  name="firstname"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="focus-visible:ring-0  focus-visible:ring-offset-0"
                          placeholder={`Enter firstname`}
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
                  name="lastname"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                          placeholder={`Enter lastname`}
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
                  name="occupation"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Occupation
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                          placeholder={`Enter occupation`}
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
                  name="relationship"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Relationship
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                          placeholder={`Enter relationship to this guardian`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                    return "Add guardian";
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

export default CreateGuardianModal;
