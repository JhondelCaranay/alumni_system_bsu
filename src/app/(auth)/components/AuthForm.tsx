"use client";
import { Input } from "@/components/ui/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useEffect } from "react";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "This field is required",
  }),
  password: z.string().min(1, {
    message: "This field is required",
  }),
});

type formSchemaType = z.infer<typeof formSchema> | FieldValues;

const AuthForm = () => {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
    mode: "all",
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<formSchemaType> = async (values) => {
    try {
      const response = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (response?.error) {
        toast.error("invalid credentials");
      }

      if (response?.ok && !response.error) {
        toast.success("Logged In!");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-[#ffffffc0] flex flex-col w-[90%] md:w-[30%] items-center p-7 rounded-md z-10"
      >
        <div className="h-[110px] w-[110px] relative">
          <Image src={`/assets/CIT.png`} className="object-contain" alt="logo" fill />
        </div>

        <h1 className=" text-2xl font-semibold text-center mx-10">Alumni System</h1>

        <div className="flex flex-col items-center  w-full gap-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    className="bg-white border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    placeholder={`Enter username`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                  Password
                </FormLabel>

                <FormControl>
                  <Input
                    disabled={isLoading}
                    className="bg-white border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    placeholder={`Enter Password`}
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <button
          disabled={isLoading}
          className="bg-[#0D6EFD] p-1.5 w-full rounded-sm text-white text-md mt-5 flex justify-center disabled:cursor-not-allowed"
        >
          {(() => {
            if (isLoading) return <Loader2 className="animate-spin " />;

            return "Login";
          })()}
        </button>
      </form>
    </Form>
  );
};

export default AuthForm;
