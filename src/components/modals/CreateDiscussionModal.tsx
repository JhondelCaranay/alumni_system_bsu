"use client";
import React, {
  forwardRef,
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
import { createId } from "@paralleldrive/cuid2";

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
import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { DepartmentSchemaType } from "@/schema/department";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronsUpDown, X, Image as ImageUpload } from "lucide-react";
import EmojiPicker from "../EmojiPicker";
import ActionTooltip from "../ActionTooltip";
import { Input } from "../ui/input";
import { CreatePostSchemaType, PostSchemaType } from "@/schema/post";
import { PostType } from "@prisma/client";
import { useToast } from "../ui/use-toast";
import { uploadPhotoForum } from "@/lib/utils";

const CreateDiscussionModal = () => {
  const { data: session } = useSession();
  const { isOpen, type, onClose } = useModal();
  const isModalOpen = isOpen && type === "createDiscussion";

  const onHandleClose = () => {
    onClose();
    setFilesToDisPlay([]);
    form.reset();
  };
  const [open, setOpen] = useState(false);
  const [filesToDisplay, setFilesToDisPlay] = useState<
    { url: string; id: number | string }[]
  >([]);
  const formSchema = z.object({
    description: z.string().min(1, { message: "Description is required" }),
    departments: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one department",
      }),
    photos: z.any().optional(),
  });

  type formSchemaType = z.infer<typeof formSchema>;

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      departments: [],
      photos: [],
    },
    mode: "all",
  });

  const allowedRoles = [
    "ADMIN",
    "COORDINATOR",
    "BULSU_PARTNER",
    "PESO",
    "ADVISER",
  ];
  useEffect(() => {
    // if the role of current user is not in the allowedRoles then they are students/alumni
    if (!allowedRoles.includes(session?.user.role as string)) {
      form.setValue("departments", [session?.user?.departmentId as string]);
    }
    return () => {
      form.reset();
    };
  }, [form, session]);

  const [_, textareaHeightUpdater] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    if (textArea) {
      updateTextAreaHeight(textArea);
      textAreaRef.current = textArea;
    }
  }, []);

  const description = form.getValues("description");

  useLayoutEffect(() => {
    if (description) {
      updateTextAreaHeight(textAreaRef.current);
    }
  }, [description]);

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
      enabled: isModalOpen,
    }
  );

  const selectableDepartments = departments?.data?.map((department) => ({
    label: department.name,
    value: department.id,
  }));

  const currentDepartment = departments.data?.find(
    (department) => department.id == session?.user.departmentId
  );

  // upload photo

  // remove photo from state
  const removeFiles = (file: { url: string; id: number | string }) => {
    const images = form.getValues("photos") as {
      file: File;
      id: number | string;
    }[];
    const filteredImages = images.filter(
      (formImages) => file.id != formImages.id
    );

    form.setValue("photos", filteredImages);
    const filteredImagesToDisplay = filesToDisplay.filter(
      (fileToDisplay) => fileToDisplay.id != file.id
    );

    setFilesToDisPlay(filteredImagesToDisplay);
  };

  const createDiscussion = useMutateProcessor<
    CreatePostSchemaType,
    PostSchemaType
  >("/posts", null, "POST", ["discussions"]);

  const { toast } = useToast();

  const onSubmit: SubmitHandler<formSchemaType> = async (values) => {
    // we append all the file into files array to make it iterateable
    const files = [];
    if (values.photos.length > 0) {
      for (const file of values.photos) {
        files.push(file);
      }
      const photos = await Promise.all(
        files.map((data: { file: File; id: number | string }) =>
          uploadPhotoForum(data)
        )
      );

      createDiscussion.mutate(
        {
          description: values.description,
          department: values.departments,
          type: PostType.FEED,
          photos,
        },
        {
          onError(error, variables, context) {
            console.log(error);
            toast({
              variant: "destructive",
              description: "Something went wrong...",
            });
          },
          onSuccess(data, variables, context) {
            toast({
              variant: "default",
              description: "Posted",
            });
            onHandleClose();
          },
        }
      );
    } else {
      createDiscussion.mutate(
        {
          description: values.description,
          department: values.departments,
          type: PostType.FEED,
        },
        {
          onError(error, variables, context) {
            console.log(error);
            toast({
              variant: "destructive",
              description: "Something went wrong...",
            });
          },
          onSuccess(data, variables, context) {
            toast({
              variant: "default",
              description: "Posted",
            });
            onHandleClose();
          },
        }
      );
    }
  };

  const isLoading =
    form.formState.isSubmitting || createDiscussion.status === "pending";

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
                        {allowedRoles.includes(
                          session?.user?.role as string
                        ) ? (
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
                                <CommandEmpty>
                                  No department found.
                                </CommandEmpty>
                                <CommandGroup className="">
                                  {selectableDepartments?.map((item) => (
                                    <CommandItem key={item.value}>
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
                                                  onCheckedChange={(
                                                    checked
                                                  ) => {
                                                    return checked
                                                      ? field.onChange([
                                                          ...field.value,
                                                          item.value,
                                                        ])
                                                      : field.onChange(
                                                          field.value?.filter(
                                                            (value) =>
                                                              value !==
                                                              item.value
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
                        ) : (
                          <span className="justify-between text-zinc-500 p-0 capitalize">
                            {currentDepartment?.name.toLowerCase()}
                          </span>
                        )}

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
                <div className="flex flex-col max-h-[15em] overflow-y-auto gap-y-2 mt-5">
                  {filesToDisplay.map((file) => {
                    return (
                      <div
                        key={file.id}
                        className="relative rounded-md w-full max-h-[20em]"
                      >
                        <X
                          className="w-5 h-5 absolute top-2 rounded-md right-2 z-10 cursor-pointer bg-white text-zinc-600"
                          onClick={() => removeFiles(file)}
                        />
                        <img
                          src={file.url}
                          alt="post image"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <section className="border rounded-md py-2 px-3 border-zinc-500 flex justify-between items-center mt-5">
                <span className="text-sm font-semibold">Add to your post</span>
                <div className="flex gap-x-2">
                  <ActionTooltip label="Photo/video">
                    {/* 
                      This component gives error when createDiscussionModal is open

                      Warning: Function components cannot be given refs.
                      Attempts to access this ref will fail.
                      Did you mean to use React.forwardRef()?
                      Check the render method of `SlotClone`.
                      at FormField
                      
                    */}
                    <FormField
                      control={form.control}
                      name="photos"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <label htmlFor="photos">
                            <ImageUpload className="w-7 h-7 cursor-pointer text-zinc-500 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300" />
                          </label>
                          <FormControl>
                            <Input
                              {...form.register("photos")}
                              placeholder="Add photo/video"
                              className="sr-only"
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={async (e) => {
                                setFilesToDisPlay([]);
                                const files = e.target.files;
                                if (files && files?.length > 0) {
                                  const filesToDisplay = [];
                                  for (
                                    let index = 0;
                                    index < files.length;
                                    index++
                                  ) {
                                    filesToDisplay.push({
                                      file: files[index],
                                      id: createId(),
                                    });
                                  }
                                  field.onChange(
                                    filesToDisplay.map((file) => file)
                                  );
                                  const convertToBase64 = (data: {
                                    file: File;
                                    id: number | string;
                                  }) => {
                                    const reader = new FileReader();
                                    reader.readAsDataURL(data.file);
                                    reader.onloadend = () => {
                                      setFilesToDisPlay((prev) => [
                                        ...prev,
                                        {
                                          url: reader.result as string,
                                          id: data.id,
                                        },
                                      ]);
                                    };
                                  };
                                  await Promise.all(
                                    filesToDisplay.map(
                                      (data: {
                                        file: File;
                                        id: number | string;
                                      }) => convertToBase64(data)
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* 
                      end
                    */}
                  </ActionTooltip>

                  <ActionTooltip label="Add emoji">
                    <div className="flex items-center">
                      <EmojiPicker
                        className="dark:text-white"
                        onChange={(emoji) =>
                          form.setValue(
                            "description",
                            `${form.getValues("description")}${emoji.native}`
                          )
                        }
                      />
                    </div>
                  </ActionTooltip>
                </div>
              </section>

              <DialogFooter className=" py-4">
                <Button
                  variant={"default"}
                  type="submit"
                  className=" dark:text-white w-fit"
                  disabled={isLoading}
                >
                  {(() => {
                    if (isLoading) return <Loader size={25} />;
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

export default CreateDiscussionModal;
