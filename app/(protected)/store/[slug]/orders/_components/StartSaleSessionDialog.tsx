"use client";

import { Button } from "@/components/ui/button";
import { DoorOpen } from "lucide-react";
import React, { useState, useEffect } from "react";
import DialogButton from "@/components/DialogButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateSaleSessionPayload,
  CreateSaleSessionSchema,
} from "@/schemas/create-sale-session";
import { createSaleSession } from "@/server/db/saleSessions";
import { useStore } from "@/context/store-context";
import { useQueryClient } from "@tanstack/react-query";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "@/lib/toast";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddPaymentOptionDialog from "@/components/AddPaymentOptionDialog";
import useSessionUser from "@/hooks/use-session-user";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { set } from "date-fns";

const paymentOptions = [
  {
    name: "PayNow",
    key: "paynow",
    description: "Fast local bank transfer via PayNow QR / UEN.",
    feePerTransaction: "2.9% per transaction",
    icon: "/paynow1.jpg",
  },
  {
    name: "Stripe Checkout (Cards)",
    key: "cards",
    description: "Accept debit/credit cards worldwide with Stripe Checkout.",
    feePerTransaction: "3.5% + $0.30 per transaction",
    icon: "/stripe.webp",
  },
];

const StartSaleSessionButton = () => {
  const [isPending, setIsPending] = useState(false);
  const { store } = useStore();
  const user = useSessionUser();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(CreateSaleSessionSchema),
    defaultValues: {
      paymentType: "paynow" as "paynow" | "cards",
      accountId: "",
    },
  });

  // Fetch payment cards
  const [cards, setCards] = useState<{ id: string; name: string }[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingCards, setLoadingCards] = useState(false);

  useEffect(() => {
    if (!user) return;

    setLoadingCards(true);
    fetch("/api/payment-cards")
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch(() => showErrorToast("Failed to fetch payment cards"))
      .finally(() => setLoadingCards(false));
  }, [user]);

  useEffect(() => {
    if (form.formState.errors.accountId) {
      showErrorToast(form.formState.errors.accountId.message);
    }
  }, [form.formState.errors]);

  const onSubmit = async (values: CreateSaleSessionPayload) => {
    setIsPending(true);
    setDialogOpen(false);
    const toastId = showLoadingToast("Opening Store...");

    try {
      const data = await createSaleSession(store.id, values);

      if (!data.success) {
        showErrorToast(data.error);
        return;
      }

      showSuccessToast("Your store is open!");

      // Update infiniteQuery cache
      queryClient.setQueryData(["saleSessions", store.id], (oldData: any) => {
        if (!oldData) return oldData;

        const newPage = [data.session]; // wrap new session in a page
        return {
          ...oldData,
          pages: [newPage, ...oldData.pages],
          pageParams: [...oldData.pageParams],
        };
      });
    } catch {
      showErrorToast();
    } finally {
      toast.dismiss(toastId);
      setIsPending(false);
    }
  };

  return (
    <DialogButton
      setDialogOpen={setDialogOpen}
      dialogOpen={dialogOpen}
      buttonContent={
        <Button variant="outline" disabled={isPending}>
          <DoorOpen />
          {isPending ? "Opening..." : "Open Store"}
        </Button>
      }
      title="Start Sale Session"
      description="Allow customers to buy products"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {/* Payment Type */}
          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <div className="flex flex-col gap-2">
                    {paymentOptions.map(
                      ({ name, key, feePerTransaction, description, icon }) => (
                        <div
                          key={key}
                          onClick={() => field.onChange(key)}
                          className={cn(
                            "p-2 rounded-lg border-2 space-y-2 cursor-pointer hover:bg-muted",
                            field.value === key
                              ? "border-black"
                              : "border-muted"
                          )}
                        >
                          <div className="flex gap-2">
                            <Image
                              width={50}
                              height={50}
                              src={icon}
                              alt={key}
                              className="border-2 object-cover rounded-lg"
                            />
                            <div className="flex flex-col">
                              <div className="font-semibold text-lg">
                                {name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {feePerTransaction}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground font-semibold">
                            {description}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Payment Account */}
          <FormField
            control={form.control}
            name="accountId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  {loadingCards ? (
                    <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
                  ) : cards && cards.length > 0 ? (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a payment account" />
                      </SelectTrigger>
                      <SelectContent>
                        {cards.map((card) => (
                          <SelectItem key={card.id} value={card.id}>
                            {card.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <AddPaymentOptionDialog />
                  )}
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            className="w-full"
            size="lg"
            variant="outline"
            disabled={form.formState.isSubmitting || isPending}
          >
            Start Sale Session
          </Button>
        </form>
      </Form>
    </DialogButton>
  );
};

export default StartSaleSessionButton;
