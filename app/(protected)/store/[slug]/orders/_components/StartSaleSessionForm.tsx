"us client";
import AddPaymentOptionDialog from "@/components/AddPaymentOptionDialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSessionUser from "@/hooks/use-session-user";
import { showErrorToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  CreateSaleSessionPayload,
  CreateSaleSessionSchema,
} from "@/schemas/create-sale-session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

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
    icon: "/stripe.webp", // update path if needed
  },
];

const StartSaleSessionForm = () => {
  const form = useForm({
    resolver: zodResolver(CreateSaleSessionSchema),
    defaultValues: {
      paymentType: "paynow" as "paynow" | "cards",
      accountId: "",
    },
  });

  const onSubmit = (values: CreateSaleSessionPayload) => {};
  const router = useRouter();
  const user = useSessionUser();
  const { data, isLoading } = useQuery({
    queryKey: ["cards", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/payment-cards");
      if (!res.ok) throw new Error("Failed to fetch payment cards");

      return res.json();
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (form.formState.errors.accountId) {
      showErrorToast(form.formState.errors.accountId.message);
    }
  }, [form.formState.errors]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name={"paymentType"}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormControl>
                <div className="flex flex-col gap-2">
                  {paymentOptions.map(
                    ({ name, key, feePerTransaction, description, icon }) => {
                      return (
                        <div
                          onClick={() => field.onChange(key)}
                          key={key}
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
                      );
                    }
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormControl>
                {isLoading ? (
                  // Skeleton while loading
                  <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
                ) : data && data.length > 0 ? (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a payment account" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.map((card: { id: string; name: string }) => (
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

        <Button className="w-full" size={"lg"} variant={"outline"}>
          Start Sale Session
        </Button>
      </form>
    </Form>
  );
};

export default StartSaleSessionForm;
