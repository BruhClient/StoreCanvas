import UserButton from "@/components/auth/UserButton";
import CreateStoreForm from "@/components/forms/CreateStoreForm";
import { StoreSwitcher } from "@/components/sidebar/store-switcher";
import React from "react";

const NewStorePage = () => {
  return (
    <div className="w-full flex justify-center h-screen items-center px-3">
      <div className="absolute top-3 left-3 ">
        <UserButton />
      </div>

      <div className="text-center space-y-2 w-full">
        <CreateStoreForm />
      </div>
    </div>
  );
};

export default NewStorePage;
