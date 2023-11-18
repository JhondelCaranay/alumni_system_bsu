"use client";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud } from "lucide-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type UserCardProps = {
  data: GetCurrentUserType;
};
const UserCard: React.FC<UserCardProps> = ({ data }) => {
  const formSchema = z.object({
    imageUrl: z.string().min(1),
  });
  type formSchemaType = z.infer<typeof formSchema>;
  const form = useForm<formSchemaType>({
    defaultValues: {
      imageUrl: "",
    },
    resolver: zodResolver(formSchema),
    mode: "all",
  });
  const onSubmit: SubmitHandler<formSchemaType> = (values) => {
    console.log(values)
  };
  console.log(form.getValues("imageUrl"))
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex bg-[#1F2937] p-5 rounded-lg items-center gap-2"
      >
        <Avatar src={data?.image} className="h-[110px] w-[110px] rounded-sm" />

        <div className="flex flex-col ml-2 justify-between h-full">

            <div className="flex flex-col">
                <span className="text-md font-semibold">Jese Leos</span>
                <span className="text-sm font-semibold">Software Engineer</span>
            </div>
          
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="">
                <label
                  htmlFor="upload"
                  className="cursor-pointer flex items-center bg-[#2563EB] dark:text-white gap-x-1 py-2 px-3 rounded-md text-sm font-semibold "
                >
                    <UploadCloud className="" />
                        <span>
                            Change picture
                        </span>
                </label>
                <FormControl>
                  <Input
                    {...form.register("imageUrl")}
                    className="hidden"
                    id="upload"
                    type="file"
                    accept="image/*"
                  />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default UserCard;
