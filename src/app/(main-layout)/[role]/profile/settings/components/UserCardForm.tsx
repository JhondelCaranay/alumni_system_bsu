"use client";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { handleImageDeleteOrReplace, uploadPhoto } from "@/lib/utils";
import { UpdateUserSchemaType } from "@/schema/users";
import { UserWithProfile } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud } from "lucide-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
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

  const updateProfile = useMutateProcessor<UpdateUserSchemaType, UserWithProfile>(
    `/users/${data?.id}`,
    null,
    "PATCH",
    ["users", data?.id],
    {
      enabled: typeof data?.id !== "undefined",
    }
  );
  
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex bg-white dark:bg-[#1F2937] p-5 rounded-lg items-center gap-2"
      >

        {
          updateProfile.status === 'pending' ? <div className="h-[110px] w-[110px]"><Loader size={30} /></div>  : <img src={ (form.getValues('imageUrl') || data?.image) as string} className="h-[110px] w-[110px] rounded-sm object-cover" />
        }

        <div className="flex flex-col ml-2 justify-between h-full">

            <div className="flex flex-col gap-y-1">
                <span className="text-md font-semibold text-zinc-600 dark:text-white">{data?.profile?.firstname} {data?.profile?.lastname}</span>
                <span className="text-sm font-semibold text-zinc-600 dark:text-white capitalize" >{data?.department?.name.toLowerCase()}</span>
            </div>
          
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="">
                <label
                  htmlFor="upload"
                  className="cursor-pointer flex items-center bg-[#2563EB] text-white gap-x-1 py-2 px-3 rounded-md text-sm font-semibold "
                >
                    <UploadCloud className="" />
                        <span className="text-white">
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
                    onChange={ async (e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if(file) {
                        const previousImg = data?.image
                        ?.split("next-alumni-system/")[1]
                        .substring(
                          0,
                          data?.image?.split("next-alumni-system/")[1].lastIndexOf(".")
                        );
                        handleImageDeleteOrReplace(previousImg as string)
                        const res = await uploadPhoto(file)
                        field.onChange(res.url)
                        updateProfile.mutate({
                          image: res.url
                        }, {
                          onSuccess(data, variables, context) {
                            toast.success('Image updated')
                          },
                        })
                      }
                    }}
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
