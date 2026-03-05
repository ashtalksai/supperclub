import { db } from "@/db";
import { dinners, users, restaurants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users, Crown, Utensils } from "lucide-react";
import { InviteActions } from "@/components/invite-actions";

export default async function InvitePage({
  params,
}: {
  params: { id: string };
}) {
  const dinnerId = params.id;

  // Get dinner
  const [dinner] = await db
    .select()
    .from(dinners)
    .where(eq(dinners.id, dinnerId))
    .limit(1);

  if (!dinner) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12">
            <div className="text-4xl mb-4">🍽️</div>
            <h2 className="font-heading text-2xl font-semibold text-midnight mb-2">
              Dinner not found
            </h2>
            <p className="text-midnight/60 mb-6">
              This dinner invitation may have expired or doesn&apos;t exist.
            </p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get host
  const [host] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, dinner.hostId))
    .limit(1);

  // Get restaurants for this dinner
  const dinnerRestaurants = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.dinnerId, dinnerId));

  const date = new Date(dinner.date);
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🍽️</span>
            <span className="font-display text-2xl font-bold text-midnight">
              SupperClub
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <p className="text-sm text-midnight/60 mb-2">You&apos;re invited to</p>
            <CardTitle className="font-display text-3xl text-midnight">
              {dinner.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 py-4 border-y border-midnight/10">
              <div className="flex items-center gap-3 text-midnight/80">
                <CalendarDays className="w-5 h-5 text-ember" />
                <span>
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-midnight/80">
                <MapPin className="w-5 h-5 text-ember" />
                <span>{dinner.location}</span>
              </div>
              <div className="flex items-center gap-3 text-midnight/80">
                <Users className="w-5 h-5 text-ember" />
                <span>{dinner.guestCount} guests</span>
              </div>
              <div className="flex items-center gap-3 text-midnight/80">
                <Crown className="w-5 h-5 text-saffron" />
                <span>Hosted by {host?.name || "Someone special"}</span>
              </div>
            </div>

            {dinner.dietaryPrefs && (
              <div className="flex flex-wrap gap-1.5">
                {dinner.dietaryPrefs.split(", ").map((pref) => (
                  <Badge key={pref} variant="outline" className="text-xs">
                    {pref}
                  </Badge>
                ))}
              </div>
            )}

            {dinnerRestaurants.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-heading font-semibold text-midnight flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-ember" />
                  Restaurant Options
                </h3>
                {dinnerRestaurants.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="py-2 px-3 rounded-lg bg-midnight/5 text-sm"
                  >
                    <span className="font-medium text-midnight">{r.name}</span>
                    <span className="text-midnight/40"> · {r.cuisine}</span>
                  </div>
                ))}
                {dinnerRestaurants.length > 3 && (
                  <p className="text-xs text-midnight/40">
                    +{dinnerRestaurants.length - 3} more options
                  </p>
                )}
              </div>
            )}

            {user ? (
              <InviteActions dinnerId={dinnerId} />
            ) : (
              <div className="space-y-3 pt-4">
                <p className="text-center text-sm text-midnight/60">
                  Sign in to RSVP and vote on restaurants
                </p>
                <div className="flex gap-3">
                  <Link href={`/login?from=/invite/${dinnerId}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href={`/register?from=/invite/${dinnerId}`} className="flex-1">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
