import { paymentCards } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React from "react";
import PaymentCard from "./PaymentCard";

const PaymentCardGrid = ({
  cards,
}: {
  cards: InferSelectModel<typeof paymentCards>[];
}) => {
  return (
    <div className="flex gap-2 payment-feed flex-wrap">
      {cards.length === 0 && (
        <div className="w-full text-muted-foreground">
          You have no payment options
        </div>
      )}

      {cards.map((card) => (
        <PaymentCard
          cardName={card.name}
          stripeAccountId={card.id}
          createdAt={card.createdAt}
          key={card.id}
        />
      ))}
    </div>
  );
};

export default PaymentCardGrid;
