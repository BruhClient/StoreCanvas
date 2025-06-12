import React from "react";
import PricingCard from "./PricingCard";

const PricingTable = () => {
  return (
    <div className="flex w-full gap-2 flex-wrap">
      <PricingCard type="Free" />
      <PricingCard type="Pro" />
      <PricingCard type="Premium" />
    </div>
  );
};

export default PricingTable;
