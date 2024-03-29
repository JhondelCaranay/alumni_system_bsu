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
import { createId } from "@paralleldrive/cuid2";

import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/useModalStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "../ui/loader";
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
import { PostSchemaType, UpdatePostSchemaType } from "@/schema/post";
import { useToast } from "../ui/use-toast";
import { uploadPhotoForum } from "@/lib/utils";

const EditDiscussionModal = () => {
  const { data: session } = useSession();
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "editDiscussion";
  const [filesToDisplay, setFilesToDisPlay] = useState<
    { url: string; id: string }[]
  >([]);

  const onHandleClose = () => {
    onClose();
    form.reset();
  };

  const [open, setOpen] = useState(false);

  const updateformSchema = z.object({
    description: z.string().min(1, { message: "Description is required" }),
    departments: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one department",
      }),
    new_photos: z.array(z.any()).optional(),
    delete_photos: z.array(z.string()).optional(),
  });

  type updateFormSchemaType = z.infer<typeof updateformSchema>;

  const form = useForm<updateFormSchemaType>({
    resolver: zodResolver(updateformSchema),
    defaultValues: {
      description: "",
      departments: [],
      new_photos: [],
      delete_photos: [],
    },
    mode: "all",
  });

  const setInitialPhotos = () => {
    if (data.post && data.post?.photos.length > 0) {
      setFilesToDisPlay(
        data?.post?.photos.map((photo) => ({
          url: photo.public_url,
          id: photo.public_id,
        })) || []
      );
    }
  };

  useEffect(() => {
    if (data.post && data.post?.department.length > 0) {
      form.setValue("departments", [
        ...data?.post?.department?.map((d) => d.id),
      ]);
    } else {
      form.setValue("departments", [session?.user?.departmentId as string]);
    }
    form.setValue("description", data?.post?.description as string);
    setInitialPhotos();
    return () => {
      form.reset();
    };
  }, [form, session, isModalOpen]);

  const [_, textareaHeightUpdater] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaHeight(textArea);
    textAreaRef.current = textArea;
  }, []);

  const description = form.getValues("description");

  useLayoutEffect(() => {
    updateTextAreaHeight(textAreaRef.current);
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

  // remove file
  const removeFiles = (file: { url: string; id: string }) => {
    const newPhotos = form.getValues("new_photos") as {
      id: string;
      file: File;
    }[];
    const deletePhotos = form.getValues("delete_photos") as string[];

    const filteredNewPhotos = newPhotos?.filter((photo) => photo.id != file.id);
    setFilesToDisPlay((prev) =>
      prev.filter((fileToDisplay) => fileToDisplay.id != file.id)
    );

    form.setValue("new_photos", filteredNewPhotos);
    form.setValue("delete_photos", [...deletePhotos, file.id]);
  };
  const { toast } = useToast();

  const updateDiscussion = useMutateProcessor<
    UpdatePostSchemaType,
    PostSchemaType
  >(`/posts/${data.post?.id}`, null, "PATCH", ["discussions"]);

  const isLoading =
    form.formState.isSubmitting || updateDiscussion.status === "pending";

  const onSubmit: SubmitHandler<updateFormSchemaType> = async (values) => {
    // we append all the file into files array to make it iterateable
    const { departments, description } = values;
    const deletePhotos = values.delete_photos?.filter((deletePhoto) =>
      deletePhoto.includes("next-alumni-system")
    );

    if (values.new_photos && values.new_photos?.length > 0) {
      const files = [];
      for (const file of values.new_photos) {
        files.push(file);
      }
      const newPhotos = await Promise.all(
        files.map((data: { file: File; id: number | string }) =>
          uploadPhotoForum(data)
        )
      );
      updateDiscussion.mutate(
        {
          new_photos: newPhotos,
          delete_photos: deletePhotos,
          department: departments,
          description,
        },
        {
          onSuccess(data, variables, context) {
            toast({
              variant: "default",
              description: "Post updated.",
            });
            onHandleClose();
          },
          onError(error, variables, context) {
            console.log(error);
            toast({
              variant: "destructive",
              description: "Something went wrong...",
            });
          },
        }
      );
    } else {
      updateDiscussion.mutate(
        { delete_photos: deletePhotos, department: departments, description },
        {
          onSuccess(data, variables, context) {
            toast({
              variant: "default",
              description: "Post updated.",
            });
            onHandleClose();
          },
          onError(error, variables, context) {
            console.log(error);
            toast({
              variant: "destructive",
              description: "Something went wrong...",
            });
          },
        }
      );
    }
  };

  const allowedRoles = [
    "ADMIN",
    "COORDINATOR",
    "BULSU_PARTNER",
    "PESO",
    "ADVISER",
  ];

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="max-h-[95vh] max-w-[90vw] md:w-[550px] overflow-y-auto bg-white text-black dark:bg-[#020817] dark:text-white">
          <DialogHeader className=" ">
            <DialogTitle className="text-2xl text-center font-bold dark:text-white">
              Edit Discussion
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
                            <PopoverTrigger asChild disabled={isLoading}>
                              <Button
                                variant="link"
                                role="combobox"
                                aria-expanded={open}
                                className="justify-between text-zinc-500 p-0 capitalize"
                                disabled={isLoading}
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
                          className=" dark:bg-[#52525B] dark:text-white w-full overflow-hidden outline-none max-h-[15em] bg-white placeholder:text-lg placeholder:font-semibold placeholder:text-zinc-400 focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none border-0"
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
                    <FormField
                      control={form.control}
                      name="new_photos"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <label htmlFor="photos">
                            <ImageUpload className="w-7 h-7 cursor-pointer text-zinc-500 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300" />
                          </label>
                          <FormControl>
                            <Input
                              {...form.register("new_photos")}
                              className="hidden"
                              id="photos"
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={async (e) => {
                                setInitialPhotos(); // initiate a photo to display array
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

                                  // convertToBase64 Function
                                  const convertToBase64 = (data: {
                                    file: File;
                                    id: string;
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

                                  // converting all the files to 64
                                  await Promise.all(
                                    filesToDisplay.map(
                                      (data: { file: File; id: string }) =>
                                        convertToBase64(data)
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
                    if (isLoading)
                      return (
                        <div className="flex items-center gap-x-3">
                          {" "}
                          Saving <Loader2 size={20} />
                        </div>
                      );
                    return "Update";
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

export default EditDiscussionModal;
