import AddPaymentOptionDialog from "@/components/AddPaymentOptionDialog";
import { getPaymentCards } from "@/server/db/paymentCards";
import React from "react";
import PaymentCardGrid from "./_components/PaymentCardGrid";

const PaymentPage = async () => {
  const paymentCards = await getPaymentCards();
  console.log(paymentCards);

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
