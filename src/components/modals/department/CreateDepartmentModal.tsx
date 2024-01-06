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
import {
  CreateDepartmentSchema,
  CreateDepartmentSchemaType,
} from "@/schema/department";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDeparment } from "@/queries/department";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isAxiosError } from "axios";
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateDepartmentModal = ({ isOpen, onClose }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createDeparment,
  });

  const form = useForm<CreateDepartmentSchemaType>({
    resolver: zodResolver(CreateDepartmentSchema),
    defaultValues: {
      name: "",
      courseYear: 4,
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateDepartmentSchema>) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    mutation.mutate(values, {
      async onSuccess() {
        toast.success(`Department has been added`);
        await queryClient.invalidateQueries({
          queryKey: ["departments"],
        });
        form.reset();
        onClose();
      },
      onError(error) {
        if (isAxiosError(error)) {
          form.setError("name", {
            type: "manual",
            message: error.response?.data.message || "Something went wrong",
          });
        }
      },
    });
  };

  const isDisabled = form.formState.isSubmitting || form.formState.isLoading;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        onClose();
        !isOpen && form.reset();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Department</DialogTitle>
          <DialogDescription>
            add new department to manage sections.
          </DialogDescription>
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
                        <Input
                          disabled={isDisabled}
                          placeholder="Department"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* course year */}
                <FormField
                  control={form.control}
                  name="courseYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Year</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isDisabled}
                          placeholder="Course Year"
                          type="number"
                          {...field}
                        />
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
