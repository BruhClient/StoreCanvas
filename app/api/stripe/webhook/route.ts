import { env } from "@/data/env/server";
import { stripe } from "@/lib/stripe";
import { sendPaymentConfirmationEmail } from "@/server/actions/auth/mail";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { format } from "date-fns";
async function getRawBody(
  readable: ReadableStream<Uint8Array>
): Promise<Buffer> {
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

  const signature = (await headers()).get("stripe-signature") as string;

  if (!signature || !endpointSecret) {
    return NextResponse.json(
      { error: "Missing Stripe signature or secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req.body!);

    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (error) {
    console.log(error);
    return new NextResponse("invalid signature", { status: 400 });
  }

  const eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
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

        const planType = metadata!.plan;

        await sendPaymentConfirmationEmail(
          customer_email!,
          customer_name ?? "Customer",
          id!,
          amount_paid / 100,
          format(Date.now(), "dd MMM yyyy"),
          hosted_invoice_url!,
          planType!
        );
      }
    }
    return new NextResponse("Success");
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
}
