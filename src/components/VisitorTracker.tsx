import { useEffect } from "react";

/**
 * Invisible component that tracks page visits.
 * Sends a POST to the Convex HTTP endpoint with page, referrer, and UTM params.
 * IP address is captured server-side from request headers.
 */
export function VisitorTracker() {
  useEffect(() => {
    // Generate or retrieve session ID
    let sessionId = sessionStorage.getItem("ab_sid");
    if (!sessionId) {
      sessionId = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
      sessionStorage.setItem("ab_sid", sessionId);
    }

    // Parse UTM source from URL params
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source") || params.get("src") || undefined;

    const trackingUrl = import.meta.env.VITE_CONVEX_URL
      ? import.meta.env.VITE_CONVEX_URL.replace(".cloud", ".site") + "/track"
      : "";

    if (!trackingUrl) return;

    // Fire and forget — don't block rendering
    fetch(trackingUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: window.location.pathname,
        referrer: document.referrer || "",
        source: utmSource,
        sessionId,
      }),
    }).catch(() => {
      // Silent fail — tracking should never break the site
    });
  }, []);

  return null;
}
