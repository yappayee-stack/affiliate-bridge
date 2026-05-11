import { useAction, useMutation } from "convex/react";
import {
  ArrowRight,
  Check,
  Shield,
  Star,
  TrendingUp,
  Zap,
  Award,
  Eye,
  Heart,
  Share2,
  Target,
  Smartphone,
  Bot,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";

const AFFILIATE_URL = "https://affbaylanding-dmqrqdof.manus.space/";

/* ═══════════════ Animated counter ═══════════════ */
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1800;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count.toLocaleString()}{suffix}</>;
}

/* ═══════════════ Thank You ═══════════════ */
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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(180deg, #fdf2f8 0%, #ffffff 40%)" }}>
      <div className="text-center space-y-6 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Check className="size-8" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">You're in! 🎉</h2>
        <p className="text-gray-500">
          Check your inbox — your free guide is on the way! Taking you to the full course now...
        </p>
        <button
          onClick={() => { window.location.href = AFFILIATE_URL; }}
          className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8 py-3 text-sm font-semibold transition-all"
        >
          See the Full Course →
        </button>
        <p className="text-xs text-gray-400 animate-pulse">Redirecting in {countdown}...</p>
      </div>
    </div>
  );
}

/* ═══════════════ Main Landing Page ═══════════════ */
export function FreeLanding() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [captured, setCaptured] = useState(false);
  const captureLead = useMutation(api.leads.capture);
  const sendWelcomeEmail = useAction(api.sendWelcomeEmail.send);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email"); return; }
    setIsSubmitting(true);
    try {
      const result = await captureLead({ email: email.trim(), name: name.trim() || undefined, source: "free-landing" });
      if (!result.alreadyExists) {
        sendWelcomeEmail({ email: email.trim(), name: name.trim() || undefined }).catch(() => {});
      }
      setCaptured(true);
    } catch { setError("Something went wrong — try again"); }
    finally { setIsSubmitting(false); }
  }, [email, name, captureLead, sendWelcomeEmail]);

  if (captured) return <ThankYouView />;

  return (
    <div className="min-h-screen bg-white">

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 30%, #ffffff 100%)" }}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ec4899 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }} />

        <div className="relative max-w-3xl mx-auto px-4 pt-12 pb-16 sm:pt-16 sm:pb-20">
          {/* Brand */}
          <div className="text-center mb-10">
            <p className="text-sm font-semibold tracking-widest text-pink-400 uppercase">Affiliate Baybe</p>
          </div>

          {/* Headline */}
          <h1 className="text-center text-[2rem] sm:text-[2.75rem] md:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-5">
            The strategy behind{" "}
            <span className="text-pink-500">8 million views</span>
            <br className="hidden sm:block" />{" "}
            and <span className="text-pink-500">$0 in ads</span>
          </h1>

          {/* Subtitle */}
          <p className="text-center text-base sm:text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            A free guide from a real creator — not a guru charging $997 for recycled YouTube tips.
          </p>

          {/* Email capture — Semrush style inline */}
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="First name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 h-12 bg-white border border-gray-200 rounded-full text-sm px-5 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 shadow-sm"
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="flex-1 h-12 bg-white border border-gray-200 rounded-full text-sm px-5 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 shadow-sm"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-sm font-semibold rounded-full px-7 transition-all shadow-md hover:shadow-lg hover:shadow-pink-500/20 disabled:opacity-70 whitespace-nowrap flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </span>
                ) : (
                  <>
                    Get the Free Guide
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </div>
            {error && <p className="text-sm text-center text-red-500 mt-2">{error}</p>}
          </form>

          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <Shield className="size-3" /> No spam. No upsell trap. Just real game.
          </p>
        </div>
      </section>

      {/* ════════════════════════ STATS BAR ════════════════════════ */}
      <section className="border-y border-gray-100 bg-gray-50/60">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: Eye, value: <AnimatedNumber target={8700000} suffix="+" />, label: "TikTok Views" },
            { icon: Award, value: "Gold", label: "Creator Badge" },
            { icon: Heart, value: <AnimatedNumber target={572000} suffix="+" />, label: "Likes" },
            { icon: Share2, value: <AnimatedNumber target={52000} suffix="+" />, label: "Shares" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="space-y-1">
              <Icon className="size-5 text-pink-400 mx-auto mb-1" />
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════ PROBLEM / TRUST ════════════════════════ */}
      <section className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Tired of gurus selling you <span className="text-pink-500">$997 air?</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
            Most "coaches" charge thousands for information you can find for free. 
            They flex rented lifestyles and recycled screenshots. You deserve better than that.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {[
            {
              icon: Shield,
              title: "I'm a real person",
              desc: "Full-time ER/trauma nurse. I built this on night shifts — not from a rented Airbnb pretending to be rich.",
            },
            {
              icon: TrendingUp,
              title: "$0 spent on ads",
              desc: "8M+ views from organic strategy only. No paid ads, no buying followers, no shortcuts.",
            },
            {
              icon: Star,
              title: "Brands come to ME",
              desc: "Samsung reached out twice. Free samples, affiliate deals, LA invites — all from real content.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-50 rounded-2xl p-6 space-y-3 text-center">
              <div className="inline-flex size-10 items-center justify-center rounded-full bg-pink-100 text-pink-500">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════ WHAT'S INSIDE ════════════════════════ */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-pink-400 uppercase mb-3">What's Inside</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              6 chapters. Zero fluff.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Zap, ch: "01", title: "Building Your Brand", desc: "Create a brand that stands out — without showing your face" },
              { icon: DollarSign, ch: "02", title: "Affiliate Marketing", desc: "How to earn commissions the right way, without being salesy" },
              { icon: TrendingUp, ch: "03", title: "Driving Traffic", desc: "Organic strategies that actually work — TikTok, Pinterest, YouTube" },
              { icon: Smartphone, ch: "04", title: "TikTok Shop Strategy", desc: "How to set up, promote, and profit from TikTok Shop" },
              { icon: Bot, ch: "05", title: "AI Tools & Automation", desc: "Work smarter with AI — content, funnels, and scaling" },
              { icon: Target, ch: "06", title: "Scaling & Growth", desc: "Go from side hustle to real business with a 30-day action plan" },
            ].map(({ icon: Icon, ch, title, desc }) => (
              <div key={ch} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex-shrink-0 size-10 rounded-lg bg-pink-50 flex items-center justify-center">
                  <Icon className="size-5 text-pink-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-0.5">Chapter {ch}</p>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bonus callout */}
          <div className="mt-6 flex items-center gap-3 bg-pink-50 rounded-xl p-4 border border-pink-100">
            <Calendar className="size-5 text-pink-500 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Bonus:</span> Includes a 30-day action plan, tool list, and resource links so you can start immediately.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════ QUOTE / SIGNATURE ════════════════════════ */}
      <section className="max-w-3xl mx-auto px-4 py-16 sm:py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-4xl mb-4">"</div>
          <p className="text-lg sm:text-xl font-medium text-gray-900 italic leading-relaxed mb-4">
            I have no reason to lie to you. I save lives for a living. If I'm putting my name on something, it's because I actually believe in it.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="size-1 rounded-full bg-pink-300" />
            <p className="text-sm text-gray-400 font-medium">Affiliate Baybe · ER Nurse · Gold Badge Creator</p>
            <div className="size-1 rounded-full bg-pink-300" />
          </div>
        </div>
      </section>

      {/* ════════════════════════ FINAL CTA ════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #ffffff 0%, #fdf2f8 50%, #fce7f3 100%)" }}
      >
        <div className="max-w-lg mx-auto px-4 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Ready to learn the real strategy?
          </h2>
          <p className="text-gray-500 mb-8">
            Free. No credit card. No catch. Just enter your email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="flex-1 h-12 bg-white border border-gray-200 rounded-full text-sm px-5 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-full px-7 transition-all shadow-md hover:shadow-lg hover:shadow-pink-500/20 disabled:opacity-70 whitespace-nowrap flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Get the Free Guide
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </div>
            {error && <p className="text-sm text-center text-red-500">{error}</p>}
          </form>

          <p className="text-xs text-gray-400 flex items-center justify-center gap-1 mb-8">
            <Shield className="size-3" /> No spam. Unsubscribe anytime.
          </p>

          {/* Ebook upsell note */}
          <div className="bg-white/80 rounded-xl p-4 border border-pink-100">
            <p className="text-sm text-gray-600">
              🔥 Want the full deep dive? The <span className="font-semibold text-pink-600">$19 ebook</span>{" "}
              <span className="line-through text-gray-400 text-xs">$25</span> includes everything in the free guide plus advanced strategies, templates, and a 90-day money-back guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════ FOOTER ════════════════════════ */}
      <footer className="border-t border-gray-100 py-6 text-center">
        <p className="text-[11px] text-gray-300">
          Affiliate Baybe · Cute Content. Real Checks. · © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
