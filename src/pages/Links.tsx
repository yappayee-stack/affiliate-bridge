import { ExternalLink, Sparkles, BookOpen, Palette, Briefcase, BarChart3, ChevronRight, Play } from "lucide-react";

const ROSE_GOLD = "#B76E79";
const ROSE_GOLD_LIGHT = "#D4A0A7";
const DARK = "#0A0A0A";
const DARK_CARD = "#141414";
const DARK_CARD_BORDER = "#222222";
const PINK_GLOW = "rgba(183, 110, 121, 0.15)";

const AFFILIATE_SALES_PAGE = "https://affbaylanding-dmqrqdof.manus.space/";

interface LinkItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  href: string;
  gradient?: boolean;
  delay: number;
}

function LinkItem({ icon, title, subtitle, badge, href, gradient, delay }: LinkItemProps) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "18px 20px",
        background: gradient
          ? `linear-gradient(135deg, rgba(183,110,121,0.2), rgba(183,110,121,0.08))`
          : DARK_CARD,
        border: `1px solid ${gradient ? "rgba(183,110,121,0.35)" : DARK_CARD_BORDER}`,
        borderRadius: 16,
        textDecoration: "none",
        color: "#fff",
        transition: "all 0.3s ease",
        animation: `fadeUp 0.5s ease ${delay}s both`,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
        e.currentTarget.style.borderColor = ROSE_GOLD;
        e.currentTarget.style.boxShadow = `0 8px 30px rgba(183,110,121,0.2)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.borderColor = gradient ? "rgba(183,110,121,0.35)" : DARK_CARD_BORDER;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: gradient ? "rgba(183,110,121,0.25)" : PINK_GLOW,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 16,
          fontWeight: 700,
          lineHeight: 1.3,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}>
          {title}
          {badge && (
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${ROSE_GOLD}, ${ROSE_GOLD_LIGHT})`,
              color: "#fff",
              padding: "3px 10px",
              borderRadius: 50,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 3, fontWeight: 500 }}>
            {subtitle}
          </div>
        )}
      </div>
      <ChevronRight size={18} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
    </a>
  );
}

function SocialButton({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "16px 12px",
        background: DARK_CARD,
        border: `1px solid ${DARK_CARD_BORDER}`,
        borderRadius: 14,
        textDecoration: "none",
        color: "rgba(255,255,255,0.6)",
        fontSize: 12,
        fontWeight: 600,
        transition: "all 0.3s ease",
        flex: 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = ROSE_GOLD;
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = DARK_CARD_BORDER;
        e.currentTarget.style.color = "rgba(255,255,255,0.6)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <span style={{ fontSize: 24 }}>{icon}</span>
      {label}
    </a>
  );
}

