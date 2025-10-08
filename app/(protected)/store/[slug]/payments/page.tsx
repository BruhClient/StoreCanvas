import AddPaymentOptionDialog from "@/components/AddPaymentOptionDialog";
import { getPaymentCards } from "@/server/db/paymentCards";
import React from "react";
import PaymentCardGrid from "./_components/PaymentCardGrid";
import { auth } from "@/lib/auth";
import OnboardingTour from "@/components/OnboardingTour";

const paymentSteps = [
  {
    target: ".create-payment-button", // ✅ match your real button class
    content: "Click here to create a new payment option.",
    disableBeacon: true,
  },
  {
    target: ".payment-feed",
    content:
      "This is your payment feed, where all payment options are displayed.",
    disableBeacon: true,
  },
];

const PaymentPage = async () => {
  const session = await auth();

  const paymentCards = await getPaymentCards(session!.user.id);

  if (!paymentCards) {
    return <div>Failed to load cards</div>;
  }

  return (
    <div className="space-y-3">
      <AddPaymentOptionDialog />
      <PaymentCardGrid cards={paymentCards} />
      <OnboardingTour steps={paymentSteps} id="payments" />
    </div>
  );
};

export default PaymentPage;
