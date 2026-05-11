import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Filters() {
  const [view, setView] = useState<"capture" | "thankyou" | "sales">("capture");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const captureLead = useMutation(api.leads.capture);
  const sendFilterWelcome = useAction(api.sendFilterWelcome.send);
  const createFilterCheckout = useAction(api.filterStripe.createCheckoutSession);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await captureLead({ email, name: name || undefined, source: "filters" });
      // Send filter welcome email with free PDF
      sendFilterWelcome({ email, name: name || undefined }).catch(() => {});
      setView("thankyou");
      setTimeout(() => setView("sales"), 3000);
    } catch {
      // still show thankyou
      setView("thankyou");
      setTimeout(() => setView("sales"), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (product: "starter" | "pro" | "bundle") => {
    setCheckoutLoading(product);
    try {
      const result = await createFilterCheckout({ email, name, product });
      if (result.url) window.location.href = result.url;
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  // Bridge / Email Capture View
  if (view === "capture") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        {/* Glow */}
        <div style={{
          position: "fixed", top: "-20%", right: "-10%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "fixed", bottom: "-20%", left: "-10%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,165,116,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "520px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <p style={{
            fontWeight: 600, fontSize: "11px", letterSpacing: "0.16em",
            textTransform: "uppercase", color: "#ec4899", marginBottom: "20px",
          }}>FREE GUIDE · AFFILIATE BAYBE</p>

          <h1 style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
            fontSize: "clamp(32px, 7vw, 48px)", lineHeight: 1.05,
            letterSpacing: "-0.03em", marginBottom: "16px",
          }}>
            How I Got <span style={{ color: "#ec4899" }}>6.7M Views</span> With TikTok Filters
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.6)", fontSize: "15px",
            lineHeight: 1.6, marginBottom: "28px", maxWidth: "420px", margin: "0 auto 28px",
          }}>
            I hit Top 1% in Effect House while working 12-hour ER shifts. This free guide shows you exactly how filters work and how to publish your first one.
          </p>

          <div style={{
            display: "flex", gap: "10px", justifyContent: "center",
            flexWrap: "wrap", marginBottom: "32px",
          }}>
            {["🏆 Top 1% Creator", "🥈 Silver Badge", "👁️ 6.7M Views"].map(b => (
              <span key={b} style={{
                background: "#141414", border: "1px solid rgba(236,72,153,0.25)",
                padding: "6px 14px", fontSize: "12px", fontWeight: 600,
              }}>{b}</span>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{
            background: "#141414", padding: "28px", textAlign: "left",
          }}>
            <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "16px" }}>
              📩 Get the free guide instantly:
            </p>
            <input
              type="text"
              placeholder="Your first name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px", background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)", color: "#fff",
                fontSize: "14px", marginBottom: "10px", outline: "none",
                boxSizing: "border-box",
              }}
            />
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px", background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)", color: "#fff",
                fontSize: "14px", marginBottom: "14px", outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px", border: "none",
                background: "linear-gradient(135deg, #ec4899, #f472b6)",
                color: "#fff", fontWeight: 700, fontSize: "15px",
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Sending..." : "Send Me the Free Guide →"}
            </button>
            <p style={{
              fontSize: "11px", color: "rgba(255,255,255,0.3)",
              textAlign: "center", marginTop: "10px",
            }}>
              No spam. Unsubscribe anytime.
            </p>
          </form>

          <p style={{
            fontSize: "11px", color: "rgba(255,255,255,0.2)",
            marginTop: "40px",
          }}>
            © 2026 Affiliate Baybe
          </p>
        </div>
      </div>
    );
  }

  // Thank You View (brief)
  if (view === "thankyou") {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0a", color: "#fff",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "40px 20px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <p style={{ fontSize: "48px", marginBottom: "16px" }}>✨</p>
          <h2 style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
            fontSize: "28px", marginBottom: "12px",
          }}>Check Your Inbox!</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: 1.6 }}>
            Your free filter guide is on its way. While you wait — check out the full system below...
          </p>
        </div>
      </div>
    );
  }

  // Sales Page View
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#fff",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Glows */}
      <div style={{
        position: "fixed", top: "-20%", right: "-10%",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "60px 20px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{
            fontWeight: 600, fontSize: "11px", letterSpacing: "0.16em",
            textTransform: "uppercase", color: "#ec4899", marginBottom: "16px",
          }}>AFFILIATE BAYBE · FILTER GUIDES</p>
          <h1 style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 6vw, 40px)", lineHeight: 1.1,
            letterSpacing: "-0.03em", marginBottom: "12px",
          }}>
            Learn the System Behind <span style={{ color: "#ec4899" }}>6.7M Views</span>
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: 1.6,
            maxWidth: "480px", margin: "0 auto",
          }}>
            From Effect House beginner to viral filter creator. Step-by-step guides from a Top 1% creator who built it all working ER shifts.
          </p>
        </div>

        {/* Stats Bar */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "24px",
          flexWrap: "wrap", marginBottom: "48px",
        }}>
          {[
            { num: "6.7M", label: "Views" },
            { num: "Top 1%", label: "Rank" },
            { num: "483K", label: "Likes" },
            { num: "44K", label: "Shares" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
                fontSize: "24px", color: "#ec4899",
              }}>{s.num}</div>
              <div style={{
                fontSize: "10px", color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "2px",
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Product Cards */}
        {/* Starter */}
        <div style={{
          background: "#141414", padding: "32px", marginBottom: "16px",
          border: "1px solid rgba(236,72,153,0.2)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{
                fontWeight: 600, fontSize: "11px", letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#ec4899", marginBottom: "6px",
              }}>STARTER PACK</p>
              <h3 style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
                fontSize: "22px",
              }}>Filter Foundations</h3>
            </div>
            <div style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
              fontSize: "28px", color: "#ec4899",
            }}>$29</div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.7, marginBottom: "16px" }}>
            The complete beginner's guide. Go from never opening Effect House to publishing your first TikTok filter.
          </p>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 2 }}>
            ✓ Setting up Effect House &amp; interface walkthrough<br/>
            ✓ Build your first filter step-by-step<br/>
            ✓ Face tracking basics &amp; materials<br/>
            ✓ Testing, publishing &amp; what gets approved<br/>
            ✓ Bonus: 5 filter ideas to build this week
          </div>
          <button
            onClick={() => handleCheckout("starter")}
            disabled={!!checkoutLoading}
            style={{
              width: "100%", marginTop: "20px", padding: "14px", border: "none",
              background: checkoutLoading === "starter" ? "#666" : "#ec4899",
              color: "#fff", fontWeight: 700, fontSize: "14px",
              cursor: checkoutLoading ? "wait" : "pointer",
            }}
          >
            {checkoutLoading === "starter" ? "Loading..." : "Get Filter Foundations — $29"}
          </button>
        </div>

        {/* Pro */}
        <div style={{
          background: "#141414", padding: "32px", marginBottom: "16px",
          border: "1px solid rgba(212,165,116,0.3)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{
                fontWeight: 600, fontSize: "11px", letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#d4a574", marginBottom: "6px",
              }}>PRO PACK</p>
              <h3 style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
                fontSize: "22px",
              }}>Viral Filter Secrets</h3>
            </div>
            <div style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
              fontSize: "28px", color: "#d4a574",
            }}>$59</div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.7, marginBottom: "16px" }}>
            The advanced playbook. Learn the exact techniques and strategy behind 6.7M views and Top 1% rank.
          </p>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 2 }}>
            ✓ Anatomy of a viral filter (the 3 elements)<br/>
            ✓ Advanced layering — 60+ layer architecture<br/>
            ✓ Custom GAN &amp; makeup overrides<br/>
            ✓ Visual scripting for interactive filters<br/>
            ✓ Performance optimization secrets<br/>
            ✓ The viral launch playbook &amp; algorithm strategy<br/>
            ✓ Bonus: Complete filter launch checklist
          </div>
          <button
            onClick={() => handleCheckout("pro")}
            disabled={!!checkoutLoading}
            style={{
              width: "100%", marginTop: "20px", padding: "14px", border: "none",
              background: checkoutLoading === "pro" ? "#666" : "#d4a574",
              color: "#0a0a0a", fontWeight: 700, fontSize: "14px",
              cursor: checkoutLoading ? "wait" : "pointer",
            }}
          >
            {checkoutLoading === "pro" ? "Loading..." : "Get Viral Filter Secrets — $59"}
          </button>
        </div>

        {/* Bundle */}
        <div style={{
          background: "linear-gradient(135deg, rgba(236,72,153,0.08), rgba(212,165,116,0.08))",
          padding: "32px", marginBottom: "48px",
          border: "2px solid rgba(236,72,153,0.4)",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: "-12px", left: "24px",
            background: "linear-gradient(135deg, #ec4899, #d4a574)",
            color: "#fff", fontWeight: 700, fontSize: "11px",
            letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "4px 14px",
          }}>🔥 BEST VALUE</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", marginTop: "4px" }}>
            <div>
              <h3 style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
                fontSize: "22px",
              }}>Complete Bundle</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "4px" }}>
                Both guides — everything you need
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{
                textDecoration: "line-through", color: "rgba(255,255,255,0.3)",
                fontSize: "16px", marginRight: "8px",
              }}>$88</span>
              <span style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
                fontSize: "32px", color: "#ec4899",
              }}>$79</span>
            </div>
          </div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 2, marginBottom: "4px" }}>
            ✓ Everything in Filter Foundations<br/>
            ✓ Everything in Viral Filter Secrets<br/>
            ✓ Save $9 — go from zero to viral in one shot
          </div>
          <button
            onClick={() => handleCheckout("bundle")}
            disabled={!!checkoutLoading}
            style={{
              width: "100%", marginTop: "20px", padding: "16px", border: "none",
              background: checkoutLoading === "bundle" ? "#666" : "linear-gradient(135deg, #ec4899, #d4a574)",
              color: "#fff", fontWeight: 700, fontSize: "15px",
              cursor: checkoutLoading ? "wait" : "pointer",
            }}
          >
            {checkoutLoading === "bundle" ? "Loading..." : "Get Both Guides — $79 (Save $9)"}
          </button>
        </div>

        {/* Social Proof */}
        <div style={{
          background: "#141414", padding: "24px", marginBottom: "32px",
          borderLeft: "3px solid #ec4899",
        }}>
          <p style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>
            "I built these filters while working full-time as an ER/trauma nurse. No film crew, no fancy equipment. Just Effect House, my phone, and a system that works. If I can hit 6.7M views between 12-hour shifts, you can too."
          </p>
          <p style={{ fontSize: "12px", color: "#ec4899", marginTop: "8px", fontWeight: 600 }}>
            — Affiliate Baybe · Top 1% Effect House Creator
          </p>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center", fontSize: "11px",
          color: "rgba(255,255,255,0.2)", paddingBottom: "40px",
        }}>
          © 2026 Affiliate Baybe · affiliatebaybe.com
        </p>
      </div>
    </div>
  );
}
