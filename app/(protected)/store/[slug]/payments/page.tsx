import AddPaymentOptionDialog from "@/components/AddPaymentOptionDialog";
import { getPaymentCards } from "@/server/db/paymentCards";
import React from "react";
import PaymentCardGrid from "./_components/PaymentCardGrid";
import { auth } from "@/lib/auth";

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
    </div>
  );
};

export default PaymentPage;
