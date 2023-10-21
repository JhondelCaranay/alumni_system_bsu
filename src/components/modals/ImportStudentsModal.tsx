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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, FileDown, FileIcon, X } from "lucide-react";

export const formSchema = z.object({
  excelFile: z.any().refine((val) => val?.length > 0, "File is required"),
});

export type formType = z.infer<typeof formSchema>;

// type and validation for excel sheet to json
export const excelToJsonSchema = z.array(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      studentNumber: z.string().min(1),
      yearEnrolled: z.string().min(1),
      yearGraduated: z.string().min(1),
      religion: z.string().min(1),
      gender: z.string().min(1),
      dateOfBirth: z.string().min(1),
      placeOfBirth: z.string().min(1),
      city: z.string().min(1),
      province: z.string().min(1),
      contactNo: z.string().min(1),
    })
  )

export type ExcelToJsonSchemaType = z.infer<typeof excelToJsonSchema>

const ImportStudentsModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "importStudents";

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      excelFile: null,
    },

    mode: "all",
  });

  const isLoading = form.formState.isSubmitting;

  const { register } = form;

  const onHandleClose = () => {
    form.setValue("excelFile", null);
    onClose();
  };

  // converting sheet to json and api request



  const uploadData = (
    value: formType["excelFile"],
    callback: (json: ExcelToJsonSchemaType) => void
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
        ) as ExcelToJsonSchemaType;

        callback(json);
      };
      reader.readAsArrayBuffer(value);
    } catch (error) {
      console.error("error uploading data");
    }
  };

  const onSubmit: SubmitHandler<formType> = async (values) => {
    const data = values.excelFile[0];

    // callback pattern
    uploadData(data, (jsonData: ExcelToJsonSchemaType) => {
      
      console.log("json data", jsonData);

      // api request here...
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-3 px-6">
          <DialogTitle className="text-2xl text-center font-bold m-2">
            Import Students{" "}
          </DialogTitle>

          <DialogDescription className="text-center text-zinc m-2 font-semibold">
            Import students using excel file.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-21">
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
                          <FormItem>
                            <label
                              htmlFor="upload"
                              className="flex items-center w-full px-7 p-3 rounded-md cursor-pointer text-sm text-white bg-[#034FA1]"
                            >
                              Import <FileDown className=" text-green-400 " />
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
              <Button variant={"default"}>
                {(() => {
                  if (isLoading)
                    return (
                      <>
                        <Loader2 className="animate-spin mr-2" /> importing
                      </>
                    );

                  return "Import";
                })()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ImportStudentsModal;
