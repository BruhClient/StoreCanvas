import { env } from "@/data/env/server";
import { stripe } from "@/lib/stripe";
import { sendPaymentConfirmationEmail } from "@/server/actions/auth/mail";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { format } from "date-fns";
import { db } from "@/db";
import { paymentCards } from "@/db/schema";

export async function POST(req: NextRequest) {
  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

  const signature = req.headers.get("stripe-signature");

  if (!signature || !endpointSecret) {
    return NextResponse.json(
      { error: "Missing Stripe signature or secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Get the raw bytes
    const buf = Buffer.from(await req.arrayBuffer());
    event = stripe.webhooks.constructEvent(buf, signature, endpointSecret);
  } catch (error) {
    console.log("Webhook signature verification failed:", error);
    return new NextResponse("invalid signature", { status: 400 });
  }

  const eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        console.log("Checkout session completed", event.data.object);
        break;
      }

      case "invoice.paid": {
        const {
          customer_email,
          hosted_invoice_url,
          amount_paid,
          id,
          customer_name,
          metadata,
        } = event.data.object as Stripe.Invoice;

        const planType = metadata?.plan;

        await sendPaymentConfirmationEmail(
          customer_email!,
          customer_name ?? "Customer",
          id!,
          amount_paid / 100,
          format(Date.now(), "dd MMM yyyy"),
          hosted_invoice_url!,
          planType!
        );
        break;
      }

      case "payment_intent.succeeded": {
        console.log("PaymentIntent succeeded", event.data.object);
        break;
      }

      case "account.updated": {
        const account = event.data.object;
        if (account.charges_enabled) {
          // Save account.id to your DB for this user
          console.log("loading....");
          await db.insert(paymentCards).values({
            id: event.data.object.id,
            userId: event.data.object.metadata!.user,
            name: event.data.object.metadata!.cardName,
          });
        }

        break;
      }

      default: {
        console.log("Unhandled event type:", eventType);
      }
    }

    return new NextResponse("Success");
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
}
