"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const GoBackButton = () => {
  const router = useRouter();
  return (
    <Button onClick={() => router.back()} className="bg-sky-700 text-white">
      Go Back
    </Button>
  );
};
export default GoBackButton;
