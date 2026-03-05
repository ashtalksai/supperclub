"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";

interface DashboardNavProps {
  user: { id: string; name: string; email: string };
}

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-ember/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🍽️</span>
          <span className="font-display text-xl font-bold text-midnight">
            SupperClub
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Dinner</span>
            </Button>
          </Link>
          <span className="text-sm text-midnight/60 hidden sm:inline">
            {user.name}
          </span>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
