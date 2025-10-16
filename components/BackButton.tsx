"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button size={"icon"} onClick={() => router.back()} variant={"outline"}>
      <ChevronLeft />
    </Button>
  );
};

export default BackButton;
