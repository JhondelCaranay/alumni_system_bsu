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

const AddMemberModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const [search, setSearch] = useState("");
  const isModalOpen = isOpen && type === "addNewMember";
  const searchParams = useSearchParams();
  const [memberToDisplay, setMemberToDisplay] = useState<
    UserProfileWithDepartmentSection[]
  >([]);

  const form = useForm<UploadStudentsSchemaType>({
    resolver: zodResolver(UploadStudentsSchema),
    defaultValues: {
      userIds: [],
    },
    mode: "all",
  });

  const onHandleClose = () => {
    onClose();
    form.reset();
    setMemberToDisplay([]);
  };

  const groupchatId = searchParams?.get("id");

  const addMembers = useMutateProcessor<
    UploadStudentsSchemaType,
    GroupChatSchemaType
  >(`/groupchats/${groupchatId}/users/`, null, "POST", [
    "groupchats",
    groupchatId,
  ]);

  const onSubmit: SubmitHandler<UploadStudentsSchemaType> = (values) => {
    addMembers.mutate(values, {
      onSuccess(data, variables, context) {
        toast.success("Members has been added");
        onHandleClose();
      },
      onError(error, variables, context) {
        console.log(error);
      },
    });
  };

  const students = useQueryProcessor<UserProfileWithDepartmentSection[]>(
    `/users`,
    { role: "STUDENT", department: data.groupChat?.department.name },
    ["students"],
    { enabled: !!data.groupChat?.department.name }
  );

  // console.log(students.data?.map((student) => student.department.name));

  const isLoading =
    addMembers.status === "pending" || form.formState.isSubmitting;

  const filteredStudents = students.data?.filter(
    (student) =>
      student.profile.firstname
        ?.toLowerCase()
        ?.includes(search.toLowerCase()) ||
      student.profile.lastname?.toLowerCase()?.includes(search.toLowerCase()) ||
      student.profile.middlename?.toLowerCase()?.includes(search.toLowerCase())
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
        <DialogContent className=" overflow-hidden dark:bg-[#020817] dark:text-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
              Add new member
            </DialogTitle>

            <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
              Add new member to your group chat
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
                  placeholder={`Search for member`}
                />
              </div>

              {/* list of selected members */}
              <div className="flex gap-x-5 overflow-x-auto w-full p-5 max-w-[450px] flex-nowrap">
                {memberToDisplay.length <= 0 ? (
                  <span className="text-sm text-center">
                    No selected students
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
                  <FormItem className="max-h-[350px] overflow-y-auto">
                    <div className="mb-4">
                      <FormLabel className="text-base">Students</FormLabel>
                    </div>
                    {filteredStudents?.map((student) => (
                      <FormField
                        key={student.id}
                        control={form.control}
                        name="userIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={student.id}
                              className="flex flex-row items-center justify-between px-3 py-2 cursor-pointer rounded-md hover:bg-zinc-100"
                            >
                              <FormLabel className="font-semibold flex items-center gap-x-3 cursor-pointer">
                                <Avatar src={student.image} />
                                {student.profile.firstname}{" "}
                                {student.profile.lastname}
                              </FormLabel>
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(student.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setMemberToDisplay((prev) => [
                                        ...prev,
                                        student,
                                      ]);
                                      return field.onChange([
                                        ...field.value,
                                        student.id,
                                      ]);
                                    } else {
                                      setMemberToDisplay((prev) =>
                                        prev.filter(
                                          (value) => value.id !== student.id
                                        )
                                      );
                                      return field.onChange(
                                        field.value?.filter(
                                          (value) => value !== student.id
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
                          Adding member <Loader2 size={20} />
                        </div>
                      );
                    return "Add member";
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

export default AddMemberModal;
