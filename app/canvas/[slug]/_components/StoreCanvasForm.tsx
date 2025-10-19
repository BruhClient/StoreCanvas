"use client";

import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/Motion";
import { storeCanvasStageVariants } from "@/lib/variants";
import StoreFront from "./StoreFront";
import StoreProductCatalog from "./StoreProductCatalog";
import StoreAdditionalFields from "./StoreAdditionalFields";
import { ChevronDown, ChevronUp } from "lucide-react";
import { showErrorToast } from "@/lib/toast";
import CartButton from "./CartButton";

export default function StoreCanvasForm({
  store,
  products,
  categories,
  owner,
}: any) {
  const [step, setStep] = useState(0);
  const [additionalFieldValues, setAdditionalFieldValues] = useState<
    Record<string, any>
  >({});

  const hasAdditionalFields =
    Array.isArray(store?.additionalFields) && store.additionalFields.length > 0;

  // Dynamically determine steps
  const sections = hasAdditionalFields
    ? ["Store Info", "Items", "Additional Fields", "Review Order", "Checkout"]
    : ["Store Info", "Items", "Review Order", "Checkout"];

  // Validation for additional fields
  const allRequiredFilled = store?.additionalFields?.every((field: any) => {
    if (!field.required) return true;
    const val = additionalFieldValues[field.prompt];
    if (field.type === "options") {
      return Array.isArray(val) && val.length > 0;
    }
    return !!val && val !== "";
  });

  const next = () => {
    // prevent moving to checkout if required fields not filled
    if (hasAdditionalFields && step === 2 && !allRequiredFilled) {
      showErrorToast("Please fill in all required fields before checkout.");
      return;
    }
    setStep((s) => Math.min(s + 1, sections.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleAdditionalFieldsSubmit = (values: Record<string, any>) => {
    setAdditionalFieldValues(values);
    next();
  };

  return (
    <div className="p-2 h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {/* --- STEP 0: Store Info --- */}
        {step === 0 && (
          <MotionDiv
            key="info"
            variants={storeCanvasStageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="h-full w-full"
          >
            <StoreFront store={store} user={owner} next={next} />
          </MotionDiv>
        )}

        {/* --- STEP 1: Products --- */}
        {step === 1 && (
          <MotionDiv
            key="items"
            variants={storeCanvasStageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-6xl self-center pt-3"
          >
            <StoreProductCatalog
              categories={categories}
              products={products}
              store={store}
            />
          </MotionDiv>
        )}

        {/* --- STEP 2: Additional Fields (if exist) --- */}
        {hasAdditionalFields && step === 2 && (
          <MotionDiv
            key="fields"
            variants={storeCanvasStageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-6xl self-center pt-3"
          >
            <StoreAdditionalFields
              store={store}
              onSubmit={handleAdditionalFieldsSubmit}
            />
          </MotionDiv>
        )}

        {/* --- STEP 3 or 2: Review Order --- */}
        {((!hasAdditionalFields && step === 2) ||
          (hasAdditionalFields && step === 3)) && (
          <MotionDiv
            key="review"
            variants={storeCanvasStageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-6xl self-center pt-3"
          >
            <h2 className="text-2xl font-semibold">Review Your Order</h2>
            <p className="text-muted-foreground">
              Check your selected items and additional fields before checkout.
            </p>

            <div className="mt-4">
              <CartButton />
            </div>

            {hasAdditionalFields && (
              <div className="mt-4 p-2 border rounded">
                <h3 className="font-semibold">Additional Fields</h3>
                <pre className="text-xs text-muted-foreground">
                  {JSON.stringify(additionalFieldValues, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={back}>
                Back
              </Button>
              <Button onClick={next}>Proceed to Checkout</Button>
            </div>
          </MotionDiv>
        )}

        {/* --- FINAL STEP: Checkout --- */}
        {((!hasAdditionalFields && step === 3) ||
          (hasAdditionalFields && step === 4)) && (
          <MotionDiv
            key="checkout"
            variants={storeCanvasStageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-6xl self-center pt-3 "
          >
            <h2 className="text-2xl font-semibold">Checkout</h2>
            <p className="text-muted-foreground">
              Review and confirm your order.
            </p>

            <div className="flex justify-between">
              <Button variant="outline" onClick={back}>
                Back
              </Button>
              <Button
                onClick={() => {
                  if (hasAdditionalFields && !allRequiredFilled) {
                    showErrorToast(
                      "Please fill in all required fields before placing order."
                    );
                    return;
                  }
                  // Handle order submission here
                }}
              >
                Place Order
              </Button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* --- Floating Step Controls --- */}
      <div className="flex gap-1 fixed bottom-5 self-center">
        <Button
          size="icon"
          variant="outline"
          onClick={next}
          disabled={!store?.isOpen || step >= sections.length - 1}
        >
          <ChevronUp />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={back}
          disabled={step === 0}
        >
          <ChevronDown />
        </Button>
      </div>
    </div>
  );
}
