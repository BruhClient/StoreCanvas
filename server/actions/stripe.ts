"use server";

import { pricingPlans } from "@/data/pricingPlans";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function createCheckout({ priceId }: { priceId: string }) {
  // Create Checkout Sessions from body params.

  const userSession = await auth();
  if (!userSession) return null;

  const planType = pricingPlans.find((plan) => plan.priceId === priceId)!.name;
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of
        // the product you want to sell
        price: priceId,

        quantity: 1,
      },
    ],
    customer_email: userSession.user.email as string,

    mode: "subscription",
    return_url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      plan: planType,
    },
  });

  return session.client_secret;
}
