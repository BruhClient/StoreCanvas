import UserButton from "@/components/auth/UserButton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const SettingsPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center w-full h-screen flex-col gap-3">
      <UserButton />
    </div>
  );
};

export default SettingsPage;
