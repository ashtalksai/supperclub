import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  Utensils,
  Vote,
  Bell,
  ArrowRight,
  Sparkles,
  Users,
  MapPin,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-cream/80 backdrop-blur-md border-b border-ember/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-display text-xl font-bold text-midnight">
              SupperClub
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-ember/10 text-ember rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-powered dinner planning
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-midnight leading-tight mb-6">
            Dinner plans that{" "}
            <span className="text-ember">actually happen.</span>
          </h1>
          <p className="text-lg sm:text-xl text-midnight/60 max-w-2xl mx-auto mb-10">
            Stop the endless &quot;where should we eat?&quot; group chat. SupperClub
            uses AI to suggest perfect restaurants, lets your crew vote, and
            makes sure everyone actually shows up.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 h-12">
                Plan Your First Dinner
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="text-base px-8 h-12">
                See How It Works
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-midnight mb-4">
              Everything you need to get the crew together
            </h2>
            <p className="text-midnight/60 max-w-xl mx-auto">
              From planning to plate, SupperClub handles the logistics so you
              can focus on the fun.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: CalendarDays,
                title: "Plan Together",
                desc: "Pick a date, set the vibe, and let everyone know. No more back-and-forth.",
                color: "bg-ember/10 text-ember",
              },
              {
                icon: Utensils,
                title: "AI Restaurant Picks",
                desc: "Get personalized restaurant suggestions based on location, dietary needs, and group preferences.",
                color: "bg-saffron/10 text-saffron-600",
              },
              {
                icon: Vote,
                title: "Group Voting",
                desc: "Everyone gets a say. Vote on restaurants and let democracy decide dinner.",
                color: "bg-sage/10 text-sage-600",
              },
              {
                icon: Bell,
                title: "Never Forget",
                desc: "Automatic reminders so nobody flakes. Your dinner plans survive the group chat.",
                color: "bg-midnight/10 text-midnight",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="border-none shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-midnight mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-midnight/60">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-midnight mb-4">
              Three steps to a great night out
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: Users,
                title: "Create & Invite",
                desc: "Set the date, pick a neighborhood, and share a link with your friends.",
              },
              {
                step: "2",
                icon: MapPin,
                title: "Get Suggestions",
                desc: "AI finds the perfect restaurants based on your group's preferences and dietary needs.",
              },
              {
                step: "3",
                icon: Utensils,
                title: "Vote & Go",
                desc: "Everyone votes, the winner is picked, and you've got dinner plans. Done.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-ember text-white flex items-center justify-center mx-auto mb-4 text-2xl font-display font-bold">
                  {item.step}
                </div>
                <item.icon className="w-8 h-8 text-midnight/40 mx-auto mb-3" />
                <h3 className="font-heading text-xl font-semibold text-midnight mb-2">
                  {item.title}
                </h3>
                <p className="text-midnight/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-midnight rounded-2xl p-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream mb-4">
            Ready to stop texting and start eating?
          </h2>
          <p className="text-cream/60 mb-8 text-lg">
            Join SupperClub and make your next dinner unforgettable.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-ember hover:bg-ember-600 text-white text-base px-8 h-12"
            >
              Get Started — It&apos;s Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-midnight/10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍽️</span>
            <span className="font-heading font-semibold text-midnight">
              SupperClub
            </span>
          </div>
          <p className="text-sm text-midnight/40">
            © {new Date().getFullYear()} SupperClub. Dinner plans that actually
            happen.
          </p>
        </div>
      </footer>
    </div>
  );
}
