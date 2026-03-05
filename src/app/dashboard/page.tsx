"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Users,
  Plus,
  Utensils,
  ChevronRight,
} from "lucide-react";

interface Dinner {
  id: string;
  title: string;
  date: string;
  location: string;
  guestCount: number;
  status: string;
}

const statusColors: Record<string, string> = {
  planning: "warning",
  confirmed: "success",
  completed: "secondary",
  cancelled: "destructive",
};

function DinnerCard({ dinner }: { dinner: Dinner }) {
  const date = new Date(dinner.date);
  const isUpcoming = date >= new Date();

  return (
    <Link href={`/dashboard/dinner/${dinner.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-heading font-semibold text-lg text-midnight truncate">
                  {dinner.title}
                </h3>
                <Badge variant={statusColors[dinner.status] as any}>
                  {dinner.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-midnight/60">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" />
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {dinner.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {dinner.guestCount} guests
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-midnight/20 group-hover:text-ember transition-colors flex-shrink-0 mt-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const [upcoming, setUpcoming] = useState<Dinner[]>([]);
  const [past, setPast] = useState<Dinner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dinners")
      .then((res) => res.json())
      .then((data) => {
        setUpcoming(data.upcoming || []);
        setPast(data.past || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-midnight/40">Loading your dinners...</div>
      </div>
    );
  }

  const isEmpty = upcoming.length === 0 && past.length === 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-midnight">
            Your Dinners
          </h1>
          <p className="text-midnight/60 mt-1">
            Plan, invite, and vote on your next dinner.
          </p>
        </div>
        <Link href="/dashboard/new" className="hidden sm:block">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Dinner
          </Button>
        </Link>
      </div>

      {isEmpty ? (
        /* Empty State */
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-ember/10 flex items-center justify-center mb-6">
              <Utensils className="w-10 h-10 text-ember" />
            </div>
            <h2 className="font-heading text-2xl font-semibold text-midnight mb-2">
              No dinners yet
            </h2>
            <p className="text-midnight/60 mb-6 text-center max-w-md">
              Time to get the crew together! Create your first dinner and let
              SupperClub handle the rest.
            </p>
            <Link href="/dashboard/new">
              <Button size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Plan Your First Dinner
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section>
              <h2 className="font-heading text-xl font-semibold text-midnight mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-ember" />
                Upcoming
              </h2>
              <div className="space-y-3">
                {upcoming.map((dinner) => (
                  <DinnerCard key={dinner.id} dinner={dinner} />
                ))}
              </div>
            </section>
          )}

          {/* Past */}
          {past.length > 0 && (
            <section>
              <h2 className="font-heading text-xl font-semibold text-midnight/60 mb-4">
                Past Dinners
              </h2>
              <div className="space-y-3 opacity-75">
                {past.map((dinner) => (
                  <DinnerCard key={dinner.id} dinner={dinner} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
