"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { JobSchemaType } from "@/schema/jobs";

const DeleteWorkExperienceModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "deleteWorkExperience";

  const deleteWorkExperience = useMutateProcessor<string, JobSchemaType>(`/users/${data.user?.id}/jobs/${data.workExperience?.id}`, null, "DELETE", ["users", 'jobs', data.user?.id]);

  const onCancel = () => {
    onClose();
  };

  const onConfirm = async () => {
    try {
        deleteWorkExperience.mutate(data.workExperience?.id as string, {
        onSuccess() {
          toast.success(`Work experience has been deleted`);
          onClose();
        },
        onError() {
          toast.error(`Something went wrong...`);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Delete Work Experience</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this?
            <br />
            This information will be permanently{" "}
            <span className="text-rose-500 font-semibold">deleted</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4 ">
          <div className="flex items-center justify-between w-full">
            <Button
              className=""
              disabled={deleteWorkExperience.isPending}
              onClick={onCancel}
              variant={"ghost"}
            >
              Cancel
            </Button>
            <Button
              className="text-white"
              disabled={deleteWorkExperience.isPending}
              onClick={onConfirm}
              variant={"default"}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteWorkExperienceModal;
