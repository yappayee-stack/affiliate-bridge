import { useMutation } from "convex/react";
import {
  ArrowRight,
  Check,
  Clock,
  Gift,
  Heart,
  Mail,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "../../convex/_generated/api";

const AFFILIATE_URL = "https://affbaylanding-dmqrqdof.manus.space/";

function CountdownTimer() {
  const [time, setTime] = useState({ hours: 2, minutes: 47, seconds: 39 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              return { hours: 23, minutes: 59, seconds: 59 };
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5 text-sm font-bold">
      <span className="bg-white/20 backdrop-blur-sm rounded-md px-2 py-1 min-w-[2rem] text-center">
        {pad(time.hours)}
      </span>
      <span className="text-white/80">:</span>
      <span className="bg-white/20 backdrop-blur-sm rounded-md px-2 py-1 min-w-[2rem] text-center">
        {pad(time.minutes)}
      </span>
      <span className="text-white/80">:</span>
      <span className="bg-white/20 backdrop-blur-sm rounded-md px-2 py-1 min-w-[2rem] text-center">
        {pad(time.seconds)}
      </span>
    </div>
  );
}

function EmailCaptureForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const captureLead = useMutation(api.leads.capture);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!email.trim()) {
        setError("Please enter your email address");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address");
        return;
      }

      setIsSubmitting(true);
      try {
        await captureLead({
          email: email.trim(),
          name: name.trim() || undefined,
          source: "bridge-page",
        });
        onSuccess();
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, name, captureLead, onSuccess],
  );

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-3">
      <div>
        <Input
          type="text"
          placeholder="Your first name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 bg-white border-pink-200 text-foreground placeholder:text-pink-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-base"
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Your best email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className="h-12 bg-white border-pink-200 text-foreground placeholder:text-pink-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-base"
          required
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-13 text-base font-bold rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow disabled:opacity-70 disabled:animate-none"
        size="lg"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Yes! Send Me the Free Guide
            <ArrowRight className="size-5" />
          </span>
        )}
      </Button>
      <p className="text-xs text-center text-pink-400/70 flex items-center justify-center gap-1">
        <Shield className="size-3" />
        No spam, ever. Unsubscribe anytime.
      </p>
    </form>
  );
}

