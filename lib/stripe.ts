import { env } from "@/data/env/server";
import Stripe from "stripe";

console.log(env.STRIPE_SECRET_KEY);
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});
