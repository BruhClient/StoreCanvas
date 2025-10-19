"use client";

import DialogButton from "@/components/DialogButton";
import { MotionDiv } from "@/components/Motion";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/context/cart-context";
import { containerVariants } from "@/lib/variants";
import { Minus } from "lucide-react";
import { AnimatePresence } from "motion/react";
import React, { Dispatch, SetStateAction, useState } from "react";

interface DeleteVariantDialogButtonProps {
  productId: string;
  productName: string;
}

const DeleteVariantDialogButton = ({
  productId,
  productName,
}: DeleteVariantDialogButtonProps) => {
  const { getCartInfo, decrementQuantity } = useCart();
  const [dialogOpen, setDialogOpen] = useState(false);
  // Get all variants of this product in the cart
  const variantsInCart: (CartItem & { quantity: number })[] =
    getCartInfo().filter((item) => item.id === productId);

  return (
    <DialogButton
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      title={`Adjust ${productName} quantities`}
      description="Select the variant you want to decrement"
      buttonContent={
        <Button
          size="icon"
          variant="outline"
          onClick={() => setDialogOpen(true)}
        >
          <Minus />
        </Button>
      }
    >
      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
        <AnimatePresence mode="sync">
          {variantsInCart.map((item, idx) => {
            // Show only variant options, each on its own line
            console.log(item);
            const options = item.variants
              ? Object.values(item.variants).flat()
              : ["Default"];

            const itemKey = `${item.id}-${idx}`;

            return (
              <MotionDiv
                key={itemKey}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full w-full border py-3 rounded px-3 "
              >
                {Object.keys(item.variants).map((key) => {
                  return (
                    <div key={key} className="text-xs">
                      <div>{key}</div>
                      <div className="text-muted-foreground">
                        {item.variants[key].join(",")}
                      </div>
                    </div>
                  );
                })}

                <div className="flex gap-2 items-center justify-between">
                  <div>Qty: {item.quantity}</div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      decrementQuantity(item.id, item.variants); // decrement by 1
                      // close dialog if last item after decrement
                      if (item.quantity === 1 && variantsInCart.length === 1) {
                        setDialogOpen(false);
                      }
                    }}
                  >
                    <Minus />
                  </Button>
                </div>
              </MotionDiv>
            );
          })}
        </AnimatePresence>
      </div>
    </DialogButton>
  );
};

export default DeleteVariantDialogButton;
