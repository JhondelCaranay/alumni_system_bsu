import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { CreateDepartmentSchema, CreateDepartmentSchemaType } from "@/schema/department";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDeparment } from "@/queries/department";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

type Props = {};

const CreateDepartmentModal = ({}: Props) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createDeparment,
  });

  const form = useForm<CreateDepartmentSchemaType>({
    resolver: zodResolver(CreateDepartmentSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateDepartmentSchema>) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    mutation.mutate(values, {
      onSuccess() {
        toast.success(`Department has been added`);
        queryClient.invalidateQueries({
          queryKey: ["departments"],
        });
        form.reset();
        setOpen(false);
      },
    });
  };

  const isDisabled = form.formState.isSubmitting || form.formState.isLoading;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        !isOpen && form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Department</DialogTitle>
          <DialogDescription>add new department to manage sections.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={isDisabled} placeholder="Department" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                  <Button
                    disabled={isDisabled}
                    variant="outline"
                    onClick={() => {
                      form.reset();
                    }}
                    className="disabled:pointer-events-auto disabled:cursor-not-allowed"
                  >
                    Cancel
                  </Button>
                  <Button disabled={isDisabled} type="submit">
                    Add
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CreateDepartmentModal;
