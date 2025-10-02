import UserButton from "@/components/auth/UserButton";
import CreateStoreForm from "@/components/forms/CreateStoreForm";
import { StoreSwitcher } from "@/components/sidebar/store-switcher";
import StoreSelector from "@/components/StoreSelector";
import React, { Suspense } from "react";

const NewStorePage = () => {
  return (
    <div className="w-full flex justify-center h-screen items-center px-3 flex-col">
      <div className="flex justify-between w-full absolute top-3 px-4">
        <UserButton />
        <Suspense>
          <StoreSelector />
        </Suspense>
      </div>

      <div className="text-center space-y-2 w-full">
        <CreateStoreForm />
      </div>
    </div>
  );
};

export default NewStorePage;
