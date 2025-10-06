import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { saleSessions } from "@/db/schema";
import { DEFAULT_FETCH_LIMIT } from "@/data/contants";
import { desc, eq } from "drizzle-orm";

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

    // Fetch sale sessions from Drizzle
    const sessions = await db
      .select()
      .from(saleSessions)
      .where(eq(saleSessions.storeId, storeId))
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
