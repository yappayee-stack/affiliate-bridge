import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

declare const process: { env: Record<string, string | undefined> };

// ============================================================
// Email Follow-Up Sequence for Affiliate Baybe
// ============================================================
// Email 1: Welcome (already sent on signup via sendWelcomeEmail.ts)
// Email 2: Your Story — Day 2 (48h after signup)
// Email 3: What's Inside — Day 4
// Email 4: Social Proof — Day 6
// Email 5: Last Chance — Day 8
// ============================================================

const SALES_PAGE = "https://affbaylanding-dmqrqdof.manus.space/";
const FREE_PREVIEW = "https://affiliate-bridge-4a8f6373.viktor.space/affiliate-baybe-free-preview.pdf";
const FROM = "Affiliate Baybe <support@baybebeauty.com>";

interface EmailTemplate {
  subject: string;
  html: (name: string) => string;
}

const emailTemplates: Record<number, EmailTemplate> = {
  2: {
    subject: "Did you read Chapter 1 yet? Here's my story 🏥",
    html: (name: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; color: #333;">
        <p style="font-size: 16px; line-height: 1.6;">Hey ${name}! 👋</p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Hope you got a chance to read the free guide preview I sent! If not, <a href="${FREE_PREVIEW}" style="color: #ec4899; text-decoration: underline;">here's the download link again</a>.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          I wanted to share something personal with you — the story behind why I created this.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          I'm a full-time ER/trauma nurse. I work 12-hour shifts, I see things most people can't imagine, and I come home exhausted.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          But I also built a business — <strong>from my phone</strong>, in the hours between shifts. Not because I had some special advantage. But because I learned a system that works even when you don't have time.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Chapter 1 in your preview covers building your brand — that's step one. But the <strong>full guide</strong> covers the other 5 chapters that turn that brand into real income:
        </p>

        <ul style="font-size: 15px; line-height: 1.8; color: #555;">
          <li>Affiliate marketing that actually pays</li>
          <li>Driving traffic that converts</li>
          <li>TikTok Shop strategy</li>
          <li>AI tools that do the work for you</li>
          <li>How to scale once it's working</li>
        </ul>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${SALES_PAGE}" style="display: inline-block; background: #ec4899; color: white; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 16px;">
            Unlock All 6 Chapters for $19 →
          </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">
          If I can do it working ER shifts, you can too. 💪
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Talk soon,<br/>
          <strong>Affiliate Baybe</strong>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          You signed up at affiliatebaybe.com.<br/>
          <a href="#" style="color: #aaa;">Unsubscribe</a>
        </p>
      </div>
    `,
  },

  3: {
    subject: "Here's exactly what you'll learn (all 10 modules) 📚",
    html: (name: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; color: #333;">
        <p style="font-size: 16px; line-height: 1.6;">Hey ${name}!</p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          A lot of people ask me: <em>"What's actually in the course?"</em>
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Fair question. Here's the full breakdown:
        </p>

        <div style="background: #fdf2f8; padding: 24px; border-radius: 12px; margin: 20px 0;">
          <p style="font-size: 15px; line-height: 2; margin: 0;">
            <strong>Module 1:</strong> Building Your Brand Identity<br/>
            <strong>Module 2:</strong> Affiliate Marketing Foundations<br/>
            <strong>Module 3:</strong> Driving Traffic That Converts<br/>
            <strong>Module 4:</strong> TikTok Shop Strategy<br/>
            <strong>Module 5:</strong> AI Tools That Do the Work<br/>
            <strong>Module 6:</strong> Email Marketing System<br/>
            <strong>Module 7:</strong> Content Creation Blueprint<br/>
            <strong>Module 8:</strong> Monetization Strategies<br/>
            <strong>Module 9:</strong> Scaling Your Business<br/>
            <strong>Module 10:</strong> Long-Term Growth Plan
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">
          Plus you get:
        </p>

        <ul style="font-size: 15px; line-height: 1.8; color: #555;">
          <li>📅 A 30-day action plan (so you're not guessing what to do)</li>
          <li>✉️ 8 ready-to-use email templates</li>
          <li>🛠️ Tools & resources list</li>
          <li>👥 Community access</li>
        </ul>

        <p style="font-size: 16px; line-height: 1.6;">
          And right now it's just <strong>$19</strong> <span style="text-decoration: line-through; color: #999;">$25</span> during the launch special.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${SALES_PAGE}" style="display: inline-block; background: #ec4899; color: white; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 16px;">
            Get the Course for $19 →
          </a>
        </div>

        <p style="font-size: 14px; color: #888; line-height: 1.6;">
          🔒 90-day money-back guarantee. No risk.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          — Affiliate Baybe
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          You signed up at affiliatebaybe.com.<br/>
          <a href="#" style="color: #aaa;">Unsubscribe</a>
        </p>
      </div>
    `,
  },

  4: {
    subject: "Why email marketing? One stat says it all 📊",
    html: (name: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; color: #333;">
        <p style="font-size: 16px; line-height: 1.6;">Hey ${name}!</p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Quick question — did you know that email marketing returns <strong>$36 to $40 for every $1 spent</strong>?
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          That's not my opinion. That's the industry average.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Compare that to:
        </p>

        <ul style="font-size: 15px; line-height: 1.8; color: #555;">
          <li>Social media ads → $2-5 return per $1</li>
          <li>Influencer marketing → $5-7 return per $1</li>
          <li>Email marketing → <strong>$36-40 return per $1</strong> 🤯</li>
        </ul>

        <p style="font-size: 16px; line-height: 1.6;">
          The difference? <strong>You own your email list.</strong> No algorithm changes. No shadow bans. No hoping TikTok shows your content to people.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          When you email someone, they see it. Period.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          The Affiliate Baybe course shows you exactly how to build this system step by step — even if you've never sent a marketing email before.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${SALES_PAGE}" style="display: inline-block; background: #ec4899; color: white; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 16px;">
            Start Building Your Email System →
          </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">
          — Affiliate Baybe
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          You signed up at affiliatebaybe.com.<br/>
          <a href="#" style="color: #aaa;">Unsubscribe</a>
        </p>
      </div>
    `,
  },

  5: {
    subject: "Last chance — $19 won't last forever ⏰",
    html: (name: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; color: #333;">
        <p style="font-size: 16px; line-height: 1.6;">Hey ${name}!</p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          This is my last email about this — I promise. 😊
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          The Affiliate Baybe launch price of <strong>$19</strong> is going away soon. The regular price is $25, and honestly it should be more.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Here's what $19 gets you:
        </p>

        <ul style="font-size: 15px; line-height: 1.8; color: #555;">
          <li>✅ 10 step-by-step modules</li>
          <li>✅ 30-day action plan</li>
          <li>✅ 8 email templates you can copy & paste</li>
          <li>✅ Tools & resources list</li>
          <li>✅ Community access</li>
          <li>✅ 90-day money-back guarantee</li>
        </ul>

        <p style="font-size: 16px; line-height: 1.6;">
          That's less than a dinner out. And it could change how you make money online.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          I built this while working 12-hour shifts as an ER nurse. If I had a guide like this when I started, I would've saved months of trial and error.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${SALES_PAGE}" style="display: inline-block; background: #ec4899; color: white; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-size: 18px; font-weight: 700;">
            🔥 Get It for $19 Before Price Goes Up →
          </a>
        </div>

        <p style="font-size: 14px; color: #888; line-height: 1.6; text-align: center;">
          90-day money-back guarantee. Zero risk.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Rooting for you,<br/>
          <strong>Affiliate Baybe</strong> 💕
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          You signed up at affiliatebaybe.com.<br/>
          <a href="#" style="color: #aaa;">Unsubscribe</a>
        </p>
      </div>
    `,
  },
};

// Schedule delays in milliseconds
const SEQUENCE_SCHEDULE: Record<number, number> = {
  2: 48 * 60 * 60 * 1000,    // Day 2 (48 hours)
  3: 96 * 60 * 60 * 1000,    // Day 4
  4: 144 * 60 * 60 * 1000,   // Day 6
  5: 192 * 60 * 60 * 1000,   // Day 8
};

// Send a single follow-up email
export const sendFollowUp = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    emailNumber: v.number(),
    leadId: v.id("leads"),
  },
  returns: v.object({ success: v.boolean(), error: v.optional(v.string()) }),
  handler: async (ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY || process.env.RESEND_API_KEY!;
    if (!apiKey) {
      return { success: false, error: "RESEND_API_KEY not configured" };
    }

    const template = emailTemplates[args.emailNumber];
    if (!template) {
      return { success: false, error: `No template for email ${args.emailNumber}` };
    }

    const firstName = args.name || "there";

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM,
          to: [args.email],
          subject: template.subject,
          html: template.html(firstName),
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`Follow-up email ${args.emailNumber} failed:`, err);
        return { success: false, error: err };
      }

      // Record that email was sent
      await ctx.runMutation(internal.emailSequence.recordEmailSent, {
        leadId: args.leadId,
        emailNumber: args.emailNumber,
      });

      console.log(`✅ Sent follow-up email ${args.emailNumber} to ${args.email}`);
      return { success: true };
    } catch (e: any) {
      console.error(`Follow-up email ${args.emailNumber} error:`, e);
      return { success: false, error: e.message };
    }
  },
});

