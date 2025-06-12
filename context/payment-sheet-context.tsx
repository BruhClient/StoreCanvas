"use client";

import { createContext, useContext, useState } from "react";

type PaymentSheetContextType = {
  isOpen: boolean;
  open: (priceId: string) => void;
  close: () => void;
  priceId: string | null;
};

const PaymentSheetContext = createContext<PaymentSheetContextType | undefined>(
  undefined
);

export const PaymentSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceId, setPriceId] = useState<string | null>(null);

  const open = (newPriceId: string) => {
    setPriceId(newPriceId);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setPriceId(null);
  };

  return (
    <PaymentSheetContext.Provider value={{ isOpen, open, close, priceId }}>
      {children}
    </PaymentSheetContext.Provider>
  );
};

export const usePaymentSheet = () => {
  const context = useContext(PaymentSheetContext);
  if (!context)
    throw new Error("usePaymentSheet must be used within PaymentSheetProvider");
  return context;
};
