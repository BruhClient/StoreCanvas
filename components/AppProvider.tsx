"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

import { SessionProvider } from "next-auth/react";
import { PaymentSheetProvider } from "@/context/payment-sheet-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <PaymentSheetProvider>{children}</PaymentSheetProvider>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppProvider;