export function Links() {
  return (
    <div style={{
      minHeight: "100vh",
      background: DARK,
      fontFamily: "'Inter', 'Montserrat', -apple-system, sans-serif",
      color: "#fff",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "0 16px",
      }}>
        {/* ─── Hero / Profile ─── */}
        <div style={{
          position: "relative",
          textAlign: "center",
          paddingTop: 56,
          paddingBottom: 32,
          overflow: "hidden",
        }}>
          {/* Glow */}
          <div style={{
            position: "absolute",
            top: -60,
            left: "50%",
            transform: "translateX(-50%)",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${PINK_GLOW} 0%, transparent 70%)`,
            animation: "pulse 4s ease infinite",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Avatar */}
            <div style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${ROSE_GOLD}, ${ROSE_GOLD_LIGHT})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
              fontSize: 34,
              fontWeight: 900,
              color: "#fff",
              boxShadow: `0 0 50px rgba(183,110,121,0.3)`,
              animation: "fadeUp 0.4s ease both, float 6s ease infinite",
            }}>
              AB
            </div>

            <h1 style={{
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: -0.5,
              marginBottom: 6,
              background: `linear-gradient(90deg, #fff, ${ROSE_GOLD_LIGHT}, #fff)`,
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
            }}>
              AFFILIATE BAYBE
            </h1>

            <p style={{
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              margin: "0 0 14px",
            }}>
              Creator • Brand Builder • ER Nurse
            </p>

            {/* Stats strip */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: 6,
              flexWrap: "wrap",
              animation: "fadeUp 0.5s ease 0.2s both",
            }}>
              <span style={{
                background: `linear-gradient(135deg, rgba(183,110,121,0.2), rgba(183,110,121,0.08))`,
                border: `1px solid rgba(183,110,121,0.3)`,
                borderRadius: 50,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                color: ROSE_GOLD_LIGHT,
              }}>
                ✨ 7.3M+ Views
              </span>
              <span style={{
                background: `linear-gradient(135deg, rgba(183,110,121,0.2), rgba(183,110,121,0.08))`,
                border: `1px solid rgba(183,110,121,0.3)`,
                borderRadius: 50,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                color: ROSE_GOLD_LIGHT,
              }}>
                🏆 Top 1% Creator
              </span>
              <span style={{
                background: `linear-gradient(135deg, rgba(183,110,121,0.2), rgba(183,110,121,0.08))`,
                border: `1px solid rgba(183,110,121,0.3)`,
                borderRadius: 50,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                color: ROSE_GOLD_LIGHT,
              }}>
                💅 506K+ Likes
              </span>
            </div>
          </div>
        </div>

        {/* ─── Featured / Free ─── */}
        <div style={{ marginBottom: 10 }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: ROSE_GOLD,
            textTransform: "uppercase",
            letterSpacing: 2.5,
            marginBottom: 12,
            paddingLeft: 4,
          }}>
            ✨ Start Here
          </div>
          <LinkItem
            icon={<Sparkles size={22} color={ROSE_GOLD} />}
            title="Free Filter Guide"
            subtitle="Learn how I got 5.7M views on one filter"
            badge="Free"
            href="/filters"
            gradient={true}
            delay={0.1}
          />
        </div>

        {/* ─── Featured Video ─── */}
        <div style={{ marginTop: 24 }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: ROSE_GOLD,
            textTransform: "uppercase",
            letterSpacing: 2.5,
            marginBottom: 12,
            paddingLeft: 4,
          }}>
            🎬 Featured Video
          </div>
          <a
            href="https://www.youtube.com/watch?v=UUVIYhGxKK0"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid rgba(183,110,121,0.35)`,
              background: DARK_CARD,
              textDecoration: "none",
              color: "#fff",
              transition: "all 0.3s ease",
              animation: "fadeUp 0.5s ease 0.12s both",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(183,110,121,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{
              position: "relative",
              paddingBottom: "56.25%",
              background: "#000",
            }}>
              <img
                src="https://img.youtube.com/vi/UUVIYhGxKK0/hqdefault.jpg"
                alt="I Built 6 Figures...but where's the proof?"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(183,110,121,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}>
                <Play size={26} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
              </div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
                "I Built 6 Figures...but where's the proof?"
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
                Watch on YouTube • Full story
              </div>
            </div>
          </a>
        </div>

        {/* ─── Products ─── */}
        <div style={{ marginTop: 24 }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            letterSpacing: 2.5,
            marginBottom: 12,
            paddingLeft: 4,
          }}>
            Products
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <LinkItem
              icon={<BookOpen size={22} color={ROSE_GOLD} />}
              title="Creator's Guide Ebook"
              subtitle="Affiliate marketing blueprint — 6 chapters + workbook"
              badge="$19"
              href={AFFILIATE_SALES_PAGE}
              delay={0.15}
            />
            <LinkItem
              icon={<Palette size={22} color={ROSE_GOLD} />}
              title="Filter Mastery Guides"
              subtitle="Build viral beauty filters from scratch"
              badge="From $29"
              href="/filters"
              delay={0.2}
            />
            <LinkItem
              icon={<Briefcase size={22} color={ROSE_GOLD} />}
              title="Done-For-You Funnel"
              subtitle="Bridge page, emails, payments — all built for you"
              badge="$299"
              href="/services"
              delay={0.25}
            />
          </div>
        </div>

        {/* ─── More ─── */}
        <div style={{ marginTop: 24 }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            letterSpacing: 2.5,
            marginBottom: 12,
            paddingLeft: 4,
          }}>
            More
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <LinkItem
              icon={<BarChart3 size={22} color={ROSE_GOLD} />}
              title="Media Kit"
              subtitle="Stats, brands, collaboration info"
              href="/mediakit"
              delay={0.3}
            />
            <LinkItem
              icon={<ExternalLink size={22} color={ROSE_GOLD} />}
              title="Baybe Beauty"
              subtitle="Lipstick, gloss & skincare — Science • Skin • Results"
              href="https://baybebeauty-yyftpvke.manus.space/"
              delay={0.35}
            />
          </div>
        </div>

        {/* ─── Socials ─── */}
        <div style={{ marginTop: 32 }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            letterSpacing: 2.5,
            marginBottom: 12,
            paddingLeft: 4,
            textAlign: "center",
          }}>
            Follow Me
          </div>
          <div style={{
            display: "flex",
            gap: 10,
            animation: "fadeUp 0.5s ease 0.4s both",
          }}>
            <SocialButton
              href="https://www.tiktok.com/@affiliatebaybe"
              label="TikTok"
              icon="🎵"
            />
            <SocialButton
              href="https://www.youtube.com/@affiliatebaybe"
              label="YouTube"
              icon="▶️"
            />
            <SocialButton
              href="https://www.pinterest.com/affiliatebaybe"
              label="Pinterest"
              icon="📌"
            />
          </div>
        </div>

        {/* ─── Tagline ─── */}
        <div style={{
          textAlign: "center",
          padding: "40px 0 20px",
          animation: "fadeUp 0.5s ease 0.5s both",
        }}>
          <p style={{
            fontSize: 15,
            fontWeight: 600,
            color: ROSE_GOLD_LIGHT,
            fontStyle: "italic",
            marginBottom: 4,
          }}>
            "Cute Content. Real Checks."
          </p>
          <p style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.2)",
          }}>
            © 2026 Affiliate Baybe
          </p>
        </div>
      </div>
    </div>
  );
}
