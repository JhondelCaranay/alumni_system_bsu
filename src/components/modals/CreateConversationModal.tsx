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
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Loader2 } from "../ui/loader";
import { useModal } from "@/hooks/useModalStore";

import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import toast from "react-hot-toast";
import { Search, X } from "lucide-react";
import { z } from "zod";
import { UserProfileWithDepartmentSection } from "@/types/types";
import { Checkbox } from "../ui/checkbox";
import Avatar from "../Avatar";
import {
  GroupChatSchemaType,
  UploadStudentsSchema,
  UploadStudentsSchemaType,
} from "@/schema/groupchats";
import { useSearchParams } from "next/navigation";
import { CreateConversationSchema, CreateConversationSchemaType } from "@/schema/conversation";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

const CreateConversationModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const [search, setSearch] = useState("");
  const isModalOpen = isOpen && type === "createConversation";
  const [memberToDisplay, setMemberToDisplay] = useState<
    UserProfileWithDepartmentSection[]
  >([]);

  const form = useForm<CreateConversationSchemaType>({
    resolver: zodResolver(CreateConversationSchema),
    defaultValues: {
        message: "",
      userIds: [],

    },
    mode: "all",
  });

  const onHandleClose = () => {
    onClose();
    form.reset();
    setMemberToDisplay([]);
  };

  const createConversation = useMutateProcessor<
  CreateConversationSchemaType,
    unknown
  >(`/conversations`, null, "POST", [
    "conversations",
    data?.user?.id,
  ]);

  const {toast} = useToast()
  const onSubmit: SubmitHandler<CreateConversationSchemaType> = (values) => {
    console.log(values)
    createConversation.mutate(values, {
      onSuccess(data, variables, context) {
        toast({
          title: "Message sent",
          description: "Your message has been sent"
        })
        onHandleClose();
      },
      onError(error, variables, context) {
        console.log(error);
      },
    });
  };

  const users = useQueryProcessor<UserProfileWithDepartmentSection[]>(
    `/users`,
    null,
    ["users"],
    { enabled: !!data?.user && isModalOpen }
  );

  const isLoading =
    form.formState.isSubmitting || createConversation.isPending;

  const filteredUsers = users.data?.filter(
    (user) =>
      user.profile.firstname
        ?.toLowerCase()
        ?.includes(search.toLowerCase()) ||
      user.profile.lastname?.toLowerCase()?.includes(search.toLowerCase()) ||
      user.profile.middlename?.toLowerCase()?.includes(search.toLowerCase())
  );

  const removeFromSelectedMember = (userId: string) => {
    setMemberToDisplay((prev) => prev.filter((member) => member.id != userId));

    form.setValue(
      "userIds",
      form.getValues("userIds").filter((memberId) => memberId != userId)
    );
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="max-h-[95vh] max-w-[90vw] md:w-[550px] overflow-y-auto dark:bg-[#020817] dark:text-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
              Private message
            </DialogTitle>

            <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
              Send a private message
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-5"
            >
              <div className="flex items-center w-full border px-3 rounded-lg ">
                <Search className="text-zinc-500" />
                <Input
                  disabled={isLoading}
                  className="focus-visible:ring-0  focus-visible:ring-offset-0 border-none"
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search for user`}
                />
              </div>

              {/* list of selected members */}
              <div className="flex gap-x-5 overflow-x-auto w-full p-5 max-w-[450px] flex-nowrap">
                {memberToDisplay.length <= 0 ? (
                  <span className="text-sm text-center">
                    No selected user
                  </span>
                ) : (
                  memberToDisplay.map((member) => (
                    <div
                      className="flex flex-col items-center w-[100px] relative hover:bg-zinc-200 p-3 rounded-md cursor-pointer"
                      onClick={() => removeFromSelectedMember(member.id)}
                      key={member.id}
                    >
                      <Avatar src={member.image} />
                      <span className="text-sm line-clamp-2 text-center">
                        {member.profile.firstname} {member.profile.lastname}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* list of members to select */}
              <FormField
                control={form.control}
                name="userIds"
                
                render={() => (
                  <FormItem className="max-h-[230px] overflow-y-auto">
                    <div className="mb-4">
                      <FormLabel className="text-base">Users</FormLabel>
                    </div>
                    {filteredUsers?.map((user) => (
                      <FormField
                        key={user.id}
                        control={form.control}
                        name="userIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={user.id}
                              className="flex flex-row items-center justify-between px-3 py-2 cursor-pointer rounded-md hover:bg-zinc-100"
                            >
                              <FormLabel className="font-semibold flex items-center gap-x-3 cursor-pointer">
                                <Avatar src={user.image} />
                                {user.profile.firstname}{" "}
                                {user.profile.lastname}
                              </FormLabel>
                              <FormControl>
                              <Checkbox
                                  checked={field.value?.includes(user.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setMemberToDisplay((prev) => [
                                        ...prev,
                                        user,
                                      ]);
                                      return field.onChange([
                                        ...field.value,
                                        user.id,
                                      ]);
                                    } else {
                                      setMemberToDisplay((prev) =>
                                        prev.filter(
                                          (value) => value.id !== user.id
                                        )
                                      );
                                      return field.onChange(
                                        field.value?.filter(
                                          (value) => value !== user.id
                                        )
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

                <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className=" border-t border-b">
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none"
                        placeholder={`Write your thoughts here...`}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />


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
                          Sending message <Loader2 size={20} />
                        </div>
                      );
                    return "Send message";
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

export default CreateConversationModal;
