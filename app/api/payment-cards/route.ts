import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // adjust import path
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { paymentCards } from "@/db/schema";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cards = await db.query.paymentCards.findMany({
      where: eq(paymentCards.userId, session.user.id),
    });

    return NextResponse.json(cards);
  } catch (err) {
    console.error("Error fetching payment cards:", err);
    return NextResponse.json(
      { error: "Failed to fetch payment cards" },
      { status: 500 }
    );
  }
}
