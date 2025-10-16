"use client";

import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FlexImage from "@/components/FlexImage";
import { MotionDiv } from "@/components/Motion";
import { storeCanvasStageVariants } from "@/lib/variants";
import StoreFront from "./StoreFront";
import StoreProductCatalog from "./StoreProductCatalog";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function StoreCanvasForm({
  store,
  products,
  categories,
  owner,
}: any) {
  const [step, setStep] = useState(0);
  const sections = ["Store Info", "Items", "Additional Fields", "Checkout"];

  const next = () => setStep((s) => Math.min(s + 1, sections.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="p-2 h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <MotionDiv
            key="info"
            variants={storeCanvasStageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="h-full w-full "
          >
            <StoreFront store={store} user={owner} next={next} />
          </MotionDiv>
        )}

        {step === 1 && (
          <MotionDiv
            key="items"
            variants={storeCanvasStageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-6xl self-center pt-3 "
          >
            <StoreProductCatalog
              categories={categories}
              products={products}
              store={store}
            />
          </MotionDiv>
        )}

        {step === 2 && (
          <MotionDiv
            key="fields"
            variants={storeCanvasStageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Additional Details</h2>
            <p className="text-muted-foreground">
              Enter any extra details or instructions.
            </p>
            <textarea
              className="w-full border rounded-md p-3 text-sm"
              rows={4}
              placeholder="Type here..."
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={back}>
                Back
              </Button>
              <Button onClick={next}>Proceed to Checkout</Button>
            </div>
          </MotionDiv>
        )}

        {step === 3 && (
          <MotionDiv
            key="checkout"
            variants={storeCanvasStageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Checkout</h2>
            <p className="text-muted-foreground">
              Review and confirm your order.
            </p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={back}>
                Back
              </Button>
              <Button>Place Order</Button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="flex gap-1 fixed bottom-5 self-center  ">
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={next}
          disabled={step >= sections.length - 1}
        >
          <ChevronUp />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={back}
          disabled={step === 0}
        >
          <ChevronDown />
        </Button>
      </div>
    </div>
  );
}
