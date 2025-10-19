"use client";

import DialogButton from "@/components/DialogButton";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import React from "react";
import { useCart } from "@/context/cart-context";
import CartItemsList from "@/components/CartItemList";

const CartButton = () => {
  const { getCartInfo, addToCart, decrementQuantity, totalPrice } = useCart();
  const cartItems = getCartInfo();

  return (
    <DialogButton
      buttonContent={
        <Button variant={"outline"} size={"icon"}>
          <ShoppingCart />
        </Button>
      }
      title="Your Cart"
    >
      <div className="p-4 space-y-4">
        {cartItems.length === 0 && (
          <p className="text-sm text-muted-foreground">Your cart is empty.</p>
        )}

        {cartItems.length > 0 && (
          <CartItemsList
            cartItems={cartItems}
            addToCart={addToCart}
            decrementQuantity={decrementQuantity}
          />
        )}

        {cartItems.length > 0 && (
          <div className="flex justify-between items-center mt-4 font-semibold">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        )}
      </div>
    </DialogButton>
  );
};

export default CartButton;
