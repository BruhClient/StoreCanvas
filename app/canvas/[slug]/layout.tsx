import { CartProvider } from "@/context/cart-context";
import React from "react";

const CanvasLayout = ({ children }: { children: React.ReactNode }) => {
  return <CartProvider>{children}</CartProvider>;
};

export default CanvasLayout;
