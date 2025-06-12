import { PricingPlanName, pricingPlans } from "@/data/pricingPlans";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import useSessionUser from "@/hooks/use-session-user";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePaymentSheet } from "@/context/payment-sheet-context";

const CustomCheck = () => (
  <div className="bg-green-400 p-1 rounded-full ">
    <Check className="text-black" size={15} />
  </div>
);
const CustomX = () => (
  <div className="bg-red-400 p-1 rounded-full ">
    <X size={15} className="text-black" />
  </div>
);

const PricingCard = ({ type }: { type: PricingPlanName }) => {
  //@ts-ignore
  const { name, price, discount, description, prioritySupport, priceId } =
    pricingPlans.find((plan) => plan.name === type);
  const user = useSessionUser();
  const router = useRouter();
  const { open } = usePaymentSheet();
  return (
    <Card className="max-w-[500px] w-full">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          {discount && (
            <span className="line-through text-muted-foreground text-start pr-2">
              ${discount}
            </span>
          )}

          <span className="text-4xl font-serif font-bold">${price}</span>
          <span className="pl-1 text-sm text-muted-foreground">/month</span>
        </div>
        <Button
          className="w-full"
          variant={"outline"}
          disabled={user?.plan === type || !user}
          onClick={() => {
            if (!user) {
              router.push("/signin");
            } else {
              open(priceId);
            }
          }}
        >
          {user?.plan === type || !user ? "Your Current Plan" : "Get Started"}
        </Button>
        <div className="flex flex-col gap-2 py-2 px-1">
          <div className="flex items-center gap-3 font-serif">
            {prioritySupport ? <CustomCheck /> : <CustomX />} 24/7 support
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
