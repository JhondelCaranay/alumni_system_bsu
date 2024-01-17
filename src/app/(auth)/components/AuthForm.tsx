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
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  email: z.string().min(1, {
    message: "This field is required",
  }),
  password: z.string().min(1, {
    message: "This field is required",
  }),
});

type formSchemaType = z.infer<typeof formSchema> | FieldValues;

const AuthForm = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
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
        // window.location.reload();
        router.refresh();
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
          <Image
            src={`/assets/CIT.png`}
            className="object-contain"
            alt="logo"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <h1 className=" text-2xl font-semibold text-center mx-10 mt-5">
          CITZEN
        </h1>

        <div className="flex flex-col items-center  w-full gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    className="bg-white border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    type="email"
                    placeholder={`Enter email`}
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
                    type={showPass ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-fit flex self-start mt-5 items-center gap-x-3">
          <Checkbox
            id="showPass"
            checked={showPass === true}
            onCheckedChange={(checked) => {
              setShowPass((prev) => !prev);
            }}
          />
          <label htmlFor="showPass" className="text-sm cursor-pointer">
            Show Password
          </label>
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
