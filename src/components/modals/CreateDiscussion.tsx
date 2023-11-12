"use client";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/useModalStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader } from "../ui/loader";
import Avatar from "../Avatar";
import { useSession } from "next-auth/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { DepartmentSchemaType } from "@/schema/department";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronsUpDown, GalleryHorizontal, Image } from "lucide-react";
import EmojiPicker from "../EmojiPicker";
import ActionTooltip from "../ActionTooltip";

const CreateDiscussion = () => {
  const { data: session } = useSession();
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "createDiscussion";

  const onHandleClose = () => {
    onClose();
    form.reset();
  };
  const [open, setOpen] = useState(false);
  const formSchema = z.object({
    description: z.string().min(1, { message: "Description is required" }),
    departments: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one department",
      }),
  });

  type formSchemaType = z.infer<typeof formSchema>;

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      departments: [],
    },
    mode: "all",
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [form]);

  const [_, textareaHeightUpdater] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaHeight(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaHeight(textAreaRef.current);
  }, [form.getValues("description")]);

  const updateTextAreaHeight = (textArea?: HTMLTextAreaElement) => {
    if (!textArea) return;
    textArea.style.height = "0";
    textArea.style.height = `${textArea.scrollHeight}px`;
  };

  const departments = useQueryProcessor<DepartmentSchemaType[]>(
    "/departments",
    null,
    ["departments"],
    {
      enabled: isModalOpen
    }
  );

  const selectableDepartments = departments?.data?.map((department) => ({
    label: department.name,
    value: department.id,
  }));

  const onSubmit: SubmitHandler<formSchemaType> = async (values) => {
    console.log(values);
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="bg-white text-black overflow-hidden dark:bg-[#020817] dark:text-white">
          <DialogHeader className=" ">
            <DialogTitle className="text-2xl text-center font-bold dark:text-white">
              Create Discussion
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="flex gap-x-3 w-full">
                <Avatar
                  src={session?.user.image}
                  className="w-[50px] h-[50px]"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-zinc-500">
                    {session?.user.name}
                  </span>
                  <FormField
                    control={form.control}
                    name="departments"
                    render={() => (
                      <FormItem>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="link"
                              role="combobox"
                              aria-expanded={open}
                              className="justify-between text-zinc-500 p-0 capitalize"
                            >
                              Select department
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="max-w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search departments." />
                              <CommandEmpty>No department found.</CommandEmpty>
                              <CommandGroup className="">
                                {selectableDepartments?.map((item) => (
                                  <CommandItem>
                                    <FormField
                                      key={item.value}
                                      control={form.control}
                                      name="departments"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={item.value}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(
                                                  item.value
                                                )}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([
                                                        ...field.value,
                                                        item.value,
                                                      ])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) =>
                                                            value !== item.value
                                                        )
                                                      );
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal capitalize">
                                              {item.label.toLowerCase()}
                                            </FormLabel>
                                          </FormItem>
                                        );
                                      }}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-full mt-5 flex flex-col">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Textarea
                          ref={inputRef}
                          disabled={isLoading}
                          value={field.value}
                          className=" dark:bg-[#52525B] dark:text-white w-full overflow-hidden outline-none max-h-[20em] bg-white placeholder:text-lg placeholder:font-semibold placeholder:text-zinc-400 focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none border-0"
                          placeholder={`Write your thoughts here...`}
                          // dont remove this textareaHeightUpdater(e.target.value)
                          onChange={(e) => {
                            textareaHeightUpdater(e.target.value),
                              field.onChange(e);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <section className="border rounded-md py-2 px-3 border-zinc-500 flex justify-between items-center mt-5">
                  <span className="text-sm font-semibold">Add to your post</span>
                  <div className="flex gap-x-2">
                    <ActionTooltip label="Photo/video">
                      <Image className="w-7 h-7 cursor-pointer text-zinc-500 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300" />
                    </ActionTooltip>
                    <ActionTooltip label="Add emoji">
                      <div className="flex items-center">
                      <EmojiPicker className="dark:text-white" onChange={(emoji) => form.setValue('description', `${form.getValues('description')}${emoji.native}`)} />
                      </div>
                    </ActionTooltip>
                  </div>
              </section>
                
              <DialogFooter className=" py-4">
                <Button
                  variant={"default"}
                  type="submit"
                  className=" dark:text-white"
                  disabled={isLoading}
                >
                  {(() => {
                    if (isLoading)
                      return (
                        <div>
                          {" "}
                          Adding post <Loader />
                        </div>
                      );
                    return "Post";
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

export default CreateDiscussion;
