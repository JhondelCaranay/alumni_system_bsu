"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { useModal } from "@/hooks/useModalStore";

const ViewOnylyEventModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "viewOnlyEvent";

  const title = data?.calendarApi?.event?._def?.title;
  const description =
    data?.calendarApi?.event?._def?.extendedProps?.description;

  const onHandleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="bg-white text-black overflow-hidden dark:bg-[#020817] dark:text-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
              Event
            </DialogTitle>
          </DialogHeader>

          <div className="w-full mt-5">
            <div className="w-full flex flex-col max-h-[200px] overflow-y-auto">
              <label className="uppercase text-sm font-bold text-zinc-500 dark:text-secondary/70">
                Title
              </label>
              <span className="text-sm ml-1">{title}</span>
            </div>
            <div className="w-full flex flex-col max-h-[200px] overflow-y-auto">
              <label className="uppercase text-sm font-bold text-zinc-500 dark:text-secondary/70">
                Description
              </label>
              <span className="text-sm ml-1">{description}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewOnylyEventModal;
