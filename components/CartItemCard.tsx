"use client";

import FlexImage from "@/components/FlexImage";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { MotionDiv } from "@/components/Motion";
import { containerVariants } from "@/lib/variants";
import React from "react";
import { CartItem } from "@/context/cart-context";

interface CartItemCardProps {
  item: CartItem & {
    quantity: number;
    additionalCharges?: { optionName: string; price: number }[];
  };
  addToCart: (item: CartItem) => void;
  decrementQuantity: (id: string, variants?: Record<string, string[]>) => void;
}

const CartItemCard = ({
  item,
  addToCart,
  decrementQuantity,
}: CartItemCardProps) => {
  const additionalTotal =
    item.additionalCharges?.reduce((sum, c) => sum + c.price, 0) || 0;
  const totalPrice = (item.price + additionalTotal) * item.quantity;

  return (
    <MotionDiv
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      key={item.id}
      className="flex p-3 gap-3 items-start border rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
    >
      <FlexImage
        alt={item.name}
        src={item.images?.[0] ?? "/placeholder-image.png"}
        width={60}
        height={60}
        className="rounded-lg object-cover"
      />

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="font-semibold text-sm md:text-base">{item.name}</div>

          <div className="text-xs text-muted-foreground mt-1">
            Base: ${item.price.toFixed(2)}
          </div>

          {item.additionalCharges?.length > 0 && (
            <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
              {item.additionalCharges.map((charge) => (
                <div key={charge.optionName}>
                  + {charge.optionName}: ${charge.price.toFixed(2)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-2 ">
          <div className="flex gap-3 items-center">
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => decrementQuantity(item.id, item.variants)}
            >
              <Minus />
            </Button>
            <div>{item.quantity}</div>
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => addToCart(item)}
            >
              <Plus />
            </Button>
          </div>
          <div className="font-semibold">${totalPrice.toFixed(2)}</div>
        </div>
      </div>
    </MotionDiv>
  );
};

export default CartItemCard;
