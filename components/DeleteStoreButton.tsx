import { stores } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { useState } from "react";
import DialogButton from "./DialogButton";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { Input } from "./ui/input";
import { showErrorToast } from "@/lib/toast";
import {
  deleteStore as deleteUserStore,
  getUserStores,
} from "@/server/db/stores";
import { useRouter } from "next/navigation";

const DeleteStoreButton = ({
  store,
}: {
  store: InferSelectModel<typeof stores>;
}) => {
  const [storeName, setStoreName] = useState("");

  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const deleteStore = async () => {
    setIsPending(true);

    const data = await deleteUserStore(store.id);

    if (data) {
      const stores = await getUserStores(data.data[0].ownerId);

      if (stores.length === 0) {
        router.push("/store/new");
      } else {
        router.push(`/store/${stores[0].name}`);
      }
    } else {
      showErrorToast();
    }
    setIsPending(false);
  };
  return (
    <DialogButton
      title="Are you sure ?"
      description={`Enter ${store.name} in order to confirm `}
      buttonContent={
        <Button type="button" className="w-full" variant={"destructive"}>
          <Trash />
          Delete Store
        </Button>
      }
    >
      <Input
        placeholder="Store Name"
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
      />
      <Button
        variant={"destructive"}
        disabled={storeName !== store.name || isPending}
        onClick={() => {
          deleteStore();
        }}
      >
        Delete Store
      </Button>
    </DialogButton>
  );
};

export default DeleteStoreButton;
