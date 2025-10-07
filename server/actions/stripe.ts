"use server";

import { pricingPlans } from "@/data/pricingPlans";
import { auth } from "@/lib/auth";
import { toSlug } from "@/lib/slug";
import { stripe } from "@/lib/stripe";
import { deletePaymentCard } from "../db/paymentCards";

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

export async function createConnectAccount(
  storeName: string,
  cardName: string
) {
  try {
    const session = await auth();

    if (!session) {
      throw Error("Unauthorized");
    }
    // 1. Create a new Express connected account
    const account = await stripe.accounts.create({
      type: "express",
      metadata: {
        user: session.user.id,
        cardName: cardName,
      },
    });

    // 2. Create an onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "http://localhost:3000/reauth", // change for production
      return_url: `http://localhost:3000/store/${toSlug(storeName)}/payments`,
      type: "account_onboarding",
    });

    // TODO: Save account.id in your DB under the logged-in user here

    return {
      success: true,
      stripeConnectId: account.id,
      onboardingUrl: accountLink.url,
    };
  } catch (error) {
    console.error("Error creating connect account:", error);
    return { success: false, error: "Unable to create Stripe account" };
  }
}

export async function deleteConnectAccount(accountId: string) {
  try {
    const deleted = await stripe.accounts.del(accountId);

    const data = await deletePaymentCard(accountId);

    if (!data) {
      throw Error("Failed to delete from db");
    }

    return { success: true, deleted };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, error };
  }
}
