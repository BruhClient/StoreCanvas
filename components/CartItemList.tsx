"use client";

import { AnimatePresence } from "motion/react";
import React from "react";
import { CartItem } from "@/context/cart-context";
import CartItemCard from "./CartItemCard";

interface CartItemsListProps {
  cartItems: (CartItem & {
    quantity: number;
    additionalCharges?: { optionName: string; price: number }[];
  })[];
  addToCart: (item: CartItem) => void;
  decrementQuantity: (id: string, variants?: Record<string, string[]>) => void;
}

const CartItemsList = ({
  cartItems,
  addToCart,
  decrementQuantity,
}: CartItemsListProps) => {
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto w-full">
      <AnimatePresence mode="sync">
        {cartItems.map((item) => (
          <CartItemCard
            key={item.id + JSON.stringify(item.variants)}
            item={item}
            addToCart={addToCart}
            decrementQuantity={decrementQuantity}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CartItemsList;
