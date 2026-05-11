import { v } from "convex/values";
import { action } from "./_generated/server";

declare const process: { env: Record<string, string | undefined> };

export const send = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  returns: v.object({ success: v.boolean(), error: v.optional(v.string()) }),
  handler: async (_ctx, args) => {
    const apiKey =
      process.env.RESEND_API_KEY ||
      process.env.RESEND_API_KEY!;
    if (!apiKey) {
      return { success: false, error: "RESEND_API_KEY not configured" };
    }

    const firstName = args.name || "there";
    const freePdfUrl =
      "https://affiliate-bridge-4a8f6373.viktor.space/filter-guide-free.pdf";
    const filtersPage =
      "https://affiliate-bridge-4a8f6373.viktor.space/filters";

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; color: #333;">
        <p style="font-size: 16px; line-height: 1.6;">Hey ${firstName}! 👋</p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Thanks for signing up — here's your <strong>free filter guide</strong> as promised!
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${freePdfUrl}" style="display: inline-block; background: #ec4899; color: white; font-weight: 700; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-size: 18px;">
            📥 Download Your Free Filter Guide
          </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">
          Inside your free guide:
        </p>

        <ul style="font-size: 15px; line-height: 1.8; color: #555;">
          <li>👁️ <strong>My real stats</strong> — 6.7M views, 483K likes, Top 1% rank</li>
          <li>🎯 <strong>Why filters = free traffic</strong> — the opportunity most creators miss</li>
          <li>🧱 <strong>How filter layers work</strong> — the building blocks explained simply</li>
          <li>🚀 <strong>Your first 5 steps</strong> — publish a filter within 48 hours</li>
          <li>✨ <strong>2 of 3 viral elements</strong> — what makes filters spread</li>
        </ul>

        <p style="font-size: 16px; line-height: 1.6;">
          Read it, open Effect House, and build something. I'll check in with you in a couple days. 💪
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 28px 0;" />

        <p style="font-size: 15px; line-height: 1.6; color: #666;">
          When you're ready for the full step-by-step system — from complete beginner to viral filter creator — check out the paid guides:
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${filtersPage}" style="display: inline-block; background: #111; color: white; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 14px;">
            See Filter Guide Options →
          </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">
          Talk soon,<br/>
          <strong>Affiliate Baybe</strong> 🏆 Top 1% Effect House Creator
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          You signed up at affiliatebaybe.com.<br/>
          <a href="#" style="color: #aaa;">Unsubscribe</a>
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
          to: [args.email],
          subject: "Your free TikTok filter guide is here! 🎨",
          html,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Resend error:", err);
        return { success: false, error: err };
      }

      return { success: true };
    } catch (e: any) {
      console.error("Email send failed:", e);
      return { success: false, error: e.message };
    }
  },
});
