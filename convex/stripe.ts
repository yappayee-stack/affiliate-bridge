import { v } from "convex/values";
import { action, internalMutation, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

declare const process: { env: Record<string, string | undefined> };

// Create a Stripe Checkout Session for the $299 funnel service
export const createCheckoutSession = action({
  args: {
    name: v.string(),
    email: v.string(),
    businessName: v.optional(v.string()),
    whatTheySell: v.optional(v.string()),
    socialLinks: v.optional(v.string()),
    currentSetup: v.optional(v.string()),
    biggestStruggle: v.optional(v.string()),
    goals: v.optional(v.string()),
    budget: v.optional(v.string()),
    brandColors: v.optional(v.string()),
    brandFont: v.optional(v.string()),
    contentNotes: v.optional(v.string()),
    logoFileId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const stripeKey = process.env.STRIPE_SECRET_KEY || "STRIPE_KEY_SET_IN_ENV";
    if (!stripeKey) throw new Error("Stripe not configured");

    const siteUrl = process.env.SITE_URL || "https://affiliate-bridge-4a8f6373.viktor.space";

    // Save the service request first (as pending)
    const requestId = await ctx.runMutation(internal.stripe.saveServiceRequest, {
      name: args.name,
      email: args.email,
      businessName: args.businessName,
      whatTheySell: args.whatTheySell,
      socialLinks: args.socialLinks,
      currentSetup: args.currentSetup,
      biggestStruggle: args.biggestStruggle,
      goals: args.goals,
      budget: args.budget,
      brandColors: args.brandColors,
      brandFont: args.brandFont,
      contentNotes: args.contentNotes,
    });

    // Create Stripe Checkout Session via REST API
    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("payment_method_types[0]", "card");
    params.append("line_items[0][price_data][currency]", "usd");
    params.append("line_items[0][price_data][product_data][name]", "Launch-Ready Business Funnel");
    params.append(
      "line_items[0][price_data][product_data][description]",
      "Custom landing page, email capture, 5 follow-up emails, faceless videos, Pinterest pins, content calendar & leads dashboard — all branded to YOUR business."
    );
    params.append("line_items[0][price_data][unit_amount]", "29900"); // $299.00
    params.append("line_items[0][quantity]", "1");
    params.append("customer_email", args.email);
    params.append("success_url", `${siteUrl}/services?paid=true&session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${siteUrl}/services?canceled=true`);
    params.append("metadata[requestId]", requestId);
    params.append("metadata[name]", args.name);
    params.append("metadata[email]", args.email);
    params.append("metadata[businessName]", args.businessName || "");

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(stripeKey + ":")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Stripe error:", err);
      throw new Error("Payment setup failed. Please try again.");
    }

    const session = await res.json();
    return { url: session.url, sessionId: session.id };
  },
});

// Save service request as pending payment
export const saveServiceRequest = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    businessName: v.optional(v.string()),
    whatTheySell: v.optional(v.string()),
    socialLinks: v.optional(v.string()),
    currentSetup: v.optional(v.string()),
    biggestStruggle: v.optional(v.string()),
    goals: v.optional(v.string()),
    budget: v.optional(v.string()),
    brandColors: v.optional(v.string()),
    brandFont: v.optional(v.string()),
    contentNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("serviceRequests", {
      ...args,
      submittedAt: Date.now(),
      status: "pending_payment",
    });
    return id;
  },
});

// Mark payment as complete
export const markPaid = internalMutation({
  args: {
    requestId: v.string(),
    stripeSessionId: v.string(),
    amountPaid: v.number(),
  },
  handler: async (ctx, args) => {
    // Find the service request by ID
    const allRequests = await ctx.db.query("serviceRequests").collect();
    const req = allRequests.find((r) => r._id === args.requestId);
    if (req) {
      await ctx.db.patch(req._id, {
        status: "paid",
      });
    }
  },
});

// Send notification after payment
export const notifyPayment = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
    businessName: v.string(),
    amountPaid: v.number(),
  },
  returns: v.null(),
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY || process.env.RESEND_API_KEY!;
    if (!apiKey) return null;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">💰 Payment Received — $${(args.amountPaid / 100).toFixed(2)}</h1>
        </div>
        <div style="border: 1px solid #eee; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px;"><strong>${args.name}</strong> just paid for a Launch-Ready Business Funnel!</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 8px; font-weight: 600; color: #888;">Email</td>
              <td style="padding: 12px 8px;"><a href="mailto:${args.email}">${args.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 8px; font-weight: 600; color: #888;">Business</td>
              <td style="padding: 12px 8px;">${args.businessName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 8px; font-weight: 600; color: #888;">Amount</td>
              <td style="padding: 12px 8px; color: #10b981; font-weight: 700; font-size: 18px;">$${(args.amountPaid / 100).toFixed(2)}</td>
            </tr>
          </table>
          <p style="margin-top: 16px; font-size: 14px; color: #666;">
            Check your <a href="https://affiliate-bridge-4a8f6373.viktor.space/dashboard">dashboard</a> for their full intake details.
          </p>
        </div>
      </div>
    `;

    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Affiliate Baybe <support@baybebeauty.com>",
          to: ["support@baybebeauty.com"],
          subject: `💰 $${(args.amountPaid / 100).toFixed(2)} Payment — ${args.name} (${args.businessName})`,
          html,
        }),
      });
    } catch (e) {
      console.error("Payment notification error:", e);
    }

    return null;
  },
});
