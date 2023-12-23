"use client";

import { ClipLoader } from "react-spinners";

type LoaderProps = {
  size?: number;
};
export const Loader: React.FC<LoaderProps> = ({ size = 55 }) => {
  return (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center">
      <ClipLoader color="#3498db" size={size} />
    </div>
  );
};
