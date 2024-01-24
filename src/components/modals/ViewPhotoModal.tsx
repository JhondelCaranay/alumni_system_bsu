"use client";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";

import Image from "next/image";

// type and validation for excel sheet to json

const ViewPhotoModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "viewPhoto";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-transparent text-black p-0 max-h-[90vh] max-w-[90vw] md:max-w-[70vw] md:max-h-[70vh] overflow-y-auto dark:bg-[#020817] dark:text-white rounded-md ">
        <img
          src={data?.photoUrl || ""}
          alt="photo"
          className="h-full w-full z-50 object-cover"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ViewPhotoModal;