// Record that email was sent
export const recordEmailSent = internalMutation({
  args: {
    leadId: v.id("leads"),
    emailNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId);
    if (!lead) return;

    const emailsSent = (lead as any).emailsSent || [];
    emailsSent.push({
      emailNumber: args.emailNumber,
      sentAt: Date.now(),
    });

    await ctx.db.patch(args.leadId, { emailsSent } as any);
  },
});

// Cron-compatible: check all leads and send due follow-ups
export const processFollowUps = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const leads = await ctx.runQuery(internal.emailSequence.getLeadsForFollowUp);
    const now = Date.now();

    for (const lead of leads) {
      const emailsSent: number[] = ((lead as any).emailsSent || []).map(
        (e: any) => e.emailNumber
      );
      const capturedAt = lead.capturedAt;

      for (const [emailNumStr, delayMs] of Object.entries(SEQUENCE_SCHEDULE)) {
        const emailNum = parseInt(emailNumStr);
        
        // Skip if already sent
        if (emailsSent.includes(emailNum)) continue;

        // Check if it's time
        if (now - capturedAt >= delayMs) {
          // Make sure previous emails were sent first
          const prevEmail = emailNum - 1;
          if (prevEmail >= 2 && !emailsSent.includes(prevEmail)) continue;

          await ctx.runAction(internal.emailSequence.sendFollowUp, {
            email: lead.email,
            name: lead.name,
            emailNumber: emailNum,
            leadId: lead._id,
          });

          // Small delay between sends
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }

    return null;
  },
});

// Get leads that might need follow-ups
export const getLeadsForFollowUp = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leads").collect();
  },
});


