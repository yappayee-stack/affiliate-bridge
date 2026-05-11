import { useState, useRef, useEffect } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

/* ───── tiny reusable pieces ───── */

const PINK = "#E91E8C";
const GOLD = "#FFD700";

const sectionStyle: React.CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "0 24px",
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: "rgba(233,30,140,0.12)",
        color: PINK,
        fontSize: 11,
        fontWeight: 700,
        padding: "4px 12px",
        borderRadius: 20,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        marginBottom: 14,
        fontSize: 15,
        lineHeight: 1.5,
        color: "rgba(255,255,255,0.7)",
      }}
    >
      <span style={{ color: PINK, fontSize: 18, lineHeight: 1.3 }}>✓</span>
      <span>{children}</span>
    </div>
  );
}

/* ───── form field ───── */

function Field({
  label,
  sublabel,
  required,
  children,
}: {
  label: string;
  sublabel?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 700,
          color: "rgba(255,255,255,0.7)",
          marginBottom: 6,
          letterSpacing: "0.02em",
        }}
      >
        {label}
        {required && (
          <span style={{ color: PINK, marginLeft: 3 }}>*</span>
        )}
      </label>
      {sublabel && (
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            marginBottom: 6,
          }}
        >
          {sublabel}
        </div>
      )}
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "#1A1A1A",
  border: "1px solid #333",
  borderRadius: 8,
  color: "#FFF",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 80,
  resize: "vertical" as const,
};

/* ───── main component ───── */

