"use client";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { UserWithProfile } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type PasswordsProps = {
  data: GetCurrentUserType;
};

const Passwords: React.FC<PasswordsProps> = ({ data }) => {
  const formSchema = z
    .object({
      newPassword: z.string().min(1, { message: "New Password is required" }),
      confirmPassword: z
        .string()
        .min(1, { message: "Confirmation Password is required" }),
      currentPassword: z
        .string()
        .min(1, { message: "Current Password is required" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  type formSchemaType = z.infer<typeof formSchema>;

  const form = useForm<formSchemaType>({
    defaultValues: {
      confirmPassword: "",
      currentPassword: "",
      newPassword: "",
    },
    resolver: zodResolver(formSchema),
    mode: "all",
  });

  const updatePassword = useMutateProcessor<formSchemaType, UserWithProfile>(
    `/users/${data?.id}`,
    null,
    "PATCH",
    ["users", data?.id],
    {
      enabled: typeof data?.id !== "undefined",
    }
  );

  const onSubmit: SubmitHandler<formSchemaType> = (values) => {
    updatePassword.mutate(values, {
      onSuccess(data, variables, context) {
        toast.success('Password updated')
      },
    });
  };

  const isLoading = updatePassword.status === 'pending' || form.formState.isSubmitting
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" h-full rounded-lg flex-col flex p-5 bg-white dark:bg-[#1F2937]"
      >
        <h1 className="text-2xl">Password Information</h1>

        <div className="flex flex-col justify-between mt-10">
          <div className="flex flex-col mb-10 gap-y-5">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start flex-1">
                  <FormLabel className="text-sm text-black dark:text-zinc-400">
                    New password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isLoading}
                      className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                      placeholder={`Enter new password`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start flex-1">
                  <FormLabel className="text-sm text-black dark:text-zinc-400">
                    Confirm password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isLoading}
                      className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                      placeholder={`Enter new password`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm text-black dark:text-zinc-400">
                  Current password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    placeholder={`Enter new password`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className="w-fit mt-auto text-white" type="submit" >{
          (() => {
            if(isLoading) return <div className="flex items-center gap-x-2"> <Loader  size={20} /> Saving</div>

            return 'Save all'
          })()
        }</Button>
      </form>
    </Form>
  );
};

export default Passwords;
