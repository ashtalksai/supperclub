import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dinners, restaurants, invites } from "@/db/schema";
import { eq, desc, and, or, gte, lt } from "drizzle-orm";
import { getAuthCookie } from "@/lib/auth";
import { generateMockRestaurants } from "@/lib/mock-restaurants";

export async function GET() {
  const auth = await getAuthCookie();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get dinners where user is host or invited
  const userDinners = await db
    .select()
    .from(dinners)
    .where(eq(dinners.hostId, auth.userId))
    .orderBy(desc(dinners.date));

  // Also get dinners where user is invited
  const invitedDinners = await db
    .select({ dinner: dinners })
    .from(invites)
    .innerJoin(dinners, eq(invites.dinnerId, dinners.id))
    .where(eq(invites.userId, auth.userId));

  // Merge and deduplicate
  const allDinners = [...userDinners];
  for (const { dinner } of invitedDinners) {
    if (!allDinners.find((d) => d.id === dinner.id)) {
      allDinners.push(dinner);
    }
  }

  // Sort by date descending
  allDinners.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const now = new Date();
  const upcoming = allDinners.filter((d) => new Date(d.date) >= now);
  const past = allDinners.filter((d) => new Date(d.date) < now);

  return NextResponse.json({ upcoming, past });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthCookie();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, date, location, dietaryPrefs, guestCount } =
      await request.json();

    if (!title || !date || !location) {
      return NextResponse.json(
        { error: "Title, date, and location are required" },
        { status: 400 }
      );
    }

    // Create dinner
    const [dinner] = await db
      .insert(dinners)
      .values({
        hostId: auth.userId,
        title,
        date: new Date(date),
        location,
        dietaryPrefs: dietaryPrefs || null,
        guestCount: guestCount || 4,
      })
      .returning();

    // Generate mock restaurant suggestions
    const mockRestaurants = generateMockRestaurants(location, dietaryPrefs);
    for (const r of mockRestaurants) {
      await db.insert(restaurants).values({
        dinnerId: dinner.id,
        name: r.name,
        cuisine: r.cuisine,
        priceRange: r.priceRange,
        rating: r.rating,
        location: location,
        description: r.description,
      });
    }

    return NextResponse.json({ dinner }, { status: 201 });
  } catch (error) {
    console.error("Create dinner error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
