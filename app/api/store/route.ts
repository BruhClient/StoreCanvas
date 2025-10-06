import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // adjust path
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { stores } from "@/db/schema";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // grab ?limit=10 from query params
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const userStores = await db.query.stores.findMany({
      where: eq(stores.ownerId, session.user.id),
      limit,
    });

    return NextResponse.json(userStores);
  } catch (err) {
    console.error("Error fetching stores:", err);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}
