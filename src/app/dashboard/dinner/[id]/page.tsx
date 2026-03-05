"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Copy,
  Check,
  ThumbsUp,
  Star,
  DollarSign,
  Send,
  Crown,
  Clock,
  UserCheck,
  UserX,
} from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: number;
  rating: string;
  description: string;
  voteCount: number;
  hasVoted: boolean;
}

interface Invite {
  id: string;
  email: string;
  status: string;
  userId: string | null;
  userName: string | null;
}

interface DinnerDetail {
  dinner: {
    id: string;
    title: string;
    date: string;
    location: string;
    dietaryPrefs: string;
    guestCount: number;
    status: string;
    hostId: string;
  };
  host: { id: string; name: string; email: string };
  restaurants: Restaurant[];
  invites: Invite[];
  isHost: boolean;
}

const statusColors: Record<string, string> = {
  planning: "warning",
  confirmed: "success",
  completed: "secondary",
  cancelled: "destructive",
};

export default function DinnerDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [data, setData] = useState<DinnerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);

  const fetchDinner = useCallback(async () => {
    const res = await fetch(`/api/dinners/${params.id}`);
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    fetchDinner();
  }, [fetchDinner]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail) return;

    const res = await fetch(`/api/dinners/${params.id}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
    });

    const json = await res.json();
    if (res.ok) {
      toast({ title: "Invite sent!", description: `Invited ${inviteEmail}` });
      setInviteEmail("");
      fetchDinner();
    } else {
      toast({
        title: "Error",
        description: json.error,
        variant: "destructive",
      });
    }
  }

  async function handleVote(restaurantId: string) {
    setVotingId(restaurantId);
    const res = await fetch(`/api/dinners/${params.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId }),
    });

    if (res.ok) {
      fetchDinner();
    }
    setVotingId(null);
  }

  function copyInviteLink() {
    const url = `${window.location.origin}/invite/${params.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: "Link copied!", description: "Share this with your friends." });
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-midnight/40">Loading dinner details...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-heading font-semibold text-midnight mb-4">
          Dinner not found
        </h2>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const { dinner, host, restaurants, invites, isHost } = data;
  const date = new Date(dinner.date);
  const maxVotes = Math.max(...restaurants.map((r) => r.voteCount), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-midnight/60 hover:text-midnight"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dinners
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-3xl font-bold text-midnight">
            {dinner.title}
          </h1>
          <Badge variant={statusColors[dinner.status] as any}>
            {dinner.status}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-midnight/60">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
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
          <div className="flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-saffron" />
            Hosted by {host.name}
          </div>
        </div>
        {dinner.dietaryPrefs && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {dinner.dietaryPrefs.split(", ").map((pref) => (
              <Badge key={pref} variant="outline" className="text-xs">
                {pref}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Invite Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-ember" />
            Invite Friends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 flex-shrink-0"
              onClick={copyInviteLink}
            >
              {copied ? (
                <Check className="w-4 h-4 text-sage" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              Copy Invite Link
            </Button>
          </div>

          {isHost && (
            <form onSubmit={handleInvite} className="flex gap-2">
              <Input
                type="email"
                placeholder="friend@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" className="flex-shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          )}

          {invites.length > 0 && (
            <div className="space-y-2">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-midnight/5"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-ember/10 flex items-center justify-center text-xs font-medium text-ember">
                      {(invite.userName || invite.email)[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-midnight">
                      {invite.userName || invite.email}
                    </span>
                  </div>
                  <Badge
                    variant={
                      invite.status === "accepted"
                        ? "success"
                        : invite.status === "declined"
                        ? "destructive"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {invite.status === "accepted" && (
                      <UserCheck className="w-3 h-3 mr-1" />
                    )}
                    {invite.status === "declined" && (
                      <UserX className="w-3 h-3 mr-1" />
                    )}
                    {invite.status === "pending" && (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {invite.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Restaurant Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-saffron" />
            Restaurant Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {restaurants.map((restaurant) => {
            const isWinning =
              restaurant.voteCount > 0 && restaurant.voteCount === maxVotes;

            return (
              <div
                key={restaurant.id}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  isWinning
                    ? "border-sage bg-sage/5"
                    : "border-transparent bg-midnight/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-semibold text-midnight">
                        {restaurant.name}
                      </h3>
                      {isWinning && (
                        <Badge variant="success" className="text-xs">
                          🏆 Leading
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-midnight/60 mb-2">
                      <span className="font-medium text-midnight/80">
                        {restaurant.cuisine}
                      </span>
                      <span className="flex items-center">
                        {Array.from({ length: restaurant.priceRange }).map(
                          (_, i) => (
                            <DollarSign
                              key={i}
                              className="w-3 h-3 text-saffron"
                            />
                          )
                        )}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-saffron text-saffron" />
                        {restaurant.rating}
                      </span>
                    </div>
                    <p className="text-sm text-midnight/50">
                      {restaurant.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Button
                      variant={restaurant.hasVoted ? "default" : "outline"}
                      size="sm"
                      className={`gap-1.5 ${
                        restaurant.hasVoted
                          ? "bg-ember hover:bg-ember/90"
                          : ""
                      }`}
                      onClick={() => handleVote(restaurant.id)}
                      disabled={votingId === restaurant.id}
                    >
                      <ThumbsUp
                        className={`w-4 h-4 ${
                          restaurant.hasVoted ? "fill-current" : ""
                        }`}
                      />
                      {restaurant.voteCount}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
