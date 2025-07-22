import { redirect } from "next/navigation";

import { stripe } from "../../lib/stripeClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Return({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const {
    status,
    //@ts-ignore
    customer_details: { email: customerEmail },
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    return (
      <section
        id="success"
        className="w-full flex h-screen justify-center items-center flex-col text-center gap-4 px-2"
      >
        <div className="text-4xl font-bold">Your Order was Successful !🎉</div>
        <p className="text-lg max-w-[700px] font-serif">
          A confirmation email will be sent to{" "}
          <span className="font-semibold">{customerEmail}</span>. If you have
          any questions, please email{" "}
          <a href="mailto:orders@example.com" className="font-semibold">
            orders@example.com
          </a>{" "}
          for support.
        </p>
        <Button asChild>
          <Link href={"/dashboard"}>Back to dashboard</Link>
        </Button>
      </section>
    );
  }
}
