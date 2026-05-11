import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const EMAIL_LABELS: Record<string, string> = {
  email1: "Welcome Email",
  email2: "Your Story (Day 2)",
  email3: "What's Inside (Day 4)",
  email4: "Why Email (Day 6)",
  email5: "Last Chance (Day 8)",
};

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function LoginGate({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <h1
          style={{
            color: "#FFF",
            fontSize: 24,
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          Dashboard Login
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 14,
            marginBottom: 28,
          }}
        >
          Enter your password to view leads & emails
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(pw);
          }}
          style={{ display: "flex", gap: 8 }}
        >
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            style={{
              flex: 1,
              padding: "12px 16px",
              background: "#1A1A1A",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#FFF",
              fontSize: 15,
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 24px",
              background: "#E91E8C",
              border: "none",
              borderRadius: 8,
              color: "#FFF",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div
      style={{
        background: "#141414",
        border: "1px solid #222",
        padding: "20px 24px",
        flex: 1,
        minWidth: 160,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 900,
          color: "#FFF",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            marginTop: 6,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function SequenceBar({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
            fontWeight: 600,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.35)",
            fontWeight: 500,
          }}
        >
          {count}/{total}
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: "#1A1A1A",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "linear-gradient(90deg, #E91E8C, #FF6BB5)",
            borderRadius: 4,
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

function VisitorSection({ password }: { password: string }) {
  const vStats = useQuery(api.visitors.getStats, { password });
  const visitors = useQuery(api.visitors.getAll, { password });
  const [showAll, setShowAll] = useState(false);

  if (!vStats || !visitors) return null;

  const displayVisitors = showAll ? visitors : visitors.slice(0, 20);

  return (
    <>
      {/* Visitor stat cards */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <StatCard
          label="Total Visits"
          value={vStats.totalVisits}
          sub="All time"
        />
        <StatCard
          label="Today"
          value={vStats.todayVisits}
          sub="Last 24h"
        />
        <StatCard
          label="This Week"
          value={vStats.weekVisits}
          sub="Last 7 days"
        />
        <StatCard
          label="Unique Visitors"
          value={vStats.uniqueIPs}
          sub="By IP"
        />
        <StatCard
          label="Today Unique"
          value={vStats.todayUniqueIPs}
          sub="Last 24h"
        />
      </div>

      {/* Breakdowns row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* Pages */}
        <div
          style={{
            background: "#141414",
            border: "1px solid #222",
            padding: "20px",
          }}
        >
          <h3
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            📄 Pages
          </h3>
          {vStats.pageBreakdown.map((p) => (
            <div
              key={p.page}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #1A1A1A",
                fontSize: 13,
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.7)" }}>
                {p.page}
              </span>
              <span style={{ color: "#E91E8C", fontWeight: 700 }}>
                {p.count}
              </span>
            </div>
          ))}
          {vStats.pageBreakdown.length === 0 && (
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
              No data yet
            </span>
          )}
        </div>

        {/* Sources */}
        <div
          style={{
            background: "#141414",
            border: "1px solid #222",
            padding: "20px",
          }}
        >
          <h3
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            🔗 Traffic Sources
          </h3>
          {vStats.sourceBreakdown.map((s) => (
            <div
              key={s.source}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #1A1A1A",
                fontSize: 13,
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.7)" }}>
                {s.source}
              </span>
              <span style={{ color: "#E91E8C", fontWeight: 700 }}>
                {s.count}
              </span>
            </div>
          ))}
          {vStats.sourceBreakdown.length === 0 && (
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
              No data yet
            </span>
          )}
        </div>

        {/* Devices */}
        <div
          style={{
            background: "#141414",
            border: "1px solid #222",
            padding: "20px",
          }}
        >
          <h3
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            📱 Devices
          </h3>
          {vStats.deviceBreakdown.map((d) => (
            <div
              key={d.device}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #1A1A1A",
                fontSize: 13,
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.7)" }}>
                {d.device}
              </span>
              <span style={{ color: "#E91E8C", fontWeight: 700 }}>
                {d.count}
              </span>
            </div>
          ))}
          {vStats.deviceBreakdown.length === 0 && (
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
              No data yet
            </span>
          )}
        </div>

        {/* Locations */}
        <div
          style={{
            background: "#141414",
            border: "1px solid #222",
            padding: "20px",
          }}
        >
          <h3
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            🌍 Locations
          </h3>
          {vStats.locationBreakdown.slice(0, 10).map((l) => (
            <div
              key={l.location}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #1A1A1A",
                fontSize: 13,
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.7)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "75%",
                }}
                title={l.location}
              >
                {l.location}
              </span>
              <span style={{ color: "#E91E8C", fontWeight: 700 }}>
                {l.count}
              </span>
            </div>
          ))}
          {vStats.locationBreakdown.length === 0 && (
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
              No data yet
            </span>
          )}
        </div>
      </div>

      {/* Recent visitors table */}
      <div
        style={{
          background: "#141414",
          border: "1px solid #222",
          padding: "24px",
          marginBottom: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
            Recent Visitors
          </h2>
          <span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              fontWeight: 600,
            }}
          >
            {visitors.length} tracked
          </span>
        </div>

        {visitors.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>👀</div>
            <p style={{ fontSize: 14 }}>
              No visitors tracked yet. Data will appear as people visit your
              site.
            </p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #333" }}>
                    {["IP Address", "Page", "Location", "Source", "Device", "When"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            padding: "10px 12px",
                            fontSize: 10,
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.35)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {displayVisitors.map((v) => (
                    <tr
                      key={v._id}
                      style={{ borderBottom: "1px solid #1F1F1F" }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          color: "#FFF",
                          fontWeight: 600,
                          fontFamily: "monospace",
                          fontSize: 12,
                        }}
                      >
                        {v.ip}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "rgba(255,255,255,0.6)",
                        }}
                      >
                        {v.page}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "rgba(255,255,255,0.5)",
                          fontSize: 12,
                        }}
                        title={[v.city, v.region, v.country].filter(Boolean).join(", ") || "Unknown"}
                      >
                        {v.city && v.region
                          ? `${v.city}, ${v.region}`
                          : v.city || v.region || v.country || "—"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 700,
                            background:
                              v.source === "tiktok"
                                ? "#25F4EE22"
                                : v.source === "pinterest"
                                  ? "#E6002322"
                                  : v.source === "youtube"
                                    ? "#FF000022"
                                    : "#FFFFFF11",
                            color:
                              v.source === "tiktok"
                                ? "#25F4EE"
                                : v.source === "pinterest"
                                  ? "#E60023"
                                  : v.source === "youtube"
                                    ? "#FF4444"
                                    : "rgba(255,255,255,0.4)",
                          }}
                        >
                          {v.source || "direct"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "rgba(255,255,255,0.4)",
                          fontSize: 12,
                        }}
                      >
                        {v.device === "mobile"
                          ? "📱"
                          : v.device === "tablet"
                            ? "📱"
                            : "💻"}{" "}
                        {v.device}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: 12,
                          }}
                          title={formatDate(v.visitedAt)}
                        >
                          {timeAgo(v.visitedAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visitors.length > 20 && !showAll && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button
                  onClick={() => setShowAll(true)}
                  style={{
                    background: "#1A1A1A",
                    border: "1px solid #333",
                    color: "#E91E8C",
                    padding: "8px 24px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Show all {visitors.length} visitors
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function DashboardContent({ password }: { password: string }) {
  const stats = useQuery(api.dashboard.getStats, { password });
  const leads = useQuery(api.dashboard.getAllLeads, { password });

  if (!stats || !leads) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0A0A0A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.4)",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

  const sortedLeads = [...leads].sort((a, b) => b.capturedAt - a.capturedAt);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        color: "#FFF",
        fontFamily:
          "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "32px 24px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
          borderBottom: "2px solid #E91E8C",
          paddingBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
            Affiliate{" "}
            <span style={{ color: "#E91E8C" }}>Baybe</span> Dashboard
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 13,
              marginTop: 4,
            }}
          >
            Leads, emails & funnel performance
          </p>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.3)",
            fontWeight: 600,
          }}
        >
          Live data &bull; Auto-refreshes
        </div>
      </div>

      {/* Link Directory */}
      <div
        style={{
          background: "#141414",
          border: "1px solid #222",
          padding: "24px",
          marginBottom: 32,
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 20,
            color: "#FFF",
          }}
        >
          🔗 Link Directory
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #333" }}>
                {["Link", "What It Is", "Where To Use It"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.35)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  url: "/free",
                  label: "Free Guide Capture Page",
                  use: "TikTok 2 bio (@affiliatebaybe), Beacons top link, Pinterest ebook pins",
                  highlight: true,
                },
                {
                  url: "/",
                  label: "Original Bridge Page (ebook $19)",
                  use: "Backup bridge — same funnel, different style",
                  highlight: false,
                },
                {
                  url: "/filters",
                  label: "Filter Guides ($29 / $59 / $79)",
                  use: "Beacons, Pinterest filter pins, TikTok filter content",
                  highlight: false,
                },
                {
                  url: "/services",
                  label: "Done-For-You Funnels ($299)",
                  use: "Beacons, DMs when someone asks about your service",
                  highlight: false,
                },
                {
                  url: "/mediakit",
                  label: "Media Kit",
                  use: "Brand deal replies — send to Samsung, sponsors, collabs",
                  highlight: false,
                },
                {
                  url: "/dashboard",
                  label: "This Dashboard",
                  use: "Your eyes only — leads, emails, analytics",
                  highlight: false,
                },
              ].map((link) => (
                <tr
                  key={link.url}
                  style={{
                    borderBottom: "1px solid #1F1F1F",
                    background: link.highlight ? "#1a0a14" : "transparent",
                  }}
                >
                  <td style={{ padding: "12px" }}>
                    <a
                      href={`https://affiliate-bridge-4a8f6373.viktor.space${link.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#E91E8C",
                        fontWeight: 700,
                        textDecoration: "none",
                        fontFamily: "monospace",
                        fontSize: 12,
                      }}
                    >
                      {link.url}
                    </a>
                    {link.highlight && (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 9,
                          background: "#E91E8C",
                          color: "#FFF",
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Main Link
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      color: "#FFF",
                      fontWeight: 600,
                    }}
                  >
                    {link.label}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 12,
                    }}
                  >
                    {link.use}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            background: "#0A0A0A",
            border: "1px solid #333",
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.8,
          }}
        >
          <strong style={{ color: "rgba(255,255,255,0.6)" }}>Quick reference:</strong><br />
          Base URL: <code style={{ color: "#E91E8C" }}>affiliate-bridge-4a8f6373.viktor.space</code><br />
          TikTok 1 bio → keep for TikTok Shop only (no changes)<br />
          TikTok 2 bio (@affiliatebaybe) → <code style={{ color: "#E91E8C" }}>/free</code><br />
          Pinterest profile link → <code style={{ color: "#E91E8C" }}>/free</code><br />
          Pinterest ebook pins → <code style={{ color: "#E91E8C" }}>/free</code> &nbsp;|&nbsp; filter pins → <code style={{ color: "#E91E8C" }}>/filters</code><br />
          YouTube descriptions → <code style={{ color: "#E91E8C" }}>/free</code> + Samsung affiliate link<br />
          Brand deal replies → <code style={{ color: "#E91E8C" }}>/mediakit</code>
        </div>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 32,
          flexWrap: "wrap",
        }}
      >
        <StatCard
          label="Total Leads"
          value={stats.totalLeads}
          sub="All time"
        />
        <StatCard
          label="This Week"
          value={stats.weekLeads}
          sub="Last 7 days"
        />
        <StatCard label="Today" value={stats.todayLeads} sub="Last 24h" />
        <StatCard
          label="Emails Sent"
          value={stats.emailsSentTotal}
          sub="Welcome + follow-ups"
        />
      </div>

      {/* Two columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 32,
        }}
      >
        {/* Email sequence funnel */}
        <div
          style={{
            background: "#141414",
            border: "1px solid #222",
            padding: "24px",
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 20,
              color: "#FFF",
            }}
          >
            Email Sequence Funnel
          </h2>
          {Object.entries(stats.sequenceCompletion).map(([key, count]) => (
            <SequenceBar
              key={key}
              label={EMAIL_LABELS[key] || key}
              count={count}
              total={stats.totalLeads}
            />
          ))}
          <p
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.25)",
              marginTop: 16,
            }}
          >
            Emails send automatically: Welcome → Day 2 → Day 4 → Day 6 → Day 8
          </p>
        </div>

        {/* Quick info */}
        <div
          style={{
            background: "#141414",
            border: "1px solid #222",
            padding: "24px",
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 20,
              color: "#FFF",
            }}
          >
            Funnel Overview
          </h2>
          <div style={{ fontSize: 14, lineHeight: 2, color: "rgba(255,255,255,0.55)" }}>
            <div>
              <span style={{ color: "#E91E8C", fontWeight: 700 }}>1.</span>{" "}
              TikTok / YouTube / Pinterest
            </div>
            <div style={{ paddingLeft: 18, fontSize: 18 }}>↓</div>
            <div>
              <span style={{ color: "#E91E8C", fontWeight: 700 }}>2.</span>{" "}
              Bridge Page (email capture)
            </div>
            <div style={{ paddingLeft: 18, fontSize: 18 }}>↓</div>
            <div>
              <span style={{ color: "#E91E8C", fontWeight: 700 }}>3.</span>{" "}
              Welcome Email (instant)
            </div>
            <div style={{ paddingLeft: 18, fontSize: 18 }}>↓</div>
            <div>
              <span style={{ color: "#E91E8C", fontWeight: 700 }}>4.</span>{" "}
              4 Follow-up Emails (over 8 days)
            </div>
            <div style={{ paddingLeft: 18, fontSize: 18 }}>↓</div>
            <div>
              <span style={{ color: "#E91E8C", fontWeight: 700 }}>5.</span>{" "}
              Sales Page ($19 course)
            </div>
          </div>
          <div
            style={{
              marginTop: 20,
              padding: "12px 16px",
              background: "#1a0a14",
              border: "1px solid #E91E8C33",
            }}
          >
            <div
              style={{ fontSize: 12, color: "#E91E8C", fontWeight: 700 }}
            >
              EMAIL ROI
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#FFD700" }}>
              $36–$40
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              return per $1 spent on email marketing
            </div>
          </div>
        </div>
      </div>

      {/* Leads table */}
      <div
        style={{
          background: "#141414",
          border: "1px solid #222",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
            All Leads
          </h2>
          <span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              fontWeight: 600,
            }}
          >
            {leads.length} total
          </span>
        </div>

        {sortedLeads.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 14 }}>
              No leads yet. Start posting content and driving traffic to your
              bridge page!
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #333",
                  }}
                >
                  {["Email", "Name", "Captured", "Source", "Emails Sent"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "10px 12px",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.35)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedLeads.map((lead) => {
                  const sentNums = (lead.emailsSent || []).map(
                    (e) => e.emailNumber
                  );
                  // Welcome email is always email 1
                  const allSent = [1, ...sentNums].sort();

                  return (
                    <tr
                      key={lead._id}
                      style={{ borderBottom: "1px solid #1F1F1F" }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          color: "#FFF",
                          fontWeight: 600,
                        }}
                      >
                        {lead.email}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "rgba(255,255,255,0.5)",
                        }}
                      >
                        {lead.name || "—"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: 12,
                          }}
                          title={formatDate(lead.capturedAt)}
                        >
                          {timeAgo(lead.capturedAt)}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "rgba(255,255,255,0.35)",
                          fontSize: 12,
                        }}
                      >
                        {lead.source || "bridge-page"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <div
                              key={n}
                              title={`Email ${n}: ${EMAIL_LABELS[`email${n}`]}${allSent.includes(n) ? " ✓" : " (pending)"}`}
                              style={{
                                width: 24,
                                height: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                fontWeight: 700,
                                borderRadius: 4,
                                background: allSent.includes(n)
                                  ? "#E91E8C"
                                  : "#1A1A1A",
                                color: allSent.includes(n)
                                  ? "#FFF"
                                  : "rgba(255,255,255,0.2)",
                                border: allSent.includes(n)
                                  ? "none"
                                  : "1px solid #333",
                              }}
                            >
                              {n}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Visitor Analytics Section */}
      <div
        style={{
          marginTop: 40,
          borderTop: "2px solid #E91E8C",
          paddingTop: 32,
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            marginBottom: 24,
            color: "#FFF",
          }}
        >
          👀 Visitor{" "}
          <span style={{ color: "#E91E8C" }}>Analytics</span>
        </h2>
        <VisitorSection password={password} />
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: 40,
          fontSize: 12,
          color: "rgba(255,255,255,0.2)",
          fontWeight: 600,
        }}
      >
        @affiliatebaybe &bull; Cute Content. Real Checks.
      </div>
    </div>
  );
}

export function Dashboard() {
  const [password, setPassword] = useState<string | null>(null);

  if (!password) {
    return <LoginGate onLogin={(pw) => setPassword(pw)} />;
  }

  return <DashboardContent password={password} />;
}
