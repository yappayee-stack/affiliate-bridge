import { useMutation } from "convex/react";
import {
  ArrowRight,
  Check,
  Mail,
  Shield,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "../../convex/_generated/api";

const AFFILIATE_URL = "https://affbaylanding-dmqrqdof.manus.space/";

/* ───────── Email Capture ───────── */
function EmailCaptureForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const captureLead = useMutation(api.leads.capture);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email 💌"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Hmm, that doesn't look right"); return; }
    setIsSubmitting(true);
    try {
      await captureLead({ email: email.trim(), name: name.trim() || undefined, source: "bridge-page" });
      onSuccess();
    } catch { setError("Something went wrong — try again!"); }
    finally { setIsSubmitting(false); }
  }, [email, name, captureLead, onSuccess]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-3">
      <Input
        type="text"
        placeholder="First name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-12 bg-white border-gray-200 text-foreground placeholder:text-gray-400 rounded-xl text-sm px-4 focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
      />
      <Input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(""); }}
        className="h-12 bg-white border-gray-200 text-foreground placeholder:text-gray-400 rounded-xl text-sm px-4 focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
        required
      />
      {error && <p className="text-sm text-center font-medium text-red-500">{error}</p>}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 text-sm font-semibold rounded-xl bg-pink-500 hover:bg-pink-600 text-white transition-all duration-200 hover:shadow-md disabled:opacity-70"
        size="lg"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Send Me the Free Guide
            <ArrowRight className="size-4" />
          </span>
        )}
      </Button>
      <p className="text-[11px] text-center text-gray-400 flex items-center justify-center gap-1">
        <Shield className="size-3" /> No spam, unsubscribe anytime.
      </p>
    </form>
  );
}

/* ───────── Thank You ───────── */
function ThankYouView() {
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((p) => { if (p <= 1) { window.location.href = AFFILIATE_URL; return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-pink-50/50 to-white">
      <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex size-16 items-center justify-center rounded-full bg-pink-100 text-pink-600">
          <Check className="size-8" strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">You're all set! 🎉</h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Check your inbox for the free guide. In the meantime, here's something I think you'll love...
          </p>
        </div>
        <Button
          className="h-12 px-8 text-sm font-semibold rounded-xl bg-pink-500 hover:bg-pink-600 text-white transition-all hover:shadow-md"
          onClick={() => { window.location.href = AFFILIATE_URL; }}
        >
          <Sparkles className="size-4" />
          Check Out the Full Course — $19
        </Button>
        <p className="text-xs text-gray-400 animate-pulse">
          Redirecting in {countdown}...
        </p>
      </div>
    </div>
  );
}

/* ───────── Main Page ───────── */
export function LandingPage() {
  const [captured, setCaptured] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

  if (captured) return <ThankYouView />;

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-pink-50/60 via-white to-pink-50/30 min-h-screen">

      {/* ── Hero ── */}
      <section className="px-4 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="container max-w-2xl mx-auto text-center space-y-6">
          <p className="text-pink-500 text-sm font-medium tracking-wide">
            ✨ Free Guide
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            Start Making Money{" "}
            <span className="text-pink-500">From Your Email List</span>
          </h1>

          <p className="text-gray-500 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Email marketing returns <span className="font-semibold text-gray-700">$36–$40 for every $1 spent</span>. 
            This free guide breaks down exactly how to get started — even if you've never sent a marketing email before.
          </p>

          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 text-sm font-medium transition-colors"
            type="button"
          >
            Get the free guide
            <ArrowRight className="size-4" />
          </button>
        </div>
      </section>

      {/* ── What's Inside ── */}
      <section className="px-4 py-12 md:py-16">
        <div className="container max-w-2xl mx-auto">
          <h2 className="text-center text-xl md:text-2xl font-bold text-gray-900 mb-8">
            What you'll learn
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { emoji: "🎯", title: "Find your niche", desc: "Define your brand and attract the right audience" },
              { emoji: "📈", title: "Drive real traffic", desc: "Content marketing, SEO & simple ad strategies" },
              { emoji: "🎬", title: "Short-form video", desc: "TikTok, Reels & Shorts — what's actually working" },
              { emoji: "🤖", title: "AI tools", desc: "Use AI for content, copy & analytics" },
              { emoji: "💌", title: "Email marketing", desc: "Lead magnets, opt-ins & sequences that convert" },
              { emoji: "💰", title: "Monetization", desc: "Turn your audience into real revenue" },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="flex gap-3 p-4 rounded-xl bg-white border border-gray-100 hover:border-pink-100 hover:shadow-sm transition-all duration-200">
                <span className="text-xl mt-0.5">{emoji}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's Included ── */}
      <section className="px-4 py-12">
        <div className="container max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">What you get</h2>
            <div className="space-y-3">
              {[
                { emoji: "📚", text: "10 full modules covering everything from branding to monetization" },
                { emoji: "📅", text: "30-day action plan — step by step, week by week" },
                { emoji: "✉️", text: "8 ready-to-use email templates (just copy, paste, send)" },
                { emoji: "👥", text: "Access to a community of creators on the same journey" },
                { emoji: "🛡️", text: "90-day money-back guarantee — try it risk-free" },
              ].map(({ emoji, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="text-base mt-0.5">{emoji}</span>
                  <p className="text-gray-600 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Email Capture ── */}
      <section ref={formRef} className="px-4 py-12 md:py-16" id="get-access">
        <div className="container max-w-md mx-auto text-center space-y-5">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Get the free starter guide
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Drop your email and I'll send it right over — plus you'll get the exclusive launch price ($19 instead of $25).
            </p>
          </div>

          <EmailCaptureForm onSuccess={() => setCaptured(true)} />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-12">
        <div className="container max-w-xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Common questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is this really for beginners?", a: "100%. It's designed for people starting from zero — no tech skills or experience needed." },
              { q: "What tools do I need?", a: "Just free ones like Beacons, Google Docs, and Canva. The guide walks you through setting everything up." },
              { q: "What if it's not for me?", a: "There's a 90-day money-back guarantee on the full course. No questions asked." },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-gray-100 pb-4 last:border-0">
                <h3 className="font-semibold text-gray-900 text-sm">{q}</h3>
                <p className="text-gray-500 text-sm mt-1">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Soft CTA ── */}
      <section className="px-4 py-12 md:py-16">
        <div className="container max-w-lg mx-auto text-center space-y-4">
          <p className="text-gray-500 text-sm">
            Your email list is the one thing no algorithm can take away from you.
          </p>
          <Button
            className="h-12 px-8 text-sm font-semibold rounded-xl bg-pink-500 hover:bg-pink-600 text-white transition-all hover:shadow-md"
            onClick={scrollToForm}
          >
            <Mail className="size-4" />
            Get the Free Guide
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-4 py-6 mt-auto">
        <div className="container max-w-2xl mx-auto text-center">
          <span className="text-xs text-gray-400">Affiliate Baybe</span>
        </div>
      </footer>
    </div>
  );
}
