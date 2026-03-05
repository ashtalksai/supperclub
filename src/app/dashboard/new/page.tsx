"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Halal",
  "Kosher",
  "Dairy-Free",
  "Nut-Free",
];

export default function NewDinnerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  function toggleDietary(option: string) {
    setSelectedDietary((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const location = formData.get("location") as string;
    const guestCount = parseInt(formData.get("guestCount") as string) || 4;

    const dateTime = new Date(`${date}T${time}`);

    try {
      const res = await fetch("/api/dinners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date: dateTime.toISOString(),
          location,
          dietaryPrefs: selectedDietary.join(", "),
          guestCount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to create dinner",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Dinner created! 🎉",
        description: "AI is picking restaurant suggestions for you.",
      });

      router.push(`/dashboard/dinner/${data.dinner.id}`);
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // Default to tomorrow at 7pm
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-midnight/60 hover:text-midnight mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dinners
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-ember" />
            Plan a New Dinner
          </CardTitle>
          <CardDescription>
            Fill in the details and we&apos;ll find the perfect restaurant for your
            group.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Dinner Name</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Friday Night Crew, Birthday Dinner"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={defaultDate}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  defaultValue="19:00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Neighborhood / Area</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. Downtown, East Village, Shoreditch"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestCount">Guest Count</Label>
              <Input
                id="guestCount"
                name="guestCount"
                type="number"
                min={2}
                max={20}
                defaultValue={4}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Dietary Preferences</Label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleDietary(option)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedDietary.includes(option)
                        ? "bg-ember text-white"
                        : "bg-midnight/5 text-midnight/60 hover:bg-midnight/10"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                "Creating dinner..."
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Dinner & Get Suggestions
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
