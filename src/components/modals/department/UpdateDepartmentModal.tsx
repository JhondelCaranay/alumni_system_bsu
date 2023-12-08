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
  DepartmentSchemaType,
  UpdateDepartmentSchema,
  UpdateDepartmentSchemaType,
} from "@/schema/department";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDeparment } from "@/queries/department";
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
  department: DepartmentSchemaType;
  isOpen: boolean;
  onClose: () => void;
};
const UpdateDepartmentModal = ({ department, isOpen, onClose }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateDepartmentSchemaType) =>
      updateDeparment(department.id, data),
  });

  const form = useForm<UpdateDepartmentSchemaType>({
    resolver: zodResolver(UpdateDepartmentSchema),
    defaultValues: {
      name: department.name,
    },
  });

  const onSubmit = async (values: z.infer<typeof UpdateDepartmentSchema>) => {
    mutation.mutate(values, {
      onSuccess() {
        toast.success(`Department has been updated`);
        queryClient.invalidateQueries({
          queryKey: ["departments"],
        });
        form.reset();
        onClose();
      },
      onError(error) {
        if (isAxiosError(error)) {
          console.log(
            "🚀 ~ file: UpdateDepartmentModal.tsx:62 ~ onError ~ error:",
            error
          );
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
          <DialogTitle>Update Department</DialogTitle>
          <DialogDescription>
            update new department to manage sections.
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
export default UpdateDepartmentModal;