function ThankYouView() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = AFFILIATE_URL;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center space-y-6 py-8 animate-in fade-in duration-500">
      <div className="inline-flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-lg">
        <Check className="size-10" strokeWidth={3} />
      </div>
      <div className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-serif)" }}>
          You're In! 🎉
        </h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Check your inbox for the free guide. While you wait, here's the full
          course at the special launch price...
        </p>
      </div>
      <div className="space-y-3">
        <Button
          size="lg"
          className="h-14 px-8 text-lg font-bold rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg"
          onClick={() => {
            window.location.href = AFFILIATE_URL;
          }}
        >
          <Sparkles className="size-5" />
          See the Full Course — $19
          <ArrowRight className="size-5" />
        </Button>
        <p className="text-sm text-muted-foreground">
          Redirecting in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [captured, setCaptured] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (captured) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky promo bar */}
        <div className="bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 text-white py-2.5 px-4">
          <div className="container flex items-center justify-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-sm font-medium">
              🔥 <span className="font-bold">Launch Special:</span>
              <span className="line-through opacity-70">$25</span>
              <span className="font-bold text-lg">$19</span>
              <span className="bg-white/20 text-xs font-bold px-2 py-0.5 rounded-full">Save 24%</span>
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <ThankYouView />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sticky promo bar */}
      <div className="bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 text-white py-2.5 px-4">
        <div className="container flex items-center justify-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-sm font-medium">
            🔥 <span className="font-bold">Launch Special:</span>
            <span className="line-through opacity-70">$25</span>
            <span className="font-bold text-lg">$19</span>
            <span className="bg-white/20 text-xs font-bold px-2 py-0.5 rounded-full">Save 24%</span>
          </span>
          <span className="text-white/80 text-sm hidden sm:inline">Ends in:</span>
          <CountdownTimer />
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-0 font-bold text-xs rounded-full px-4"
            onClick={scrollToForm}
          >
            Grab It ✨
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-24">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 right-10 size-72 bg-pink-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 size-64 bg-rose-200/20 rounded-full blur-3xl" />
          <div className="absolute top-40 left-1/3 size-48 bg-purple-200/15 rounded-full blur-3xl" />
        </div>

        <div className="container max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-sm font-medium">
              <Sparkles className="size-4" />
              Free Guide — Email Marketing for Beginners
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-foreground"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Want to Start Earning{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                  Passive Income
                </span>{" "}
                from Email?
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Discover how beginners are building email lists that generate{" "}
                <span className="font-semibold text-pink-600">$36-$40 for every $1 spent</span>{" "}
                — even with zero experience.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 md:gap-8 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-pink-500" />
                <span>10 Complete Modules</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-pink-500" />
                <span>Beginner-Friendly</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-pink-500" />
                <span>90-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Preview */}
      <section className="px-4 py-12 md:py-16 bg-white/60">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-pink-500 mb-2 uppercase tracking-wider">
              What's Inside
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Here's What You'll Discover 💕
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Heart, title: "Define Your Brand", desc: "Find your niche & create a story that attracts your ideal audience" },
              { icon: TrendingUp, title: "Drive Targeted Traffic", desc: "Master content marketing, SEO & paid ads to attract buyers" },
              { icon: Zap, title: "Short-Form Video", desc: "Dominate TikTok, Reels & Shorts with viral content strategies" },
              { icon: Sparkles, title: "AI Tools & Automation", desc: "Leverage AI for content creation, copywriting & analytics" },
              { icon: Mail, title: "Build Your Email List", desc: "Create lead magnets & nurture sequences that convert" },
              { icon: Star, title: "Monetize Everything", desc: "Turn followers into revenue with affiliate promotions" },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative bg-white rounded-2xl border border-pink-100 p-5 transition-all hover:shadow-md hover:border-pink-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500 group-hover:bg-pink-100 transition-colors">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="px-4 py-12 md:py-16">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: "💌", stat: "$36-$40", label: "ROI per $1 spent" },
              { emoji: "📚", stat: "10", label: "Full Modules" },
              { emoji: "📧", stat: "8", label: "Email Templates" },
              { emoji: "🛡️", stat: "90-Day", label: "Money-Back Guarantee" },
            ].map(({ emoji, stat, label }) => (
              <div key={label} className="text-center bg-white rounded-2xl border border-pink-100 p-5">
                <span className="text-2xl mb-2 block">{emoji}</span>
                <p className="text-xl md:text-2xl font-bold text-foreground">{stat}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonuses Teaser */}
      <section className="px-4 py-12 md:py-16 bg-white/60">
        <div className="container max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-sm font-medium mb-6">
            <Gift className="size-4" />
            Included Bonuses
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold text-foreground mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Plus These Game-Changing Extras 🎀
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Clock, title: "30-Day Action Plan", desc: "Week-by-week breakdown to your first 200 subscribers" },
              { icon: Mail, title: "8 Email Templates", desc: "Battle-tested copy & paste templates you can send today" },
              { icon: Users, title: "Community Access", desc: "Connect with other creators, share wins & grow together" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-gradient-to-b from-pink-50 to-white rounded-2xl border border-pink-100 p-6 text-center">
                <div className="inline-flex size-12 items-center justify-center rounded-full bg-pink-100 text-pink-500 mb-4">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-bold text-sm mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture Section */}
      <section ref={formRef} className="px-4 py-16 md:py-24" id="get-access">
        <div className="container max-w-2xl mx-auto">
          <div className="relative bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-3xl p-8 md:p-12 text-white text-center overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 size-40 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 size-40 bg-white/5 rounded-full blur-2xl translate-x-1/2 translate-y-1/2" />

            <div className="relative space-y-6">
              <div className="space-y-3">
                <span className="text-3xl">✨</span>
                <h2
                  className="text-2xl md:text-3xl font-bold"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Get Your Free Starter Guide
                </h2>
                <p className="text-pink-100 text-base max-w-lg mx-auto">
                  Enter your email below to get instant access to our beginner-friendly
                  email marketing guide + the exclusive launch price.
                </p>
              </div>

              <EmailCaptureForm onSuccess={() => setCaptured(true)} />

              <div className="flex items-center justify-center gap-4 text-xs text-pink-200 flex-wrap pt-2">
                <span className="flex items-center gap-1">💝 Lifetime Access</span>
                <span className="flex items-center gap-1">📚 10 Full Modules</span>
                <span className="flex items-center gap-1">🛡️ 90-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Mini Section */}
      <section className="px-4 py-12 md:py-16 bg-white/60">
        <div className="container max-w-2xl mx-auto">
          <h2
            className="text-2xl font-bold text-center mb-8 text-foreground"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Quick Questions 🌸
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is this really for beginners?",
                a: "Yes! This course is designed for complete beginners. No prior email marketing experience needed.",
              },
              {
                q: "What tools do I need?",
                a: "Just free or low-cost tools like Beacons, Google Docs, and Canva. We walk you through everything.",
              },
              {
                q: "What if I don't see results?",
                a: "We offer a 90-day money-back guarantee. If you implement the course and don't see results, you get a full refund.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl border border-pink-100 p-5">
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <span className="text-pink-500">Q:</span> {q}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 md:py-20">
        <div className="container max-w-2xl mx-auto text-center space-y-6">
          <h2
            className="text-2xl md:text-3xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Ready to Start Earning? ✨
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Join creators who are building sustainable income through email marketing.
            Start your journey today.
          </p>
          <Button
            size="lg"
            className="h-14 px-8 text-base font-bold rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={scrollToForm}
          >
            <Mail className="size-5" />
            Get Free Access Now
            <ArrowRight className="size-5" />
          </Button>
          <p className="text-xs text-muted-foreground">
            🛡️ 90-day money-back guarantee — zero risk
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pink-100 px-4 py-8">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="size-4 text-pink-500 fill-pink-500" />
            <span className="font-semibold text-sm text-foreground">Affiliate Baybe</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Made with 💕 for creators who want more freedom.
          </p>
        </div>
      </footer>
    </div>
  );
}
