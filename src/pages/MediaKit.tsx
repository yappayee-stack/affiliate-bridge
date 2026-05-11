import { Eye, Share2, Heart, Award, Globe, TrendingUp, Star, Zap, Mail } from "lucide-react";
import { useState } from "react";

const ROSE_GOLD = "#B76E79";
const ROSE_GOLD_LIGHT = "#D4A0A7";
const DARK = "#0A0A0A";
const DARK_CARD = "#141414";
const DARK_CARD_BORDER = "#222222";
const PINK_GLOW = "rgba(183, 110, 121, 0.15)";

function StatCard({ icon: Icon, value, label, delay }: { icon: any; value: string; label: string; delay: number }) {
  return (
    <div
      style={{
        background: DARK_CARD,
        border: `1px solid ${DARK_CARD_BORDER}`,
        borderRadius: 16,
        padding: "28px 20px",
        textAlign: "center",
        animation: `fadeUp 0.6s ease ${delay}s both`,
        transition: "transform 0.3s ease, border-color 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = ROSE_GOLD;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = DARK_CARD_BORDER;
      }}
    >
      <Icon size={28} color={ROSE_GOLD} style={{ marginBottom: 12 }} />
      <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1.5 }}>{label}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: 14,
      fontWeight: 700,
      color: ROSE_GOLD,
      textTransform: "uppercase",
      letterSpacing: 3,
      marginBottom: 24,
      textAlign: "center",
    }}>
      {children}
    </h2>
  );
}