export function Services() {
  const createCheckout = useAction(api.stripe.createCheckoutSession);
  const generateUploadUrl = useMutation(api.serviceRequests.generateUploadUrl);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState<Id<"_storage"> | null>(
    null
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Check if returning from Stripe payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "true") {
      setSubmitted(true);
      // Clean URL
      window.history.replaceState({}, "", "/services");
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await generateUploadUrl();
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      setUploadedFileId(storageId);
      setFileName(file.name);
    } catch {
      alert("Upload failed — try again");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const get = (k: string) => (fd.get(k) as string) || undefined;

    try {
      const result = await createCheckout({
        name: get("name") || "",
        email: get("email") || "",
        businessName: get("businessName"),
        whatTheySell: get("whatTheySell"),
        socialLinks: get("socialLinks"),
        currentSetup: get("currentSetup"),
        biggestStruggle: get("biggestStruggle"),
        goals: get("goals"),
        budget: get("budget"),
        brandColors: get("brandColors"),
        brandFont: get("brandFont"),
        contentNotes: get("contentNotes"),
        logoFileId: uploadedFileId ? String(uploadedFileId) : undefined,
      });
      // Redirect to Stripe Checkout
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      alert("Something went wrong — try again!");
      setSubmitting(false);
    }
  };

  /* ── success screen ── */
  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0A0A0A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Montserrat', sans-serif",
          padding: 24,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h1
            style={{
              color: "#FFF",
              fontSize: 28,
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            You're In!
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 16,
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            I got your info and I'll be reaching out within 24 hours to go over
            everything and get started on your funnel. Check your email!
          </p>
          <p
            style={{ color: PINK, fontWeight: 700, fontSize: 14 }}
          >
            — Affiliate Baybe 💕
          </p>
        </div>
      </div>
    );
  }

  /* ── main page ── */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        color: "#FFF",
        fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ── HERO ── */}
      <section
        style={{
          padding: "80px 24px 60px",
          textAlign: "center",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(233,30,140,0.12) 0%, transparent 60%)",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Badge>Done-For-You Funnels</Badge>
          <h1
            style={{
              fontSize: "clamp(28px, 6vw, 44px)",
              fontWeight: 900,
              lineHeight: 1.15,
              margin: "20px 0 16px",
            }}
          >
            Stop Going in Circles.
            <br />
            <span style={{ color: PINK }}>Let Me Build It For You.</span>
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.55)",
              maxWidth: 520,
              margin: "0 auto 32px",
            }}
          >
            If your dream is to start a business but you keep getting stuck —
            going in circles, no leads, getting overwhelmed and quitting — I was
            you. Now I build the whole thing so you don't have to.
          </p>
          <a
            href="#form"
            style={{
              display: "inline-block",
              background: PINK,
              color: "#FFF",
              padding: "16px 36px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
            }}
          >
            Get Your Funnel Built →
          </a>
        </div>
      </section>

      {/* ── STORY ── */}
      <section style={{ padding: "48px 24px 56px" }}>
        <div style={sectionStyle}>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.6)",
              borderLeft: `3px solid ${PINK}`,
              paddingLeft: 20,
              margin: "0 0 20px",
              fontStyle: "italic",
            }}
          >
            "I'm a full-time ER/trauma nurse. I tried to build an online
            business between 12-hour shifts. ChatGPT kept taking me in circles.
            I wasted months. I almost quit. Then I figured out the system that
            actually works — and now I build it for you."
          </p>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.4)",
              fontWeight: 600,
            }}
          >
            — Affiliate Baybe
          </p>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section style={{ padding: "48px 24px", background: "#0E0E0E" }}>
        <div style={sectionStyle}>
          <Badge>What You Get</Badge>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              margin: "16px 0 28px",
            }}
          >
            Your Complete{" "}
            <span style={{ color: PINK }}>Launch-Ready Funnel</span>
          </h2>

          <CheckItem>
            <strong>Custom landing / bridge page</strong> — designed to match
            your brand, optimized to capture emails
          </CheckItem>
          <CheckItem>
            <strong>Email capture system</strong> — connected, automated, ready
            to collect leads 24/7
          </CheckItem>
          <CheckItem>
            <strong>5 automated follow-up emails</strong> — written for your
            brand, scheduled to send over 8 days
          </CheckItem>
          <CheckItem>
            <strong>5 faceless promo videos</strong> — scroll-stopping content
            for TikTok, YouTube Shorts & Reels
          </CheckItem>
          <CheckItem>
            <strong>Pinterest pins</strong> — branded, SEO-optimized, ready to
            post
          </CheckItem>
          <CheckItem>
            <strong>Content calendar</strong> — 2 weeks of exactly what to post
            and when
          </CheckItem>
          <CheckItem>
            <strong>Leads dashboard</strong> — see every subscriber, every email
            sent, in real time
          </CheckItem>
          <CheckItem>
            <strong>Everything set up and ready to go</strong> — you just start
            posting
          </CheckItem>

          <div
            style={{
              marginTop: 32,
              padding: "20px 24px",
              background: "#1A1A1A",
              borderRadius: 12,
              border: "1px solid #333",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Launch-Ready Funnel
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: GOLD }}>
                $299
              </div>
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                maxWidth: 220,
                lineHeight: 1.5,
              }}
            >
              Everything above, built for your brand, delivered ready to launch.
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "56px 24px" }}>
        <div style={sectionStyle}>
          <Badge>How It Works</Badge>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              margin: "16px 0 32px",
            }}
          >
            3 Simple Steps
          </h2>

          {[
            {
              num: "01",
              title: "Fill out the form below",
              desc: "Tell me about your business, brand, and what you need. Upload your logo and colors.",
            },
            {
              num: "02",
              title: "I build everything",
              desc: "Your funnel, emails, videos, pins, calendar — all custom to your brand. Usually done in 48-72 hours.",
            },
            {
              num: "03",
              title: "You start posting",
              desc: "I hand you everything ready to go. You post the content, leads come in, emails sell for you.",
            },
          ].map((step) => (
            <div
              key={step.num}
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 28,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: PINK,
                  opacity: 0.5,
                  lineHeight: 1,
                  minWidth: 44,
                }}
              >
                {step.num}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.6,
                  }}
                >
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTAKE FORM ── */}
      <section
        id="form"
        style={{ padding: "56px 24px 80px", background: "#0E0E0E" }}
      >
        <div style={sectionStyle}>
          <Badge>Get Started</Badge>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              margin: "16px 0 8px",
            }}
          >
            Tell Me About Your Business
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 14,
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            Fill this out and I'll reach out within 24 hours to get started.
            The more details you give me, the better I can build your funnel.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <Field label="Your Name" required>
                <input
                  name="name"
                  required
                  placeholder="First & last name"
                  style={inputStyle}
                />
              </Field>
              <Field label="Email" required>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  style={inputStyle}
                />
              </Field>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <Field label="Business Name">
                <input
                  name="businessName"
                  placeholder="Your brand or business name"
                  style={inputStyle}
                />
              </Field>
              <Field label="What Do You Sell?">
                <input
                  name="whatTheySell"
                  placeholder="Products, services, courses..."
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field
              label="Social Media Links"
              sublabel="TikTok, Instagram, YouTube, etc."
            >
              <input
                name="socialLinks"
                placeholder="@yourhandle or paste links"
                style={inputStyle}
              />
            </Field>

            <Field
              label="What's Your Current Setup?"
              sublabel="Do you already have a website, email list, or social following? Or starting from zero?"
            >
              <textarea
                name="currentSetup"
                placeholder="Starting from scratch / I have a website but no funnel / etc."
                style={textareaStyle}
              />
            </Field>

            <Field label="What's Your Biggest Struggle Right Now?">
              <textarea
                name="biggestStruggle"
                placeholder="Getting leads, tech stuff, don't know where to start..."
                style={textareaStyle}
              />
            </Field>

            <Field label="What Are Your Goals?">
              <textarea
                name="goals"
                placeholder="I want to make $X/month, quit my 9-5, build a brand..."
                style={textareaStyle}
              />
            </Field>

            {/* Brand section */}
            <div
              style={{
                borderTop: "1px solid #222",
                marginTop: 12,
                paddingTop: 24,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: PINK,
                  marginBottom: 16,
                }}
              >
                🎨 Your Brand
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <Field
                  label="Brand Colors"
                  sublabel="E.g. pink & gold, black & white"
                >
                  <input
                    name="brandColors"
                    placeholder="Pink, gold, black..."
                    style={inputStyle}
                  />
                </Field>
                <Field
                  label="Brand Font"
                  sublabel="If you have one, otherwise we'll pick"
                >
                  <input
                    name="brandFont"
                    placeholder="Montserrat, Playfair, any..."
                    style={inputStyle}
                  />
                </Field>
              </div>

              <Field
                label="Logo / Brand Image"
                sublabel="Upload your logo, brand colors palette, or any image that shows your vibe"
              >
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: "2px dashed #333",
                    borderRadius: 10,
                    padding: "24px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}
                  onMouseOver={(e) =>
                    ((e.currentTarget.style.borderColor = PINK))
                  }
                  onMouseOut={(e) =>
                    ((e.currentTarget.style.borderColor = "#333"))
                  }
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                  {uploading ? (
                    <span
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: 14,
                      }}
                    >
                      Uploading...
                    </span>
                  ) : fileName ? (
                    <span style={{ color: PINK, fontSize: 14, fontWeight: 600 }}>
                      ✓ {fileName}
                    </span>
                  ) : (
                    <>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>📁</div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: 13,
                        }}
                      >
                        Click to upload logo or brand image
                      </div>
                    </>
                  )}
                </div>
              </Field>
            </div>

            {/* Content preferences */}
            <Field
              label="Anything Specific for Your Videos or Pins?"
              sublabel="Style preferences, specific text, colors, vibes — whatever you want"
            >
              <textarea
                name="contentNotes"
                placeholder="I want my videos to feel luxurious / I want bold text / use these colors..."
                style={textareaStyle}
              />
            </Field>

            <Field
              label="Budget"
              sublabel="The Launch-Ready Funnel is $299 — but let me know if you have questions"
            >
              <input
                name="budget"
                placeholder="$299 Launch-Ready Funnel"
                style={inputStyle}
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "16px",
                background: submitting ? "#666" : PINK,
                border: "none",
                borderRadius: 10,
                color: "#FFF",
                fontSize: 17,
                fontWeight: 800,
                cursor: submitting ? "default" : "pointer",
                marginTop: 8,
                fontFamily: "inherit",
                letterSpacing: "0.02em",
              }}
            >
              {submitting ? "Redirecting to Payment..." : "Pay $299 & Launch Your Funnel 🚀"}
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "rgba(255,255,255,0.25)",
                marginTop: 16,
              }}
            >
              Your info is private and only seen by me. No spam, ever.
            </p>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          textAlign: "center",
          padding: "32px 24px",
          fontSize: 12,
          color: "rgba(255,255,255,0.2)",
          fontWeight: 600,
        }}
      >
        @affiliatebaybe · Cute Content. Real Checks.
      </footer>
    </div>
  );
}
