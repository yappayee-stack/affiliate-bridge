import { useMutation } from "convex/react";
import {
  ArrowRight,
  Check,
  Shield,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "../../convex/_generated/api";

const AFFILIATE_URL = "https://affbaylanding-dmqrqdof.manus.space/";

/* ───────── Thank You ───────── */
function ThankYouView() {
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((p) => {
        if (p <= 1) { window.location.href = AFFILIATE_URL; return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="text-center space-y-6 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Check className="size-8" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">You're in! 🎉</h2>
        <p className="text-gray-500">
          Check your inbox for the free guide. Taking you to the full course now...
        </p>
        <Button
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-6 h-11 text-sm font-semibold"
          onClick={() => { window.location.href = AFFILIATE_URL; }}
        >
          Go to the Course →
        </Button>
        <p className="text-xs text-gray-400 animate-pulse">Redirecting in {countdown}...</p>
      </div>
    </div>
  );
}

/* ───────── Main Bridge Page ───────── */
export function LandingPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [captured, setCaptured] = useState(false);
  const captureLead = useMutation(api.leads.capture);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email"); return; }
    setIsSubmitting(true);
    try {
      await captureLead({ email: email.trim(), name: name.trim() || undefined, source: "bridge-page" });
      setCaptured(true);
    } catch { setError("Something went wrong — try again"); }
    finally { setIsSubmitting(false); }
  }, [email, name, captureLead]);

  if (captured) return <ThankYouView />;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">

        {/* ── Header ── */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 text-xs font-semibold px-3 py-1.5 rounded-full">
            ✨ FREE GUIDE
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            How to Start Making Money<br />
            <span className="text-pink-500">With Email Marketing</span>
          </h1>
        </div>

        {/* ── Personal message ── */}
        <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 text-[15px] leading-relaxed">
            Hey! 👋 I put together a free starter guide that breaks down how email marketing actually works — and how you can start earning from it, even as a complete beginner.
          </p>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            We're talking <span className="font-semibold text-gray-800">$36–$40 back for every $1 spent</span>. The guide covers finding your niche, building your list, writing emails that convert, and monetizing — all in 10 easy modules.
          </p>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            Drop your info below and I'll send it right over. 👇
          </p>
        </div>

        {/* ── What's included (compact) ── */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "📚 10 Modules",
            "📅 30-Day Plan",
            "✉️ 8 Email Templates",
            "👥 Community Access",
          ].map((item) => (
            <span key={item} className="text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1.5">
              {item}
            </span>
          ))}
        </div>

        {/* ── Email Form ── */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="First name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 bg-white border-gray-200 rounded-xl text-sm px-4 focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
          />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            className="h-12 bg-white border-gray-200 rounded-xl text-sm px-4 focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
            required
          />
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-pink-500/20 disabled:opacity-70"
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
            <Shield className="size-3" /> No spam. Unsubscribe anytime.
          </p>
        </form>

        {/* ── Price note ── */}
        <div className="text-center bg-pink-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">
            🔥 <span className="font-semibold">Launch special:</span> Full course is just <span className="font-bold text-pink-600">$19</span> <span className="line-through text-gray-400 text-xs">$25</span> — includes a 90-day money-back guarantee.
          </p>
        </div>

        {/* ── Footer ── */}
        <p className="text-center text-[11px] text-gray-300">
          Affiliate Baybe
        </p>
      </div>
    </div>
  );
}
