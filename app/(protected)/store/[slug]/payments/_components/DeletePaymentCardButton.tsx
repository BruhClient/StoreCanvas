"use client";
import DialogButton from "@/components/DialogButton";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { deleteConnectAccount } from "@/server/actions/stripe";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const DeletePaymentCardButton = ({
  stripeAccountId,
}: {
  stripeAccountId: string;
}) => {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();
  const handleDeletePayment = async () => {
    setIsPending(true);
    await deleteConnectAccount(stripeAccountId).then((data) => {
      if (!data.success) {
        showErrorToast();
      } else {
        showSuccessToast();
        router.refresh();
      }
    });
    setIsPending(false);
  };
  return (
    <DialogButton
      buttonContent={
        <Button variant="destructive" className="w-full">
          Delete Payment Option
        </Button>
      }
    >
      <DialogHeader>
        <DialogTitle>Are you sure ?</DialogTitle>
        <DialogDescription>
          This payment option will be removed from our servers
        </DialogDescription>
      </DialogHeader>

      <Button
        variant={"outline"}
        onClick={handleDeletePayment}
        disabled={isPending}
      >
        Delete Payment Card
      </Button>
    </DialogButton>
  );
};

export default DeletePaymentCardButton;
