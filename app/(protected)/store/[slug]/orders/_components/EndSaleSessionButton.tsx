"use client";
import DialogButton from "@/components/DialogButton";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import React, { useState } from "react";
import { closeStore } from "@/server/db/stores";
import { useStore } from "@/context/store-context";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "@/lib/toast";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
const EndSaleSessionButton = () => {
  const [isPending, setIsPending] = useState(false);
  const { store } = useStore();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const closeUserStore = async () => {
    setIsPending(true);
    setDialogOpen(false);
    const toastId = showLoadingToast("Closing store...");

    try {
      const data = await closeStore(store.id);

      if (!data?.success) {
        showErrorToast();
        return;
      }

      showSuccessToast("Your store is closed");

      queryClient.setQueryData(["saleSessions", store.id], (oldData: any) => {
        if (!oldData) return oldData;

        // Iterate over pages and sessions to update the active one
        const pages = oldData.pages.map((page: any) =>
          page.map((session: any) =>
            session.endedAt ? session : data.endedSession
          )
        );

        return { ...oldData, pages };
      });
    } catch (err) {
      showErrorToast();
    } finally {
      toast.dismiss(toastId);
      setIsPending(false);
    }
  };

  return (
    <DialogButton
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      buttonContent={
        <Button variant={"destructive"} disabled={isPending}>
          {isPending ? "Closing Store..." : "End Sale Session"}
        </Button>
      }
      title="Are you sure ?"
      description="This will close your store and customers will not be able to purchase your products"
    >
      <Button variant={"outline"} disabled={isPending} onClick={closeUserStore}>
        <Store /> Close Store
      </Button>
    </DialogButton>
  );
};

export default EndSaleSessionButton;
