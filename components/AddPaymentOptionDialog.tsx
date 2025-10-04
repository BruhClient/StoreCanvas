"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createConnectAccount } from "@/server/actions/stripe";
import { showErrorToast } from "@/lib/toast";
import { useStore } from "@/context/store-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePaymentCardPayload,
  CreatePaymentCardSchema,
} from "@/schemas/create-payment-card";
import { Form } from "./ui/form";
import FormTextInput from "./FormTextInput";

interface AddPaymentOptionDialogProps {
  onAccountCreated?: (stripeConnectId: string) => void;
}

const AddPaymentOptionDialog: React.FC<AddPaymentOptionDialogProps> = ({
  onAccountCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const { store } = useStore();

  const form = useForm({
    resolver: zodResolver(CreatePaymentCardSchema),
    defaultValues: {
      name: "",
    },
  });
  const handleAddPaymentOption = async (values: CreatePaymentCardPayload) => {
    setLoading(true);
    try {
      console.log(values);
      const res = await createConnectAccount(store.name, values.name);

      if (res.success) {
        if (onAccountCreated) onAccountCreated(res.stripeConnectId!);

        // redirect user to Stripe onboarding
        window.location.href = res.onboardingUrl!;
      } else {
        showErrorToast("Failed to create link");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Payment Option</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new payment option</DialogTitle>
          <DialogDescription>
            You’ll be redirected to Stripe to enter your payout details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddPaymentOption)}
            className="space-y-3"
          >
            <FormTextInput
              fieldName="name"
              placeholder=""
              form={form}
              label="Card name"
            />
            <Button disabled={loading}>
              {loading ? "Creating..." : "Start Onboarding"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentOptionDialog;
