import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { saleSessions, orders } from "@/db/schema";
import { DEFAULT_FETCH_LIMIT } from "@/data/contants";
import { desc, eq, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const storeId = url.searchParams.get("storeId");
    const take = parseInt(
      url.searchParams.get("take") || String(DEFAULT_FETCH_LIMIT)
    );
    const page = parseInt(url.searchParams.get("page") || "0");

    if (!storeId) {
      return NextResponse.json({ error: "Missing storeId" }, { status: 400 });
    }

    // Calculate offset for page-based pagination
    const offset = page * take;

    // Query saleSessions with order count
    const sessions = await db
      .select({
        id: saleSessions.id,
        storeId: saleSessions.storeId,
        accountId: saleSessions.accountId,
        startedAt: saleSessions.startedAt,
        endedAt: saleSessions.endedAt,
        paymentType: saleSessions.paymentType,
        orderCount: sql<number>`COUNT(${orders.id})`.as("orderCount"),
      })
      .from(saleSessions)
      .leftJoin(orders, eq(orders.saleSessionId, saleSessions.id))
      .where(eq(saleSessions.storeId, storeId))
      .groupBy(
        saleSessions.id,
        saleSessions.storeId,
        saleSessions.accountId,
        saleSessions.startedAt,
        saleSessions.endedAt,
        saleSessions.paymentType
      )
      .orderBy(desc(saleSessions.startedAt))
      .limit(take)
      .offset(offset);

    return NextResponse.json(sessions);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch sale sessions" },
      { status: 500 }
    );
  }
}
