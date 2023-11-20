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

type GeneralInfoProps = {
  data: GetCurrentUserType;
};

const GeneralInfo: React.FC<GeneralInfoProps> = ({ data }) => {
  const formSchema = z.object({
    firstname: z.string().min(1, {message: "Firstname is required"}),
    lastname: z.string().min(1, {message: "Lastname is required"}),
    middlename: z.string().min(1, {message: "Middlename is required"}),
    personal_email: z.string().email().min(1, {message: "Personal is required"}),
    bsu_email: z.string().email().min(1, {message: "BSU email is required"}),
    city: z.string().min(1, {message: "City is required"}),
    homeNo: z.string().min(1, {message: "Home number is required"}),
    street: z.string().min(1, {message: "Street is required"}),
    barangay: z.string().min(1, {message: "Barangay is required"}),
    province: z.string().min(1, {message: "Province is required"}),
    contactNo: z.string().min(1, {message: "Phone number is required"}),
  });

  type formSchemaType = z.infer<typeof formSchema>;

  const form = useForm<formSchemaType>({
    defaultValues: {
      firstname: data?.profile?.firstname as string,
      lastname: data?.profile?.lastname as string,
      middlename: data?.profile?.middlename as string,
      bsu_email: data?.email as string,
      personal_email: data?.profile?.alternative_email as string,
      city: data?.profile?.city as string,
      barangay: data?.profile?.barangay as string,
      street: data?.profile?.street as string,
      homeNo: data?.profile?.homeNo as string,
      province: data?.profile?.province as string,
      contactNo: data?.profile?.contactNo as string,
    },
    resolver:zodResolver(formSchema),
    mode: 'all'
  });

  const updateGeneralInfo = useMutateProcessor<formSchemaType, UserWithProfile>(
    `/users/${data?.id}`,
    null,
    "PATCH",
    ["users", data?.id],
    {
      enabled: typeof data?.id !== "undefined",
    }
  );

  const onSubmit:SubmitHandler<formSchemaType> = (values) => {
    updateGeneralInfo.mutate(values, {
      onSuccess(data, variables, context) {
        toast.success('Profile updated')
      },
    })
  }

  const isLoading = updateGeneralInfo.status === 'pending' || form.formState.isSubmitting
  return (
    <Form {...form}>
      <form className="flex flex-1 flex-col bg-white dark:bg-[#1F2937] p-5 rounded-lg gap-y-10 " onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="text-2xl">General Information</h1>

        <div className="flex justify-evenly gap-x-5">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input
                  disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    placeholder={`Enter firstname`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input
                  disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    placeholder={`Enter lastname`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-evenly gap-x-5">
          <FormField
            control={form.control}
            name="middlename"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  Middle Name
                </FormLabel>
                <FormControl>
                  <Input
                  disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    placeholder={`Enter middlename`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="contactNo"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                  disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    placeholder={`Enter phone number`}
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-evenly gap-x-5">
        <FormField
            control={form.control}
            name="bsu_email"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  BSU Email
                </FormLabel>
                <FormControl>
                  <Input
                  disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    type="email"
                    placeholder={`Enter bsu email`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
         <FormField
            control={form.control}
            name="personal_email"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  Personal Email
                </FormLabel>
                <FormControl>
                  <Input
                  disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    type="email"
                    placeholder={`Enter personal email`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-evenly gap-x-5">
        <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  Street
                </FormLabel>
                <FormControl>
                  <Input
                  disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    placeholder={`Enter street`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="homeNo"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  Home Number
                </FormLabel>
                <FormControl>
                  <Input
                  disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    placeholder={`Enter home number`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-evenly gap-x-5">
        <FormField
            control={form.control}
            name="barangay"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  Barangay
                </FormLabel>
                <FormControl>
                  <Input
                  disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    placeholder={`Enter barangay`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                City
                </FormLabel>
                <FormControl>
                  <Input
                  disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    placeholder={`Enter city`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-evenly gap-x-5">
        <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  Province
                </FormLabel>
                <FormControl>
                  <Input
                  disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    placeholder={`Enter province`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>


        <Button className="w-fit text-white" type="submit" >{
          (() => {
            if(isLoading) return <div className="flex items-center gap-x-2"> <Loader  size={20} /> Saving</div>

            return 'Save all'
          })()
        }</Button>
      </form>
    </Form>
  );
};

export default GeneralInfo;
