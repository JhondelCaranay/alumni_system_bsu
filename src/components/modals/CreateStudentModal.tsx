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
import {
  CreateStudentsSchema,
  CreateStudentsSchemaType,
} from "@/schema/students";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Gender } from "@prisma/client";
import { DepartmentSchemaType } from "@/schema/department";
import { SectionSchemaType } from "@/schema/section";
import { C } from "@fullcalendar/core/internal-common";
import { useToast } from "../ui/use-toast";

const CreateStudentModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "createStudent";
  const { toast } = useToast();

  const onHandleClose = () => {
    onClose();
    form.reset();
  };
  const [page, setPage] = useState(1);
  const form = useForm<CreateStudentsSchemaType>({
    resolver: zodResolver(CreateStudentsSchema),
    defaultValues: {
      role: "STUDENT",
    },
    mode: "all",
  });

  const departments = useQueryProcessor<DepartmentSchemaType[]>(
    "/departments",
    null,
    ["departments"]
  );
  form.watch(["departmentId"]);

  useEffect(() => {
    form.setValue("role", "STUDENT");

    return () => {
      form.reset();
      setPage(1);
    };
  }, [isModalOpen]);

  const departmentId = form.getValues("departmentId");

  const sections = useQueryProcessor<SectionSchemaType[]>("/sections", null, [
    "sections",
  ]);

  const filteredSections = departmentId
    ? sections?.data?.filter((section) => section.departmentId === departmentId)
    : sections.data;

  const createStudent = useMutateProcessor<CreateStudentsSchemaType, unknown>(
    "/students",
    null,
    "POST",
    ["students/alumni"]
  );

  const isLoading =
    form.formState.isSubmitting || createStudent.status === "pending";

  const onSubmit: SubmitHandler<CreateStudentsSchemaType> = async (values) => {
    createStudent.mutate(values, {
      onSuccess(data, variables, context) {
        toast({
          title: "Student successfully created",
        });
        onHandleClose();
      },
      onError(error, variables, context) {
        console.error(error);
        toast({
          title: "Student did not create",
          variant: "destructive",
        });
      },
    });
  };

  const selectedDepartment = departments.data?.find(
    (department) => department.id === departmentId
  );

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="max-h-[95vh] max-w-[90vw] md:w-[550px] overflow-y-auto dark:bg-[#020817] dark:text-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
              Add student
            </DialogTitle>

            <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
              Add information about the student
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-5"
            >
              {(() => {
                if (page === 1) {
                  return (
                    <>
                      <div className="flex gap-x-3">
                        <div className="w-full">
                          <FormField
                            control={form.control}
                            name="firstname"
                            key="firstname"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  First Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    key={"firstname"}
                                    disabled={isLoading}
                                    className="focus-visible:ring-0  focus-visible:ring-offset-0"
                                    placeholder={`Enter firstname`}
                                    {...field}
                                    value={field.value}
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
                            key="lastname"
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
                      </div>
                      <div className="flex gap-x-3">
                        <div className="w-full">
                          <FormField
                            control={form.control}
                            name="middlename"
                            key={"middlename"}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  Middlename
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isLoading}
                                    className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                                    placeholder={`Enter middlename`}
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
                            name="gender"
                            key={"gender"}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  Select gender
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value={Gender.MALE}>
                                      {Gender.MALE}
                                    </SelectItem>
                                    <SelectItem value={Gender.FEMALE}>
                                      {Gender.FEMALE}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex gap-x-3">
                        <div className="w-full">
                          <FormField
                            control={form.control}
                            name="email"
                            key="email"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isLoading}
                                    className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                                    placeholder={`Enter email`}
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
                            name="contactNo"
                            key="contactNo"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  Contact No.
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isLoading}
                                    type="number"
                                    className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                                    placeholder={`Enter contact number`}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex gap-x-3">
                        <div className="w-full">
                          <FormField
                            control={form.control}
                            name="dateOfBirth"
                            key="dateOfBirth"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  Birthday
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isLoading}
                                    className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                                    type="date"
                                    placeholder={`Enter birthdate`}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        {/* <div className="w-full">
                          <FormField
                            control={form.control}
                            name="age"
                            key="age"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  Age
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isLoading}
                                    className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                                    type="number"
                                    placeholder={`Enter age`}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div> */}
                      </div>
                    </>
                  );
                }

                if (page === 2) {
                  return (
                    <>
                      <div className="flex gap-x-3">
                        <div className="w-full">
                          <FormField
                            control={form.control}
                            name="studentNumber"
                            key="studentNumber"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  Student Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isLoading}
                                    className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                                    type="number"
                                    placeholder={`Enter student number`}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex gap-x-3">
                        <div className="w-full">
                          <FormField
                            control={form.control}
                            name="departmentId"
                            key="departmentId"
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
                                      <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {departments?.data?.map((department) => (
                                      <SelectItem
                                        value={department.id}
                                        key={department.id}
                                      >
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

                        <div className="w-full">
                          <FormField
                            control={form.control}
                            name="sectionId"
                            key="sectionId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  Select year & section
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a section" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {filteredSections?.map((section) => (
                                      <SelectItem
                                        value={section.id}
                                        key={section.id}
                                      >
                                        {section.course_year} {section.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex gap-x-3">
                        <div className="w-full">
                          <FormField
                            control={form.control}
                            name="city"
                            key="city"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  City
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isLoading}
                                    className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                                    placeholder={`Enter city`}
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
                            name="province"
                            key="province"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  Province
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isLoading}
                                    className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                                    placeholder={`Enter province`}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex gap-x-3">
                        <div className="w-full">
                          <FormField
                            control={form.control}
                            name="homeNo"
                            key="homeNo"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  Home No.
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    key={"homeNo"}
                                    type="number"
                                    disabled={isLoading}
                                    className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                                    placeholder={`Enter home no.`}
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
                            name="street"
                            key="street"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  Street
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isLoading}
                                    className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                                    placeholder={`Enter street`}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex gap-x-3">
                        <div className="w-full">
                          <FormField
                            control={form.control}
                            name="barangay"
                            key="barangay"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  Barangay
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isLoading}
                                    className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                                    placeholder={`Enter barangay`}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </>
                  );
                }
              })()}

              <DialogFooter className="py-4">
                {(() => {
                  if (page === 1) {
                    return (
                      <div className="flex justify-between">
                        <Button type="button" onClick={() => setPage(2)}>
                          Next
                        </Button>
                      </div>
                    );
                  }

                  if (page === 2) {
                    return (
                      <div className="flex justify-between w-full">
                        <Button type="button" onClick={() => setPage(1)}>
                          Prev
                        </Button>
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
                                  Saving <Loader2 size={20} />
                                </div>
                              );
                            return "Add student";
                          })()}
                        </Button>
                      </div>
                    );
                  }
                })()}
                {/* */}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateStudentModal;
