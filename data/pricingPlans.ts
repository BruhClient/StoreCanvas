export const pricingPlans = [
  {
    name: "Free",
    description: "For starters",
    price: 0,
    discount: null,
    prioritySupport: false,
    priceId: null,
  },
  {
    name: "Pro",
    description: "For Pros",
    price: 10,
    discount: 15,
    prioritySupport: true,
    priceId: "price_1RZBUb4dBCYaxxsApH4C3aCa",
  },
  {
    name: "Premium",
    description: "For Premium members",
    price: 25,
    discount: 30,
    prioritySupport: true,
    priceId: "price_1RZBUp4dBCYaxxsAqaScEws7",
  },
];

export type PricingPlanName = (typeof pricingPlans)[number]["name"];
