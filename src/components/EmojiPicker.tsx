"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
type EmojiPickerProps = {
  onChange: (value: Record<string, any>) => void;
  className?: string;
};
const EmojiPicker: React.FC<EmojiPickerProps> = ({ onChange, className }) => {
  const {resolvedTheme} = useTheme()
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className={ cn("text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition", className)} />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <Picker data={data} onEmojiSelect={(emoji: any) => onChange(emoji)} theme={resolvedTheme} />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;