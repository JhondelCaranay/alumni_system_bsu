"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import * as xlsx from "xlsx";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FileIcon, X, Download } from "lucide-react";
import toast from "react-hot-toast";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { SafeUser } from "@/types/types";
import { Loader2 } from "../ui/loader";
import { useToast } from "../ui/use-toast";
import axios, { AxiosError } from "axios";
import {
  BulkUpdateStudentsSchema,
  BulkUpdateStudentsSchemaType,
} from "@/schema/students";

export const formSchema = z.object({
  excelFile: z.any().refine((val) => val?.length > 0, "File is required"),
});

export type formType = z.infer<typeof formSchema>;

// type and validation for excel sheet to json

const BulkUpdateStudentsModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "bulkUpdateStudents";

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      excelFile: null,
    },
    mode: "all",
  });

  const { register } = form;

  const onHandleClose = () => {
    form.setValue("excelFile", null);
    onClose();
  };

  // converting sheet to json and api request
  const uploadData = (
    value: formType["excelFile"],
    callback: (json: BulkUpdateStudentsSchemaType) => void
  ) => {
    try {
      const reader = new FileReader();

      reader.onloadend = (e) => {
        const data = e?.target?.result;
        const workbook = xlsx?.read(data, { type: "array" });
        const sheetName = workbook?.SheetNames[0];
        const worksheet = workbook?.Sheets[sheetName];
        const json = xlsx?.utils.sheet_to_json(
          worksheet
        ) as BulkUpdateStudentsSchemaType;
        callback(json);
      };
      reader.readAsArrayBuffer(value);
    } catch (error) {
      console.error("error uploading data");
    }
  };
  // we use ['users'] so we can update the data in the users route not in alumni or student route
  const updateStudents = useMutateProcessor<
    BulkUpdateStudentsSchemaType,
    SafeUser[]
  >(`/students/bulk-update`, null, "PATCH", ["students/alumni"]);
  const isLoading = updateStudents.isPending || form.formState.isSubmitting;
  const { toast } = useToast();

  const onSubmit: SubmitHandler<formType> = async (values) => {
    const data = values.excelFile[0];
    // callback pattern
    uploadData(data, (jsonData: BulkUpdateStudentsSchemaType) => {
      // validation
      const validatedJsonData = BulkUpdateStudentsSchema.safeParse(jsonData);

      if (!validatedJsonData.success) {
        return toast({
          title: "Excel did not import properly",
          description: "invalid excel format",
          variant: "destructive",
        });
      }

      // api request here...

      updateStudents.mutate(validatedJsonData.data, {
        onError(error, variables, context) {
          if (axios.isAxiosError(error)) {
            form.reset();
            return toast({
              title: "Excel did not import properly",
              description: error?.response?.data,
              variant: "destructive",
            });
          }
          toast({
            title: "Excel did not import properly",
            description: "Invallid excel format",
            variant: "destructive",
          });
          form.reset();
        },
        onSuccess(data, variables, context) {
          toast({
            title: "The excel has been imported",
          });
          form.reset();
        },
      });
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
      <DialogContent className="max-h-[95vh] max-w-[90vw] md:w-[550px] overflow-y-auto bg-white text-black p-0 dark:bg-[#020817] dark:text-white">
        <DialogHeader className="pt-3 px-6">
          <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
            Update Students{" "}
          </DialogTitle>

          <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
            Update students using excel file.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-21 ">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center mt-5">
                {(() => {
                  const value = form.getValues("excelFile");
                  if (!value) {
                    return (
                      <FormField
                        control={form.control}
                        name="excelFile"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <label
                              htmlFor="upload"
                              className=" hover:bg-zinc-200 w-[60%] transition-all m-auto cursor-pointer py-5 border-zinc-300 border-2 rounded-lg flex flex-col justify-center items-center gap-5 "
                            >
                              <Download className=" text-gray-400 ml-2 h-10 w-10 " />
                              <span className="text-[#42579E] text-sm font-semibold">
                                Choose a file
                              </span>
                              <span className="text-xs text-zinc-500 font-semibold">
                                Excel (xlsx, xls)
                              </span>
                            </label>
                            <FormControl>
                              <Input
                                {...register("excelFile")}
                                className="hidden"
                                id="upload"
                                type="file"
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  }

                  return (
                    <div className="relative flex items-center p-2 mt-2 rounded-md">
                      <FileIcon className="h-10 w-10 fill-green-200" />
                      <a
                        href={"#"}
                        className="ml-2 text-sm text-green-400 dark:text-green-300 hover:underline"
                      >
                        {value[0]?.name}
                      </a>
                      <button
                        onClick={() => {
                          form.setValue("excelFile", null);
                          form.reset();
                        }}
                        className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
            <DialogFooter className="px-6 py-4">
              <a
                href="/assets/update-students-sample-file.xlsx"
                download="update-students-sample-file.xlsx"
              >
                <Button variant={"link"} type="button">
                  Download sample
                </Button>
              </a>

              <Button
                variant={"default"}
                className=" dark:text-white"
                disabled={isLoading}
              >
                {(() => {
                  if (isLoading)
                    return (
                      <div className="flex items-center gap-x-3">
                        {" "}
                        Updating <Loader2 size={20} />
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
  );
};

export default BulkUpdateStudentsModal;
