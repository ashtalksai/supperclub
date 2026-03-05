import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { invites } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthCookie } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthCookie();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inviteId = params.id;
  const { status } = await request.json();

  if (!status || !["accepted", "declined"].includes(status)) {
    return NextResponse.json(
      { error: "Status must be 'accepted' or 'declined'" },
      { status: 400 }
    );
  }

  // Find invite
  const [invite] = await db
    .select()
    .from(invites)
    .where(eq(invites.id, inviteId))
    .limit(1);

  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  // Update invite
  const [updated] = await db
    .update(invites)
    .set({
      status,
      userId: auth.userId,
    })
    .where(eq(invites.id, inviteId))
    .returning();

  return NextResponse.json({ invite: updated });
}
