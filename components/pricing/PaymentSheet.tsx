"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePaymentSheet } from "@/context/payment-sheet-context";
import { createCheckout } from "@/server/actions/stripe";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function PaymentSheet() {
  const { isOpen, close, priceId } = usePaymentSheet();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !priceId) return;

    const getClientSecret = async () => {
      try {
        const secret = await createCheckout({ priceId });
        setClientSecret(secret);
      } catch (err) {
        console.error("Failed to fetch client secret:", err);
      }
    };

    getClientSecret();
  }, [isOpen, priceId]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent side="right" className="p-0 max-w-md w-full">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Complete your payment</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div id="checkout" className="h-full overflow-auto p-4">
          {clientSecret && (
            <EmbeddedCheckoutProvider
              key={clientSecret}
              stripe={stripePromise}
              //@ts-ignore
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
