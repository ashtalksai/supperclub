"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check, X } from "lucide-react";

interface InviteActionsProps {
  dinnerId: string;
}

export function InviteActions({ dinnerId }: InviteActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [responded, setResponded] = useState(false);

  async function handleRespond(status: "accepted" | "declined") {
    // For simplicity, use the dinner ID as the invite lookup
    // In production, you'd look up the specific invite for this user
    try {
      const res = await fetch(`/api/invites/${dinnerId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setResponded(true);
        toast({
          title: status === "accepted" ? "You're in! 🎉" : "Maybe next time!",
          description:
            status === "accepted"
              ? "Head to the dinner page to vote on restaurants."
              : "We'll miss you at dinner.",
        });

        if (status === "accepted") {
          setTimeout(() => router.push(`/dashboard/dinner/${dinnerId}`), 1500);
        }
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  if (responded) {
    return (
      <div className="text-center py-4">
        <p className="text-sage font-medium">Response recorded! ✨</p>
      </div>
    );
  }

  return (
    <div className="flex gap-3 pt-4">
      <Button
        variant="outline"
        className="flex-1 gap-2"
        onClick={() => handleRespond("declined")}
      >
        <X className="w-4 h-4" />
        Decline
      </Button>
      <Button className="flex-1 gap-2" onClick={() => handleRespond("accepted")}>
        <Check className="w-4 h-4" />
        Accept
      </Button>
    </div>
  );
}
