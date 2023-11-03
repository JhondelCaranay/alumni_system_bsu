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
import { useRouter } from "next/navigation";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { User } from "@prisma/client";
import { UserProfileWithDepartmentSection, UserWithProfile } from "@/types/types";

const ArchiveUserModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "archiveUser";
  const router = useRouter();

  const archiveUser = useMutateProcessor<
    string,
    User | UserWithProfile | UserProfileWithDepartmentSection
  >(`/users/${data?.user?.id}`, { yes: "no" }, "DELETE", ["users"], {
    enabled: typeof data?.user?.id !== "undefined",
  });

  const onCancel = () => {
    onClose();
  };

  const onConfirm = async () => {
    try {
      archiveUser.mutate(data?.user?.id as string, {
        onSuccess() {
          toast.success(`User has been archived`);
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
          <DialogTitle className="text-2xl text-center font-bold">Archive User</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this?
            <br />
            This user will be temporary{" "}
            <span className="text-rose-500 font-semibold">archived</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4 ">
          <div className="flex items-center justify-between w-full">
            <Button
              className=""
              disabled={archiveUser.isPending}
              onClick={onCancel}
              variant={"ghost"}
            >
              Cancel
            </Button>
            <Button
              className=""
              disabled={archiveUser.isPending}
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

export default ArchiveUserModal;
