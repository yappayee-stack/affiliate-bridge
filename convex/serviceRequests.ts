import { v } from "convex/values";
import { mutation, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

declare const process: { env: Record<string, string | undefined> };

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const submit = mutation({
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
    logoFileId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("serviceRequests", {
      ...args,
      submittedAt: Date.now(),
      status: "new",
    });

    // Send notification email to owner
    await ctx.scheduler.runAfter(0, internal.serviceRequests.notifyOwner, {
      name: args.name,
      email: args.email,
      businessName: args.businessName || "Not specified",
      whatTheySell: args.whatTheySell || "Not specified",
      socialLinks: args.socialLinks || "Not specified",
      currentSetup: args.currentSetup || "Not specified",
      biggestStruggle: args.biggestStruggle || "Not specified",
      goals: args.goals || "Not specified",
      budget: args.budget || "Not specified",
      brandColors: args.brandColors || "Not specified",
      brandFont: args.brandFont || "Not specified",
    });

    return id;
  },
});

export const notifyOwner = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
    businessName: v.string(),
    whatTheySell: v.string(),
    socialLinks: v.string(),
    currentSetup: v.string(),
    biggestStruggle: v.string(),
    goals: v.string(),
    budget: v.string(),
    brandColors: v.string(),
    brandFont: v.string(),
  },
  returns: v.null(),
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY || process.env.RESEND_API_KEY!;
    if (!apiKey) {
      console.error("RESEND_API_KEY not configured");
      return null;
    }

    const row = (label: string, value: string, highlight = false) => `
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 12px 8px; font-weight: 600; color: #888; width: 150px; vertical-align: top;">${label}</td>
        <td style="padding: 12px 8px;${highlight ? " color: #ec4899; font-weight: 600;" : ""}">${value}</td>
      </tr>
    `;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333;">
        <div style="background: #ec4899; color: white; padding: 16px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">🎉 New Funnel Service Request!</h1>
        </div>
        <div style="border: 1px solid #eee; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            ${row("Name", args.name)}
            ${row("Email", `<a href="mailto:${args.email}">${args.email}</a>`)}
            ${row("Business", args.businessName)}
            ${row("What They Sell", args.whatTheySell)}
            ${row("Socials", args.socialLinks)}
            ${row("Current Setup", args.currentSetup)}
            ${row("Biggest Struggle", args.biggestStruggle, true)}
            ${row("Goals", args.goals)}
            ${row("Budget", args.budget)}
            ${row("Brand Colors", args.brandColors)}
            ${row("Brand Font", args.brandFont)}
          </table>
          <p style="font-size: 13px; color: #888; margin-top: 16px;">
            💡 Check your dashboard for any uploaded logos/images
          </p>
        </div>
        <p style="font-size: 13px; color: #999; text-align: center; margin-top: 16px;">
          Reply to ${args.email} to follow up ✨
        </p>
      </div>
    `;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Affiliate Baybe <support@baybebeauty.com>",
          to: ["support@baybebeauty.com"],
          subject: `🎉 New Client Request: ${args.name} — ${args.businessName}`,
          html,
        }),
      });

      if (!res.ok) {
        console.error("Notification email failed:", await res.text());
      } else {
        console.log("✅ Notification sent for:", args.name);
      }
    } catch (e) {
      console.error("Notification error:", e);
    }

    return null;
  },
});
