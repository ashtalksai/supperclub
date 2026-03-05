import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dinners, invites, users } from "@/db/schema";
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

  // Verify dinner exists and user is host
  const [dinner] = await db
    .select()
    .from(dinners)
    .where(and(eq(dinners.id, dinnerId), eq(dinners.hostId, auth.userId)))
    .limit(1);

  if (!dinner) {
    return NextResponse.json(
      { error: "Dinner not found or you are not the host" },
      { status: 404 }
    );
  }

  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Check if already invited
  const existing = await db
    .select()
    .from(invites)
    .where(and(eq(invites.dinnerId, dinnerId), eq(invites.email, email.toLowerCase())))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "This person has already been invited" },
      { status: 409 }
    );
  }

  // Check if the invited email belongs to an existing user
  const [invitedUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  const [invite] = await db
    .insert(invites)
    .values({
      dinnerId,
      email: email.toLowerCase(),
      userId: invitedUser?.id || null,
    })
    .returning();

  return NextResponse.json({ invite }, { status: 201 });
}
