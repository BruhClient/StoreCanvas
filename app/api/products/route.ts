// app/api/products/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import { and, eq, like, lt, inArray, desc } from "drizzle-orm";
import { products, productToCategories } from "@/db/schema";
import { db } from "@/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const take = parseInt(searchParams.get("take") ?? "20", 10);
    const cursor = searchParams.get("cursor");
    const search = searchParams.get("search");
    const categoryId = searchParams.get("category"); // this should be the categoryId

    const conditions = [eq(products.userId, session.user.id)];

    if (cursor) {
      conditions.push(lt(products.createdAt, new Date(cursor)));
    }

    if (search) {
      conditions.push(like(products.name, `%${search}%`));
    }

    if (categoryId) {
      // filter products by category via junction table
      const productIds = await db
        .select({ productId: productToCategories.productId })
        .from(productToCategories)
        .where(eq(productToCategories.categoryId, categoryId));

      if (productIds.length === 0) {
        return NextResponse.json({ data: [], nextCursor: null });
      }

      conditions.push(
        inArray(
          products.id,
          productIds.map((p) => p.productId)
        )
      );
    }

    const productResults = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(desc(products.createdAt))
      .limit(take + 1);

    let nextCursor: string | null = null;
    if (productResults.length > take) {
      const nextItem = productResults.pop();
      if (nextItem) {
        nextCursor = nextItem.createdAt.toISOString();
      }
    }

    return NextResponse.json({
      data: productResults,
      nextCursor,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
