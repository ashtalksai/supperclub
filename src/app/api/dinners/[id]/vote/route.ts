import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dinners, votes, restaurants } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuthCookie } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthCookie();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dinnerId = params.id;
  const { restaurantId } = await request.json();

  if (!restaurantId) {
    return NextResponse.json(
      { error: "Restaurant ID is required" },
      { status: 400 }
    );
  }

  // Verify dinner exists
  const [dinner] = await db
    .select()
    .from(dinners)
    .where(eq(dinners.id, dinnerId))
    .limit(1);

  if (!dinner) {
    return NextResponse.json({ error: "Dinner not found" }, { status: 404 });
  }

  // Verify restaurant belongs to this dinner
  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(
      and(eq(restaurants.id, restaurantId), eq(restaurants.dinnerId, dinnerId))
    )
    .limit(1);

  if (!restaurant) {
    return NextResponse.json(
      { error: "Restaurant not found for this dinner" },
      { status: 404 }
    );
  }

  // Check if already voted for this restaurant
  const existing = await db
    .select()
    .from(votes)
    .where(
      and(
        eq(votes.dinnerId, dinnerId),
        eq(votes.restaurantId, restaurantId),
        eq(votes.userId, auth.userId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Remove vote (toggle)
    await db
      .delete(votes)
      .where(eq(votes.id, existing[0].id));
    return NextResponse.json({ action: "removed" });
  }

  // Add vote
  const [vote] = await db
    .insert(votes)
    .values({
      dinnerId,
      restaurantId,
      userId: auth.userId,
    })
    .returning();

  return NextResponse.json({ vote, action: "added" }, { status: 201 });
}
