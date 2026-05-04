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

/* ───────── Countdown ───────── */
function CountdownTimer() {
  const [time, setTime] = useState({ hours: 2, minutes: 47, seconds: 39 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((p) => {
        let { hours, minutes, seconds } = p;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) return { hours: 23, minutes: 59, seconds: 59 };
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    <div className="flex items-center gap-1 font-mono font-bold text-sm">
      {[pad(time.hours), pad(time.minutes), pad(time.seconds)].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-white/60 animate-pulse">:</span>}
          <span className="bg-white/20 backdrop-blur rounded-lg px-2.5 py-1 min-w-[2.2rem] text-center tabular-nums">{v}</span>
        </span>
      ))}
    </div>
  );
}

/* ───────── Floating emojis ───────── */
function FloatingEmojis() {
  const emojis = ["💌", "✨", "💕", "🌸", "💖", "⭐", "🎀", "💗"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {emojis.map((e, i) => (
        <span
          key={i}
          className="absolute text-2xl opacity-20 animate-float"
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3 + (i % 3)}s`,
          }}
        >
          {e}
        </span>
      ))}
    </div>
  );
}

/* ───────── Email Capture ───────── */
function EmailCaptureForm({ variant, onSuccess }: { variant: "hero" | "card"; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const captureLead = useMutation(api.leads.capture);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Drop your email, babe! 💌"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Hmm, that doesn't look right 🤔"); return; }
    setIsSubmitting(true);
    try {
      await captureLead({ email: email.trim(), name: name.trim() || undefined, source: "bridge-page" });
      onSuccess();
    } catch { setError("Oops! Try again 💕"); }
    finally { setIsSubmitting(false); }
  }, [email, name, captureLead, onSuccess]);

  const isHero = variant === "hero";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-3">
      <Input
        type="text"
        placeholder="Your first name ✨"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`h-13 ${isHero ? "bg-white/10 border-white/20 text-white placeholder:text-white/50" : "bg-white border-pink-200 text-foreground placeholder:text-pink-300"} rounded-2xl text-base px-5 focus:ring-2 focus:ring-pink-400`}
      />
      <Input
        type="email"
        placeholder="Your best email 💌"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(""); }}
        className={`h-13 ${isHero ? "bg-white/10 border-white/20 text-white placeholder:text-white/50" : "bg-white border-pink-200 text-foreground placeholder:text-pink-300"} rounded-2xl text-base px-5 focus:ring-2 focus:ring-pink-400`}
        required
      />
      {error && <p className={`text-sm text-center font-medium ${isHero ? "text-pink-200" : "text-red-500"}`}>{error}</p>}
      <Button
        type="submit"
        disabled={isSubmitting}
        className={`w-full h-14 text-base font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 ${
          isHero
            ? "bg-white text-pink-600 hover:bg-pink-50 animate-pulse-glow"
            : "bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white animate-pulse-glow"
        }`}
        size="lg"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="size-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            One sec...
          </span>
        ) : (
          <span className="flex items-center gap-2 text-lg">
            YES! I Want In 💖
            <ArrowRight className="size-5" />
          </span>
        )}
      </Button>
      <p className={`text-xs text-center flex items-center justify-center gap-1 ${isHero ? "text-white/50" : "text-pink-400/60"}`}>
        <Shield className="size-3" /> No spam. Pinky promise. 🤞
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-pink-400/30 rounded-full blur-2xl scale-150 animate-pulse" />
          <div className="relative inline-flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-600 text-white shadow-2xl">
            <Check className="size-12" strokeWidth={3} />
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl md:text-5xl font-black text-foreground" style={{ fontFamily: "var(--font-serif)" }}>
            You're In, Babe! 🎉
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Check your inbox for the free guide 💌<br/>
            Meanwhile, peep the full course at the special launch price...
          </p>
        </div>
        <Button
          size="lg"
          className="h-16 px-10 text-lg font-black rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-2xl hover:shadow-pink-500/25 hover:scale-105 transition-all duration-300"
          onClick={() => { window.location.href = AFFILIATE_URL; }}
        >
          <Sparkles className="size-5" />
          See the Full Course — Only $19 🔥
          <ArrowRight className="size-5" />
        </Button>
        <p className="text-sm text-muted-foreground animate-pulse">
          ✨ Taking you there in {countdown}...
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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ── Sticky Promo Bar ── */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 text-white py-2.5 px-4 shadow-lg shadow-pink-500/20">
        <div className="container flex items-center justify-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-sm font-medium">
            🔥 <span className="font-black">Launch Special:</span>
            <span className="line-through opacity-60 text-xs">$25</span>
            <span className="font-black text-xl leading-none">$19</span>
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-bounce">Save 24%</span>
          </span>
          <span className="text-white/70 text-xs hidden sm:inline">ends in</span>
          <CountdownTimer />
          <Button size="sm" className="bg-white text-pink-600 hover:bg-pink-50 font-black text-xs rounded-full px-5 shadow-lg hover:scale-105 transition-transform" onClick={scrollToForm}>
            Grab It ✨
          </Button>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative px-4 pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        <FloatingEmojis />
        {/* Gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-300/40 via-rose-200/30 to-purple-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-pink-200/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-gradient-to-r from-rose-200/20 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-200/60 text-pink-700 text-sm font-bold shadow-sm">
            <span className="animate-bounce">✨</span>
            Free Guide — Email Marketing for Beginners
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>✨</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.05]" style={{ fontFamily: "var(--font-serif)" }}>
            Girl, It's Time to{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600">
                Get Paid
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-pink-300/40 to-rose-300/40 rounded-full -z-10" />
            </span>
            <br />
            From Your Email List 💸
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Other creators are making{" "}
            <span className="font-black text-pink-600 text-2xl">$36-$40 back</span>{" "}
            for every $1 they spend on email.{" "}
            <span className="italic">Zero experience needed.</span>{" "}
            This free guide shows you how to start 👇
          </p>

          {/* Trust pills */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { icon: "📚", text: "10 Modules" },
              { icon: "🎯", text: "Beginner-Friendly" },
              { icon: "🛡️", text: "90-Day Guarantee" },
            ].map(({ icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-pink-100 rounded-full px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
                <span>{icon}</span> {text}
              </span>
            ))}
          </div>

          {/* Arrow pointing down */}
          <div className="flex justify-center pt-2">
            <button onClick={scrollToForm} className="animate-bounce text-pink-400 hover:text-pink-600 transition-colors" type="button">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7 13 5 5 5-5"/><path d="m7 6 5 5 5-5"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── What You'll Learn (Bento Grid) ── */}
      <section className="px-4 py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-pink-50/50 -z-10" />
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-4xl mb-4 block">🔥</span>
            <h2 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "var(--font-serif)" }}>
              Here's What You'll{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Actually Learn</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-base">No fluff. No filler. Just the real stuff. 💅</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Heart, emoji: "💕", title: "Find Your Niche", desc: "Define your brand, your vibe & attract your dream audience", color: "from-pink-500 to-rose-500" },
              { icon: TrendingUp, emoji: "📈", title: "Get Real Traffic", desc: "Master content marketing, SEO & ads that actually bring buyers", color: "from-rose-500 to-orange-400" },
              { icon: Zap, emoji: "🎬", title: "Go Viral on Short-Form", desc: "TikTok, Reels & Shorts strategies from the top 1%", color: "from-purple-500 to-pink-500" },
              { icon: Sparkles, emoji: "🤖", title: "AI Tools That Slay", desc: "Use AI for content, copy & analytics — work smarter not harder", color: "from-pink-500 to-violet-500" },
              { icon: Mail, emoji: "💌", title: "Build Your Email Empire", desc: "Lead magnets, opt-ins & nurture sequences that print money", color: "from-rose-500 to-pink-500" },
              { icon: Star, emoji: "💰", title: "Monetize Everything", desc: "Turn followers into revenue with affiliate promos & launches", color: "from-amber-400 to-pink-500" },
            ].map(({ emoji, title, desc, color }, i) => (
              <div
                key={title}
                className="group relative bg-white rounded-3xl border border-pink-100/80 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-pink-200/30 hover:-translate-y-1 hover:border-pink-200 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-[0.07] rounded-full blur-2xl translate-x-6 -translate-y-6 group-hover:opacity-[0.15] transition-opacity`} />
                <span className="text-3xl mb-3 block" style={{ animationDelay: `${i * 0.1}s` }}>{emoji}</span>
                <h3 className="font-black text-base mb-1.5">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="px-4 py-10">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-3xl p-8 md:p-10 shadow-2xl shadow-pink-500/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
              {[
                { emoji: "💌", stat: "$36-$40", label: "ROI per $1 spent" },
                { emoji: "📚", stat: "10", label: "Full Modules" },
                { emoji: "📧", stat: "8", label: "Email Templates" },
                { emoji: "🛡️", stat: "90 Days", label: "Money-Back Guarantee" },
              ].map(({ emoji, stat, label }) => (
                <div key={label} className="space-y-1">
                  <span className="text-2xl block">{emoji}</span>
                  <p className="text-2xl md:text-3xl font-black">{stat}</p>
                  <p className="text-white/70 text-xs font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bonuses ── */}
      <section className="px-4 py-16 md:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-transparent -z-10" />
        <div className="container max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-200/60 text-pink-700 text-sm font-bold mb-6">
            <Gift className="size-4" />
            Free Bonuses Included 🎁
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-10" style={{ fontFamily: "var(--font-serif)" }}>
            And You Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">These Too</span> 🎀
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Clock, emoji: "📅", title: "30-Day Action Plan", desc: "Week-by-week breakdown. By day 30, you'll have 200+ subscribers." },
              { icon: Mail, emoji: "✉️", title: "8 Email Templates", desc: "Copy, paste, send. Battle-tested templates that get opens & clicks." },
              { icon: Users, emoji: "👯‍♀️", title: "Community Access", desc: "Connect with other boss babes. Share wins & grow together." },
            ].map(({ emoji, title, desc }, i) => (
              <div key={title} className="relative bg-white rounded-3xl border border-pink-100 p-7 text-center hover:shadow-xl hover:shadow-pink-100/50 hover:-translate-y-1 transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-b from-pink-50/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <span className="text-4xl mb-4 block animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{emoji}</span>
                  <h3 className="font-black text-sm mb-2">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Email Capture Card ── */}
      <section ref={formRef} className="px-4 py-16 md:py-24" id="get-access">
        <div className="container max-w-xl mx-auto">
          <div className="relative overflow-hidden">
            {/* Background card */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-[2rem] rotate-1 scale-[1.02] opacity-60 blur-sm" />
            <div className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-[2rem] p-8 md:p-12 text-white text-center overflow-hidden shadow-2xl shadow-pink-500/30">
              {/* Decorative circles */}
              <div className="absolute -top-12 -right-12 size-40 bg-white/5 rounded-full" />
              <div className="absolute -bottom-8 -left-8 size-32 bg-white/5 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 bg-white/5 rounded-full" />

              <div className="relative space-y-6">
                <span className="text-5xl block animate-float">💌</span>
                <h2 className="text-3xl md:text-4xl font-black leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
                  Ready to Start<br/>Your Email Empire?
                </h2>
                <p className="text-pink-100 text-base max-w-sm mx-auto leading-relaxed">
                  Drop your email & get the <span className="font-bold text-white">free starter guide</span> + exclusive access to the launch price. 🚀
                </p>

                <EmailCaptureForm variant="hero" onSuccess={() => setCaptured(true)} />

                <div className="flex items-center justify-center gap-4 text-xs text-pink-200/80 flex-wrap pt-1">
                  <span>💝 Lifetime Access</span>
                  <span>📚 10 Modules</span>
                  <span>🛡️ 90-Day Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-16 md:py-20">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-3xl block mb-3">💬</span>
            <h2 className="text-2xl md:text-3xl font-black" style={{ fontFamily: "var(--font-serif)" }}>
              Quick Q's 🌸
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is this really for beginners?", a: "1000%! Designed from scratch for people starting at zero. No tech skills needed. We hold your hand through everything. 🤝" },
              { q: "What tools do I need?", a: "Just free stuff — Beacons, Google Docs, Canva. We walk you through setting up each one step-by-step. 💻" },
              { q: "What if it doesn't work for me?", a: "90-day money-back guarantee, no questions asked. Try the whole course risk-free. We're THAT confident. 💪" },
            ].map(({ q, a }) => (
              <div key={q} className="group bg-white rounded-2xl border border-pink-100 p-6 hover:shadow-lg hover:shadow-pink-100/30 hover:border-pink-200 transition-all duration-300">
                <h3 className="font-black text-sm mb-2 flex items-center gap-2">
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-pink-100 text-pink-600 text-xs font-black">Q</span>
                  {q}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-8">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-4 py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-pink-50 to-transparent -z-10" />
        <div className="container max-w-2xl mx-auto text-center space-y-8">
          <span className="text-5xl block">🚀</span>
          <h2 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "var(--font-serif)" }}>
            Your Future Self Will{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Thank You</span> ✨
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Stop scrolling. Start building. Your email list is the one thing the algorithm can't take away from you. 💅
          </p>
          <Button
            size="lg"
            className="h-16 px-10 text-lg font-black rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-2xl shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300"
            onClick={scrollToForm}
          >
            <Mail className="size-5" />
            Get Your Free Guide Now 💖
            <ArrowRight className="size-5" />
          </Button>
          <p className="text-xs text-muted-foreground">
            🛡️ 90-day money-back guarantee — literally zero risk, babe
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-pink-100 px-4 py-8 bg-white/40">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="size-4 text-pink-500 fill-pink-500" />
            <span className="font-black text-sm">Affiliate Baybe</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Made with 💕 for creators who want more freedom.
          </p>
        </div>
      </footer>
    </div>
  );
}