function ServiceCard({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  return (
    <div style={{
      background: DARK_CARD,
      border: `1px solid ${DARK_CARD_BORDER}`,
      borderRadius: 14,
      padding: "24px",
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
    }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: PINK_GLOW,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon size={22} color={ROSE_GOLD} />
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{description}</div>
      </div>
    </div>
  );
}

function CollabType({ label }: { label: string }) {
  return (
    <span style={{
      display: "inline-block",
      background: PINK_GLOW,
      border: `1px solid rgba(183, 110, 121, 0.25)`,
      borderRadius: 50,
      padding: "10px 22px",
      fontSize: 14,
      fontWeight: 600,
      color: ROSE_GOLD_LIGHT,
      margin: 4,
    }}>
      {label}
    </span>
  );
}

export function MediaKit() {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: DARK,
      fontFamily: "'Inter', 'Montserrat', -apple-system, sans-serif",
      color: "#fff",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      {/* Hero Section */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        padding: "80px 20px 60px",
        textAlign: "center",
      }}>
        {/* Glow effect */}
        <div style={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${PINK_GLOW} 0%, transparent 70%)`,
          animation: "pulse 4s ease infinite",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo / Brand Mark */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${ROSE_GOLD}, ${ROSE_GOLD_LIGHT})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: 32,
            fontWeight: 900,
            color: "#fff",
            boxShadow: `0 0 40px ${PINK_GLOW}`,
          }}>
            AB
          </div>

          <h1 style={{
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: -1,
            marginBottom: 8,
            background: `linear-gradient(90deg, #fff, ${ROSE_GOLD_LIGHT}, #fff)`,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 4s linear infinite",
          }}>
            AFFILIATE BAYBE
          </h1>

          <p style={{
            fontSize: 16,
            fontWeight: 500,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 20,
          }}>
            Content Creator • Brand Builder • ER Nurse
          </p>

          <div style={{
            display: "inline-block",
            background: `linear-gradient(135deg, rgba(183,110,121,0.2), rgba(183,110,121,0.05))`,
            border: `1px solid rgba(183,110,121,0.3)`,
            borderRadius: 50,
            padding: "8px 20px",
            fontSize: 13,
            fontWeight: 600,
            color: ROSE_GOLD_LIGHT,
          }}>
            ✨ Top 1% Creator • Silver Badge
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "0 20px 50px",
      }}>
        <SectionTitle>By The Numbers</SectionTitle>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          marginBottom: 14,
        }}>
          <StatCard icon={Eye} value="7.5M+" label="Views" delay={0.1} />
          <StatCard icon={TrendingUp} value="4.9M" label="In 1 Month" delay={0.2} />
          <StatCard icon={Share2} value="47K+" label="Shares" delay={0.3} />
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
        }}>
          <StatCard icon={Zap} value="409K+" label="Tries" delay={0.4} />
          <StatCard icon={Heart} value="517K+" label="Likes" delay={0.5} />
          <StatCard icon={Globe} value="3" label="Platforms" delay={0.6} />
        </div>
      </div>

      {/* About Section */}
      <div style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "0 20px 50px",
      }}>
        <SectionTitle>About</SectionTitle>
        <div style={{
          background: DARK_CARD,
          border: `1px solid ${DARK_CARD_BORDER}`,
          borderRadius: 16,
          padding: "32px 28px",
          fontSize: 16,
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.7)",
        }}>
          <p style={{ marginBottom: 16 }}>
            ER/trauma nurse by day, content creator and brand builder by night. I built a real online business while working 12-hour hospital shifts — from a lipstick & skincare brand to digital products and done-for-you funnel services.
          </p>
          <p style={{ margin: 0 }}>
            My content covers affiliate marketing, TikTok Shop strategy, branding, and the real side of building a business from scratch. No fluff. No fake screenshots. Just real systems that work.
          </p>
        </div>
      </div>

      {/* Brands & Products */}
      <div style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "0 20px 50px",
      }}>
        <SectionTitle>Brands & Products</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <ServiceCard
            icon={Star}
            title="Baybe Beauty LLC"
            description="Lipstick, gloss & skincare line. Science-backed formulas with luxury branding."
          />
          <ServiceCard
            icon={Award}
            title="Creator Guide & Course"
            description="The Creator's Guide to Getting Paid Online — 6 chapters, 30-day action plan, affiliate marketing blueprint. Full course: 10 modules."
          />
          <ServiceCard
            icon={Zap}
            title="Viral Filter Guides"
            description="Effect House filter creation guides — from beginner to pro. Learn how to build beauty filters that hit millions of views. Free guide + paid courses."
          />
          <ServiceCard
            icon={TrendingUp}
            title="Done-For-You Funnel Service"
            description="Launch-ready business funnels built from scratch — bridge page, email sequence, payment system, and leads dashboard. $299."
          />
        </div>
      </div>

      {/* Platforms */}
      {/* Brand Partnerships */}
      <div style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "0 20px 50px",
      }}>
        <SectionTitle>Brand Partnerships</SectionTitle>
        <div style={{
          background: `linear-gradient(135deg, ${DARK_CARD} 0%, rgba(183,110,121,0.08) 100%)`,
          border: `1px solid ${ROSE_GOLD}`,
          borderRadius: 16,
          padding: "24px 20px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: ROSE_GOLD, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Official Creator Partner</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Modern Warships: Naval Battles</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>TikTok Spark Ads Campaign • 2026</div>
        </div>
      </div>

      <div style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "0 20px 50px",
      }}>
        <SectionTitle>Platforms</SectionTitle>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
        }}>
          {[
            { name: "TikTok", handle: "@affiliatebaybe", stat: "7.5M+ views" },
            { name: "YouTube", handle: "@affiliatebaybe", stat: "Shorts & Clips" },
            { name: "Pinterest", handle: "@affiliatebaybe", stat: "SEO Pins" },
          ].map((p) => (
            <div key={p.name} style={{
              background: DARK_CARD,
              border: `1px solid ${DARK_CARD_BORDER}`,
              borderRadius: 14,
              padding: "22px 16px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: ROSE_GOLD_LIGHT, marginBottom: 4 }}>{p.handle}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{p.stat}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Collaboration Types */}
      <div style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "0 20px 50px",
        textAlign: "center",
      }}>
        <SectionTitle>Open For</SectionTitle>
        <div>
          <CollabType label="Sponsored Content" />
          <CollabType label="Brand Partnerships" />
          <CollabType label="Affiliate Deals" />
          <CollabType label="Product Reviews" />
          <CollabType label="UGC Content" />
          <CollabType label="Ambassador Programs" />
        </div>
      </div>

      {/* Content Niches */}
      <div style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "0 20px 50px",
        textAlign: "center",
      }}>
        <SectionTitle>Content Niches</SectionTitle>
        <div>
          {["Affiliate Marketing", "Beauty & Skincare", "Side Hustles", "TikTok Shop", "Digital Products", "AI Tools", "Entrepreneurship", "Nursing Life"].map((niche) => (
            <span key={niche} style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 50,
              padding: "10px 20px",
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(255,255,255,0.6)",
              margin: 4,
            }}>
              {niche}
            </span>
          ))}
        </div>
      </div>

      {/* CTA / Contact */}
      <div style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "0 20px 80px",
        textAlign: "center",
      }}>
        <SectionTitle>Let's Work Together</SectionTitle>
        <div style={{
          background: `linear-gradient(135deg, rgba(183,110,121,0.15), rgba(183,110,121,0.05))`,
          border: `1px solid rgba(183,110,121,0.25)`,
          borderRadius: 20,
          padding: "40px 28px",
        }}>
          <p style={{
            fontSize: 18,
            fontWeight: 500,
            color: "rgba(255,255,255,0.7)",
            marginBottom: 28,
            lineHeight: 1.6,
          }}>
            Interested in collaborating? I'd love to hear from you.
          </p>
          <button
            onClick={() => setShowEmail(!showEmail)}
            style={{
              background: `linear-gradient(135deg, ${ROSE_GOLD}, ${ROSE_GOLD_LIGHT})`,
              border: "none",
              borderRadius: 50,
              padding: "16px 40px",
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
              boxShadow: `0 4px 20px rgba(183,110,121,0.3)`,
              transition: "transform 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <Mail size={18} />
            Get In Touch
          </button>
          {showEmail && (
            <div style={{
              marginTop: 20,
              fontSize: 16,
              color: ROSE_GOLD_LIGHT,
              animation: "fadeUp 0.3s ease",
            }}>
              📧 support@baybebeauty.com
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${DARK_CARD_BORDER}`,
        padding: "30px 20px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>
          Affiliate Baybe • Cute Content. Real Checks.
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          © 2026 Affiliate Baybe. All rights reserved.
        </div>
      </div>
    </div>
  );
}
