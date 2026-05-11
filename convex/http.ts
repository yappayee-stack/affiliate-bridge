import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

declare const process: { env: Record<string, string | undefined> };

const http = httpRouter();
auth.addHttpRoutes(http);

// Visitor tracking endpoint — captures IP server-side
http.route({
  path: "/track",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    try {
      const body = await request.json();

      // Get IP from headers (Convex sits behind a proxy)
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-real-ip") ||
        "unknown";

      const userAgent = request.headers.get("user-agent") || undefined;

      // Parse device from user agent
      let device = "desktop";
      if (userAgent) {
        const ua = userAgent.toLowerCase();
        if (/iphone|android.*mobile|windows phone/.test(ua)) device = "mobile";
        else if (/ipad|android(?!.*mobile)|tablet/.test(ua)) device = "tablet";
      }

      // Parse UTM source
      let source = body.source || undefined;
      if (!source && body.referrer) {
        const ref = body.referrer.toLowerCase();
        if (ref.includes("tiktok")) source = "tiktok";
        else if (ref.includes("pinterest")) source = "pinterest";
        else if (ref.includes("youtube")) source = "youtube";
        else if (ref.includes("google")) source = "google";
        else if (ref.includes("t.co") || ref.includes("twitter")) source = "twitter";
        else if (ref.length > 0) source = "referral";
      }

      // Geo lookup via ip-api.com (free, no key needed)
      let city: string | undefined;
      let region: string | undefined;
      let country: string | undefined;
      try {
        if (ip && ip !== "unknown") {
          const geoRes = await fetch(
            `http://ip-api.com/json/${ip}?fields=status,city,regionName,country`
          );
          if (geoRes.ok) {
            const geo = await geoRes.json();
            if (geo.status === "success") {
              city = geo.city || undefined;
              region = geo.regionName || undefined;
              country = geo.country || undefined;
            }
          }
        }
      } catch {
        // Geo lookup failed — continue without it
      }

      await ctx.runMutation(internal.visitors.logVisitInternal, {
        ip,
        page: body.page || "/",
        referrer: body.referrer || undefined,
        userAgent: userAgent || undefined,
        device,
        source: source || "direct",
        sessionId: body.sessionId || undefined,
        city,
        region,
        country,
      });

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch {
      return new Response(JSON.stringify({ ok: false }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }),
});

// CORS preflight for tracking
http.route({
  path: "/track",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }),
});

// Stripe webhook — called when payment completes
http.route({
  path: "/stripe-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text();
    let event;

    try {
      event = JSON.parse(body);
    } catch {
      return new Response("Invalid payload", { status: 400 });
    }

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata || {};
      const requestId = metadata.requestId;
      const amountPaid = session.amount_total || 29900;

      // Mark as paid in database
      if (requestId) {
        await ctx.runMutation(internal.stripe.markPaid, {
          requestId,
          stripeSessionId: session.id,
          amountPaid,
        });
      }

      // Send notification email
      await ctx.runAction(internal.stripe.notifyPayment, {
        name: metadata.name || "Unknown",
        email: metadata.email || session.customer_email || "unknown",
        businessName: metadata.businessName || "Not specified",
        amountPaid,
      });

      // Also send the full intake notification
      await ctx.runAction(internal.serviceRequests.notifyOwner, {
        name: metadata.name || "Unknown",
        email: metadata.email || session.customer_email || "unknown",
        businessName: metadata.businessName || "Not specified",
        whatTheySell: "See dashboard for details",
        socialLinks: "See dashboard for details",
        currentSetup: "See dashboard for details",
        biggestStruggle: "See dashboard for details",
        goals: "See dashboard for details",
        budget: "$299 — PAID ✅",
        brandColors: "See dashboard for details",
        brandFont: "See dashboard for details",
      });
    }

    return new Response("ok", { status: 200 });
  }),
});

export default http;
