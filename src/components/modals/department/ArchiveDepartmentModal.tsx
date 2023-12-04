import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveDeparment } from "@/queries/department";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { isAxiosError } from "axios";
import { DepartmentSchemaType } from "@/schema/department";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
type Props = {
  department: DepartmentSchemaType;
};
const ArchiveDepartmentModal = ({ department }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => archiveDeparment(department.id),
  });

  const onSubmit = async () => {
    mutation.mutate(undefined, {
      onSuccess() {
        toast.success(`Department has been updated`);
        queryClient.invalidateQueries({
          queryKey: ["departments"],
        });
      },
      onError(error) {
        if (isAxiosError(error)) {
          console.log(
            "🚀 ~ file: ArchiveDepartmentModal.tsx:62 ~ onError ~ error:",
            error
          );
        }
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="text-red-600 hover:!text-red-600 hover:!bg-red-100"
        >
          <Archive className="h-4 w-4 mr-2" />
          Archive
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will archive the department
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={"destructive"} asChild onClick={() => onSubmit()}>
            <AlertDialogAction className="bg-red-600">
              Confirm
            </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default ArchiveDepartmentModal;
