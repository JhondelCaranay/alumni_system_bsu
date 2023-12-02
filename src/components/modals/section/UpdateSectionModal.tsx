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
  SectionSchemaType,
  UpdateSectionSchema,
  UpdateSectionSchemaType,
} from "@/schema/section";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isAxiosError } from "axios";
import { updateSection } from "@/queries/sections";
type Props = {
  section: SectionSchemaType;
  isOpen: boolean;
  onClose: () => void;
};
const UpdateSectionModal = ({ section, isOpen, onClose }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateSectionSchemaType) =>
      updateSection(section.id, data),
  });

  const form = useForm<UpdateSectionSchemaType>({
    resolver: zodResolver(UpdateSectionSchema),
    defaultValues: {
      name: section.name,
    },
  });

  const onSubmit = async (values: z.infer<typeof UpdateSectionSchema>) => {
    mutation.mutate(values, {
      onSuccess() {
        toast.success(`Section has been updated`);
        queryClient.invalidateQueries({
          queryKey: ["sections"],
        });
        form.reset();
        onClose();
      },
      onError(error) {
        if (isAxiosError(error)) {
          console.log(
            "🚀 ~ file: UpdateSectionModal.tsx:62 ~ onError ~ error:",
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
          <DialogTitle>Update Section</DialogTitle>
          <DialogDescription>update new section.</DialogDescription>
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
                          placeholder="Section"
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
export default UpdateSectionModal;
