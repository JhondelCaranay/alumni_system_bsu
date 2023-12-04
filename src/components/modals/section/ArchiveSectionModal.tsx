import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { SectionSchemaType } from "@/schema/section";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { archiveSection } from "@/queries/sections";

type Props = {
  section: SectionSchemaType;
  isOpen: boolean;
  onClose: () => void;
};
const ArchiveSectionModal = ({ section, isOpen, onClose }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => archiveSection(section.id),
  });

  const onSubmit = async () => {
    mutation.mutate(undefined, {
      onSuccess() {
        toast.success(`Section has been updated`);
        queryClient.invalidateQueries({
          queryKey: ["sections"],
        });
      },
      onError(error) {
        if (isAxiosError(error)) {
          console.log(
            "🚀 ~ file: ArchiveSectionModal.tsx:62 ~ onError ~ error:",
            error
          );
        }
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will archive the section
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
export default ArchiveSectionModal;
