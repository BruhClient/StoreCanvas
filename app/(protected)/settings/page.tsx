import UpdateUsernameButton from "@/components/forms/auth/EditUsername";
import ProfilePicUploader from "@/components/ProfilePicUploader";
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
      <ProfilePicUploader
        initialImage={session.user.image}
        id={session.user.id}
      />
      <UpdateUsernameButton
        userId={session.user.id}
        initialUsername={session.user.name}
      />
    </div>
  );
};

export default SettingsPage;
