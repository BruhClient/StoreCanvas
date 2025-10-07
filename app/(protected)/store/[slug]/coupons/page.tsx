"use client";
import React, { useEffect } from "react";

const StoreCouponPage = () => {
  useEffect(() => {
    console.log("Component Mounted");
    return () => {
      console.log("Component Unmounted");
    };
  });
  return <div>StoreCouponPage</div>;
};

export default StoreCouponPage;
