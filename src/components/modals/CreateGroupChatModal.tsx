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
import { Loader, Loader2 } from "../ui/loader";
import { useModal } from "@/hooks/useModalStore";
import {
  CreateGroupChatSchema,
  CreateGroupChatSchemaType,
} from "@/schema/groupchats";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { Role } from "@prisma/client";
import { UserProfileWithDepartmentSection } from "@/types/types";
import { DepartmentSchemaType } from "@/schema/department";
import { SectionSchemaType } from "@/schema/section";
import toast from "react-hot-toast";
import { Download, X } from "lucide-react";
import Image from 'next/image'
import { dataURItoBlob, uploadPhoto } from "@/lib/utils";

const CreateGuardianModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "createGroupChat";

  const onHandleClose = () => {
    form.reset()
    onClose();
  };

  const form = useForm<CreateGroupChatSchemaType>({
    resolver: zodResolver(CreateGroupChatSchema),
    mode: "all",
  });

  const advisers = useQueryProcessor<UserProfileWithDepartmentSection[]>(
    "/users",
    { role: Role.ADVISER },
    ["advisers"]
  );

  const departments = useQueryProcessor<DepartmentSchemaType[]>(
    "/departments",
    null,
    ["departments"]
  );
  const sections = useQueryProcessor<SectionSchemaType[]>("/sections", null, [
    "sections",
  ]);

  const createGroupChat = useMutateProcessor("/groupchats", null, "POST", [
    "groupchats",
  ]);

  useEffect(() => {
    if (data?.user?.role === Role.ADVISER) {
      form.setValue("adviserId", data?.user?.id);
      form.setValue("departmentId", data?.user?.departmentId as string);
    }
  }, [isModalOpen]);

  const onSubmit: SubmitHandler<CreateGroupChatSchemaType> = async (values) => {

    const {url} = await uploadPhoto(dataURItoBlob(values.image as string) as File)
    const image = url
    if(values.image && image) {
      createGroupChat.mutate({...values, image}, {
        onSuccess(data, variables, context) {
          toast.success("Group chat created");
          onClose();
        },
        onError(error, variables, context) {
          console.error(error);
          toast.error("Group chat did not create");
        },
      });
    } else {
      createGroupChat.mutate(values, {
        onSuccess(data, variables, context) {
          toast.success("Group chat created");
          onClose();
        },
        onError(error, variables, context) {
          console.error(error);
          toast.error("Group chat did not create");
        },
      });
    }
  };


  const isFetchingData =
    advisers.status == "pending" ||
    advisers.isFetching ||
    departments.status == "pending" ||
    departments.isFetching ||
    sections.status == "pending" ||
    sections.isFetching;

  const isErrorFetchingData =
    advisers.status == "error" ||
    departments.status == "error" ||
    sections.status == "error";

  form.watch(["departmentId", 'image']);

  const departmentId = form.getValues("departmentId");
  if (isErrorFetchingData ||isFetchingData ) {
    return null;
  }

  const isLoading =
    form.formState.isSubmitting || createGroupChat.status === "pending";

  const filteredSections = departmentId
    ? sections.data.filter((section) => section.departmentId === departmentId)
    : sections.data;

  const filteredAdvisers = departmentId
    ? advisers.data.filter((adviser) => adviser.departmentId == departmentId)
    : advisers.data;

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className=" overflow-hidden dark:bg-[#020817] dark:text-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
              Add group chat
            </DialogTitle>

            <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
              Customize the name, image and member of the group chat
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-5"
            >
              {(() => {
                const value = form.getValues("image");
                if (!value) {
                  return (
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <label
                            htmlFor="upload"
                            className=" hover:bg-zinc-200 w-[60%] transition-all m-auto cursor-pointer py-5 border-zinc-300 border-2 rounded-lg flex flex-col justify-center items-center gap-5 "
                          >
                            <Download className=" text-gray-400 ml-2 h-10 w-10 " />
                            <span className="text-[#42579E] text-sm font-semibold">
                              Choose a file
                            </span>
                            <span className="text-xs text-zinc-500 font-semibold">
                              Photo (png, jpg, etc)
                            </span>
                          </label>
                          <FormControl>
                            <Input
                              className="hidden"
                              id="upload"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if(e?.target?.files?.[0]) {
                                  const reader = new FileReader();
                                  reader.readAsDataURL(e?.target?.files?.[0]);

                                  reader.onloadend = () => {
                                    field.onChange(reader.result)
                                  };
                                }
                                else {
                                  field.onChange('')
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                }

                return (
                  <div className="relative h-20 w-20 mx-auto border rounded-full">
                    <Image
                      src={value}
                      fill
                      alt="group chat image upload"
                      className="rounded-full object-cover"
                    />
                    <button
                      className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                      type="button"
                    >
                      <X className="h-4 w-4" onClick={() => form.setValue('image', '')} />
                    </button>
                  </div>
                );
              })()}

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Group chat name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="focus-visible:ring-0  focus-visible:ring-offset-0"
                          placeholder={`Enter group chat name`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {data?.user?.role === Role.ADMIN && (
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Select department
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department for this group chat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.data.map((department) => (
                              <SelectItem value={department.id} key={department.id}>
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="sectionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Select section
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a section for this group chat" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredSections.map((section) => (
                            <SelectItem value={section.id} key={section.id}>
                              {section.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {data?.user?.role === Role.ADMIN && (
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="adviserId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Select adviser
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a adviser for this group chat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredAdvisers.map((adviser) => (
                              <SelectItem value={adviser.id} key={adviser.id}>
                                {adviser.profile.firstname}{" "}
                                {adviser.profile.lastname}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <DialogFooter className="py-4">
                <Button
                  variant={"default"}
                  type="submit"
                  className=" dark:text-white"
                  disabled={isLoading}
                >
                  {(() => {
                    if(isLoading) return <div className="flex items-center gap-x-3"> Creating <Loader2 size={20} /></div>
                    return "Add group chat";
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
