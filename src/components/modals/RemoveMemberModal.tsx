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
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { useToast } from "../ui/use-toast";

const RemoveMemberModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const { toast } = useToast();

  const isModalOpen = isOpen && type === "removeMember";

  const onCancel = () => {
    onClose();
  };

  const removeMember = useMutateProcessor<null, unknown>(
    `/groupchats/${data?.groupChat?.id}/users/${data?.user?.id}`,
    null,
    "DELETE",
    ["groupchats", data?.groupChat?.id]
  );

  const onConfirm = async () => {
    try {
      removeMember.mutate(null, {
        onSuccess(response, variables, context) {
          toast({
            title: "A member has kicked",
            description: `${data.user?.profile?.firstname} ${data.user?.profile?.lastname} has been removed from the group chat`,
          });
          onClose();
        },
        onError(error, variables, context) {
          console.error(error);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 max-h-[95vh] max-w-[90vw] md:w-[550px] overflow-y-auto">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Kick Member
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this?
            <br />
            {data.user?.profile?.firstname} {data.user?.profile?.lastname} will
            be <span className="text-rose-500 font-semibold">remove</span> from
            the groupchat
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4 ">
          <div className="flex items-center justify-between w-full">
            <Button
              className=""
              disabled={removeMember.isPending}
              onClick={onCancel}
              variant={"ghost"}
            >
              Cancel
            </Button>
            <Button
              className="text-white"
              disabled={removeMember.isPending}
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

export default RemoveMemberModal;
