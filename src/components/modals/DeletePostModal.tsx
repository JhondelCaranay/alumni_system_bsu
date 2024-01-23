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
import { GuardianSchemaType } from "@/schema/guardian";
import { useToast } from "../ui/use-toast";
import useRouterPush from "@/hooks/useRouterPush";

const DeletePostModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const { toast } = useToast();

  const isModalOpen = isOpen && type === "deletePost";
  const queryKey = data.post?.type === "FEED" ? "discussions" : "jobs";
  const deletePost = useMutateProcessor<string, GuardianSchemaType>(
    `/posts/${data.post?.id}`,
    null,
    "DELETE",
    [queryKey]
  );

  const onCancel = () => {
    onClose();
  };

  const { redirectTo } = useRouterPush();
  const onConfirm = async () => {
    try {
      deletePost.mutate(data.post?.id as string, {
        onSuccess() {
          toast({
            variant: "default",
            description: "Post deleted",
          });
          onClose();
          if (queryKey === "jobs") {
            redirectTo("jobs");
          }
        },
        onError() {
          toast({
            variant: "destructive",
            description: "Something went wrong...",
          });
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] max-w-[90vw] md:w-[550px] overflow-y-auto bg-white text-black p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Post
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this?
            <br />
            This post will be permanently{" "}
            <span className="text-rose-500 font-semibold">deleted</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4 ">
          <div className="flex items-center justify-between w-full">
            <Button
              className=""
              disabled={deletePost.isPending}
              onClick={onCancel}
              variant={"ghost"}
            >
              Cancel
            </Button>
            <Button
              className="text-white"
              disabled={deletePost.isPending}
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

export default DeletePostModal;
