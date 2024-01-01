"use client";

import { cn } from "@/lib/utils";
import { Loader2 as LoaderLucide } from "lucide-react";
import { ClipLoader } from "react-spinners";

type LoaderProps = {
  size?: number;
  className?: string;
  color?: string;
};
export const Loader: React.FC<LoaderProps> = ({ size = 55 }) => {
  return (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center">
      <ClipLoader color="#3498db" size={size} />
    </div>
  );
};

export const Loader2: React.FC<LoaderProps> = ({
  size = 55,
  className,
  color,
}) => {
  return (
    <LoaderLucide
      color={color}
      className={cn("animate-spin mr-2", className)}
      size={size}
    />
  );
};
