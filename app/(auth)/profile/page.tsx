import EditUsernameButton from "@/components/forms/auth/EditUsername";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async () => {
  const session = await auth();

  if (!session) redirect("/");
  return (
    <div>
      <EditUsernameButton
        initialUsername={session.user.name}
        userId={session.user.id}
      />
    </div>
  );
};

export default ProfilePage;
