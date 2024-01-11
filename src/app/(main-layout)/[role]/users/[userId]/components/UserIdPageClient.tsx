"use client";
import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import UserSkeleton from "./UserSkeleton";
import Avatar from "@/components/Avatar";
import { UserWithProfile } from "@/types/types";
import { Separator } from "@/components/ui/separator";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowBigLeft, ArrowLeft, Loader2, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import toast from "react-hot-toast";
import useRouterPush from "@/hooks/useRouterPush";

const UserIdPageClient = () => {
  // const { userId } = useParams();
  const { redirectTo } = useRouterPush();
  const params = useParams();

  const userId = params?.userId as string;

  const { data, status } = useQueryProcessor<UserWithProfile>(
    `/users/${userId}`,
    null,
    ["users", userId],
    {
      enabled: typeof userId !== "undefined",
    }
  );

  const formSchema = z.object({
    firstname: z.string().min(1, { message: "Required field" }),
    lastname: z.string().min(1, { message: "Required field" }),
    bsu_email: z
      .string()
      .min(1, { message: "Required field" })
      .email({ message: "Invalid email" }),
    middlename: z.string().min(1, { message: "Required field" }),
    city: z.string().min(1, { message: "Required field" }),
    homeNo: z.string().min(1, { message: "Required field" }),
    street: z.string().min(1, { message: "Required field" }),
    barangay: z.string().min(1, { message: "Required field" }),
    province: z.string().min(1, { message: "Required field" }),
    contactNo: z.string().min(1, { message: "Required field" }),
  });

  type formSchemaType = z.infer<typeof formSchema>;

  const router = useRouter();

  const { mutate, isPending } = useMutateProcessor<
    formSchemaType,
    UserWithProfile
  >(`/users/${userId}`, null, "PATCH", ["users", userId], {
    enabled: typeof userId !== "undefined",
  });

  const form = useForm<formSchemaType>({
    defaultValues: {
      firstname: data?.profile.firstname as string,
      lastname: data?.profile.lastname as string,
      middlename: data?.profile.middlename as string,
      bsu_email: data?.email as string,
      city: data?.profile.city as string,
      homeNo: data?.profile.homeNo as string,
      street: data?.profile.street as string,
      barangay: data?.profile.barangay as string,
      province: data?.profile.province as string,
      contactNo: data?.profile.contactNo as string,
    },
    resolver: zodResolver(formSchema),
    mode: "all",
  });

  useEffect(() => {
    if (data) {
      form.setValue("bsu_email", data?.email || "");
      form.setValue("firstname", data?.profile.firstname || "");
      form.setValue("lastname", data?.profile.lastname || "");
      form.setValue("middlename", data?.profile.middlename || "");
      form.setValue("barangay", data?.profile.barangay || "");
      form.setValue("province", data?.profile.province || "");
      form.setValue("city", data?.profile.city || "");
      form.setValue("street", data?.profile.street || "");
      form.setValue("homeNo", data?.profile.homeNo || "");
      form.setValue("contactNo", data?.profile.contactNo || "");
    }
  }, [data, form, router]);

  const formSubmitting = form.formState.isSubmitting || isPending;

  const { onOpen } = useModal();

  const onSubmit: SubmitHandler<formSchemaType> = (values) => {
    mutate(values, {
      onSuccess(data, variables, context) {
        toast.success("User has been updated!");
        form.reset();
        router.refresh();
      },
      onError() {
        toast.error("User did not update");
      },
    });
  };

  if (status === "pending") {
    return <UserSkeleton />;
  }

  if (status === "error") {
    return (
      <h1 className="text-center font-semibold text-zinc-300">
        Error fetching user
      </h1>
    );
  }

  if (data.isArchived) {
    redirectTo("users");
  }

  return (
    <div className="flex flex-col p-5 gap-10">
      <header>
        <ArrowLeft
          className=" cursor-pointer hover:text-zinc-500 transition-all"
          onClick={() => redirectTo("users")}
        />
      </header>

      <main className="flex flex-col">
        <section className="border-[2px] border-zinc-200 rounded-md p-3 flex items-center">
          <Avatar
            className="w-[80px] h-[80px] object-cover rounded-sm"
            src={data?.image as string}
          />
          <div className="flex flex-col ml-3">
            <span className="text-black font-semibold dark:text-white">
              {data.profile.firstname} {data.profile.lastname}
            </span>
            <span className="text-zinc-500 text-xs">
              @{data.profile.alternative_email}
            </span>
          </div>
        </section>
        <Separator className="my-10 bg-zinc-200 h-2 dark:bg-zinc-600" />

        <Form {...form}>
          <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
            <section className="flex flex-col ">
              <h2 className="font-semibold my-5">User information</h2>

              <div className="flex w-full gap-x-3 mt-5">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                        Firstname
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={formSubmitting}
                          className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 dark:bg-transparent dark:text-white"
                          type="text"
                          placeholder={`Enter firstname`}
                          {...field}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="middlename"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                        Middlename
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={formSubmitting}
                          className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 dark:bg-transparent dark:text-white"
                          type="text"
                          placeholder={`Enter middlename`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex w-full gap-x-3 mt-5">
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                        Lastname
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={formSubmitting}
                          className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 dark:bg-transparent dark:text-white"
                          type="text"
                          placeholder={`Enter lastname`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bsu_email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={formSubmitting}
                          className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 dark:bg-transparent dark:text-white"
                          type="email"
                          placeholder={`Enter email`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <Separator className="mt-10 bg-zinc-200 h-1 dark:bg-zinc-600" />

            <section className="flex flex-col ">
              <h2 className="font-semibold my-5">Physical Address</h2>

              <div className="flex w-full gap-x-3 mt-5">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={formSubmitting}
                          className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 dark:bg-transparent dark:text-white"
                          type="text"
                          placeholder={`Enter city`}
                          {...field}
                          value={field.value}
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
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                        Home Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={formSubmitting}
                          className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 dark:bg-transparent dark:text-white"
                          type="text"
                          placeholder={`Enter home number`}
                          {...field}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex w-full gap-x-3 mt-5">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                        Street
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={formSubmitting}
                          className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 dark:bg-transparent dark:text-white"
                          type="text"
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
                  name="barangay"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                        Barangay
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={formSubmitting}
                          className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 dark:bg-transparent dark:text-white"
                          type="text"
                          placeholder={`Enter barangay`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex w-full mt-5">
                <FormField
                  control={form.control}
                  name="contactNo"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={formSubmitting}
                          className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 dark:bg-transparent dark:text-white"
                          type="number"
                          placeholder={`Enter phone number`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="mt-10">
              <Button
                type="submit"
                variant={"default"}
                className="w-fit"
                disabled={formSubmitting}
              >
                {(() => {
                  if (formSubmitting) {
                    return (
                      <div className="flex items-center">
                        <span>Saving</span>{" "}
                        <Loader2 className="animate-spin ml-2 w-5 h-5" />
                      </div>
                    );
                  }

                  return "Save update";
                })()}
              </Button>
            </section>

            <Separator className="my-10 bg-zinc-200 h-1 dark:bg-zinc-600" />
            <section className="flex flex-col ">
              <h2 className="font-semibold my-5 text-rose-700">Danger Zone</h2>
              <Button
                type="button"
                variant={"destructive"}
                className="w-fit"
                onClick={() => onOpen("archiveUser", { user: data })}
                disabled={formSubmitting}
              >
                Archive user
              </Button>
            </section>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default UserIdPageClient;
