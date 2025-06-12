"use client";

import React from "react";

import { SessionProvider } from "next-auth/react";
import { PaymentSheetProvider } from "@/context/payment-sheet-context";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <PaymentSheetProvider>{children}</PaymentSheetProvider>
    </SessionProvider>
  );
};

export default AppProvider;
