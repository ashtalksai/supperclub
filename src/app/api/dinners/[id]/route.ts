import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dinners, restaurants, invites, votes, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getAuthCookie } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthCookie();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dinnerId = params.id;

  // Get dinner
  const [dinner] = await db
    .select()
    .from(dinners)
    .where(eq(dinners.id, dinnerId))
    .limit(1);

  if (!dinner) {
    return NextResponse.json({ error: "Dinner not found" }, { status: 404 });
  }

  // Get host info
  const [host] = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, dinner.hostId))
    .limit(1);

  // Get restaurants
  const dinnerRestaurants = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.dinnerId, dinnerId));

  // Get invites with user info
  const dinnerInvites = await db
    .select({
      id: invites.id,
      email: invites.email,
      status: invites.status,
      userId: invites.userId,
      userName: users.name,
    })
    .from(invites)
    .leftJoin(users, eq(invites.userId, users.id))
    .where(eq(invites.dinnerId, dinnerId));

  // Get votes
  const dinnerVotes = await db
    .select()
    .from(votes)
    .where(eq(votes.dinnerId, dinnerId));

  // Calculate vote counts per restaurant
  const voteCounts: Record<string, number> = {};
  const userVotes: string[] = [];
  for (const vote of dinnerVotes) {
    voteCounts[vote.restaurantId] = (voteCounts[vote.restaurantId] || 0) + 1;
    if (vote.userId === auth.userId) {
      userVotes.push(vote.restaurantId);
    }
  }

  // Add vote info to restaurants
  const restaurantsWithVotes = dinnerRestaurants.map((r) => ({
    ...r,
    voteCount: voteCounts[r.id] || 0,
    hasVoted: userVotes.includes(r.id),
  }));

  // Sort by vote count descending
  restaurantsWithVotes.sort((a, b) => b.voteCount - a.voteCount);

  return NextResponse.json({
    dinner,
    host,
    restaurants: restaurantsWithVotes,
    invites: dinnerInvites,
    isHost: dinner.hostId === auth.userId,
  });
}
