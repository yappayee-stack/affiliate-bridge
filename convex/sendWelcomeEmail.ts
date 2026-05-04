import { v } from "convex/values";
import { action } from "./_generated/server";

export const send = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  returns: v.object({ success: v.boolean(), error: v.optional(v.string()) }),
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return { success: false, error: "RESEND_API_KEY not configured" };
    }

    const firstName = args.name || "there";
    const salesPageUrl = "https://affbaylanding-dmqrqdof.manus.space/";

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; color: #333;">
        <p style="font-size: 16px; line-height: 1.6;">Hey ${firstName}! 👋</p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Thanks for signing up — you're one step closer to making money with email marketing.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Here's what you're getting with <strong>Affiliate Baybe</strong>:
        </p>

        <ul style="font-size: 15px; line-height: 1.8; color: #555;">
          <li>📚 10 beginner-friendly modules</li>
          <li>📅 A 30-day action plan to get started</li>
          <li>✉️ 8 ready-to-use email templates</li>
          <li>👥 Access to the community</li>
        </ul>

        <p style="font-size: 16px; line-height: 1.6;">
          Email marketing returns <strong>$36–$40 for every $1 spent</strong> — and this course breaks it all down step by step.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${salesPageUrl}" style="display: inline-block; background: #ec4899; color: white; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 16px;">
            Get the Full Course for $19 →
          </a>
        </div>

        <p style="font-size: 14px; color: #888; line-height: 1.6;">
          🔥 Launch special: Just <strong>$19</strong> <span style="text-decoration: line-through;">$25</span> — includes a 90-day money-back guarantee.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Talk soon,<br/>
          <strong>Affiliate Baybe</strong>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          You're receiving this because you signed up at affiliatebaybe.com.<br/>
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
          subject: "Welcome! Here's your email marketing starter guide 🚀",
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
