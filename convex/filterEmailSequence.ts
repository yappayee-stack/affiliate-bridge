import { v } from "convex/values";
import { internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

declare const process: { env: Record<string, string | undefined> };

// ============================================================
// Filter Guide Email Sequence
// ============================================================
// Triggered for leads with source="filters"
// Email 1: Welcome + free PDF delivery (immediate via sendWelcomeEmail logic)
// Email 2: Day 2 — Effect House story + sell Starter
// Email 3: Day 4 — What's in the paid guides + sell Bundle
// Email 4: Day 6 — Last chance + urgency
// ============================================================

const SITE_URL = "https://affiliate-bridge-4a8f6373.viktor.space";
const FREE_PDF = `${SITE_URL}/filter-guide-free.pdf`;
const FILTERS_PAGE = `${SITE_URL}/filters`;
const FROM = "Affiliate Baybe <support@baybebeauty.com>";

interface EmailTemplate {
  subject: string;
  html: (name: string) => string;
}

const filterEmails: Record<number, EmailTemplate> = {
  // Email 1 is the welcome — handled by sendWelcomeEmail.ts detection of source
  2: {
    subject: "Did you try Effect House yet? Here's what to do first 🎨",
    html: (name: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; color: #333;">
        <p style="font-size: 16px; line-height: 1.6;">Hey ${name}! 👋</p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Hope you got a chance to read the free filter guide I sent. If not — <a href="${FREE_PDF}" style="color: #ec4899; text-decoration: underline;">download it here again</a>.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Quick story: When I first opened Effect House, I was completely lost. The interface looks intimidating. I almost closed it.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          But I figured out the system — and within a week, I had my first filter live on TikTok. Within a month, I hit <strong>4.3 million views</strong>. All while working 12-hour ER shifts.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          The free guide gives you the overview. But if you want the exact step-by-step walkthrough — from installing Effect House to publishing your first filter — that's in <strong>Filter Foundations</strong>.
        </p>

        <div style="background: #f9f0ff; border: 1px solid #e8d5f5; padding: 24px; margin: 24px 0; border-radius: 8px;">
          <p style="font-size: 15px; font-weight: 600; color: #333; margin-bottom: 8px;">📖 Filter Foundations — $29</p>
          <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 16px;">
            6 chapters covering setup, interface, building your first filter, face tracking, publishing & approvals. Plus 5 filter ideas to build this week.
          </p>
          <a href="${FILTERS_PAGE}" style="display: inline-block; background: #ec4899; color: white; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px;">
            Get Filter Foundations →
          </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">
          I wrote it exactly how I wish someone had explained it to me when I started.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Talk soon,<br/>
          <strong>Affiliate Baybe</strong> 🏆 Top 1% Effect House
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
    subject: "The 3 things every viral filter has 🧬",
    html: (name: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; color: #333;">
        <p style="font-size: 16px; line-height: 1.6;">Hey ${name},</p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          After 6.7 million views, I've reverse-engineered what makes filters go viral. Every single one of my top performers has these 3 elements:
        </p>

        <div style="background: #fff5f7; padding: 20px; border-left: 3px solid #ec4899; margin: 20px 0;">
          <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
            <strong>1. The Wow Factor</strong> — Dramatic transformation in the first 0.5 seconds
          </p>
          <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
            <strong>2. The Flattery Factor</strong> — Makes the user look amazing (they WANT to share)
          </p>
          <p style="font-size: 15px; line-height: 1.6;">
            <strong>3. The Share Trigger</strong> — The hidden mechanic that turns 10K views into 1M+ (this one's in the Pro guide 🔒)
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">
          The full breakdown — plus my 60+ layer architecture, GAN override techniques, and the complete viral launch playbook — is in <strong>Viral Filter Secrets</strong>.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Or grab both guides together and save:
        </p>

        <div style="background: linear-gradient(135deg, #fdf2f8, #fef3e2); border: 2px solid #ec4899; padding: 24px; margin: 24px 0; border-radius: 8px; text-align: center;">
          <p style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 4px;">🔥 Complete Bundle — $79</p>
          <p style="font-size: 14px; color: #888; margin-bottom: 16px;">Filter Foundations + Viral Filter Secrets (save $9)</p>
          <a href="${FILTERS_PAGE}" style="display: inline-block; background: linear-gradient(135deg, #ec4899, #d4a574); color: white; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-size: 15px;">
            Get Both Guides — $79 →
          </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">
          If you're serious about filters, the bundle is the move. Everything from beginner to viral in one shot.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          — <strong>Affiliate Baybe</strong>
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
    subject: "Last call — your filter journey starts now ⏰",
    html: (name: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; color: #333;">
        <p style="font-size: 16px; line-height: 1.6;">Hey ${name},</p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          This is my last email about the filter guides.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Here's what you've already learned from the free guide:
        </p>
        <ul style="font-size: 15px; line-height: 1.8; color: #555;">
          <li>Why filters = free viral traffic</li>
          <li>How layers work in Effect House</li>
          <li>Your first 5 steps to a published filter</li>
          <li>2 of the 3 viral elements</li>
        </ul>

        <p style="font-size: 16px; line-height: 1.6;">
          Here's what's waiting in the paid guides:
        </p>
        <ul style="font-size: 15px; line-height: 1.8; color: #555;">
          <li>Full step-by-step first filter build (Starter, $29)</li>
          <li>60+ layer architecture system (Pro, $59)</li>
          <li>Custom GAN & makeup override techniques (Pro)</li>
          <li>The Share Trigger — what separates 10K from 1M+ views (Pro)</li>
          <li>The 7-day viral launch playbook (Pro)</li>
          <li>Complete filter launch checklist (Pro)</li>
        </ul>

        <p style="font-size: 16px; line-height: 1.6;">
          I built all of this while working full-time as an ER nurse. If I can hit 6.7M views between 12-hour shifts, you can too.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${FILTERS_PAGE}" style="display: inline-block; background: #ec4899; color: white; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-size: 15px;">
            See All Filter Guides →
          </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">
          Whatever you decide — I'm rooting for you. 💪
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          — <strong>Affiliate Baybe</strong>
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

// Query leads that need filter follow-up emails
export const getFilterLeadsNeedingEmails = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("leads"),
      email: v.string(),
      name: v.optional(v.string()),
      capturedAt: v.number(),
      emailsSent: v.optional(
        v.array(v.object({ emailNumber: v.number(), sentAt: v.number() }))
      ),
    })
  ),
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();
    return leads
      .filter((l) => l.source === "filters")
      .map((l) => ({
        _id: l._id,
        email: l.email,
        name: l.name,
        capturedAt: l.capturedAt,
        emailsSent: l.emailsSent,
      }));
  },
});

// Process filter follow-ups (called by cron)
export const processFilterFollowUps = internalAction({
  args: {},
  handler: async (ctx) => {
    const leads: Array<{
      _id: string;
      email: string;
      name?: string;
      capturedAt: number;
      emailsSent?: Array<{ emailNumber: number; sentAt: number }>;
    }> = await ctx.runQuery(
      internal.filterEmailSequence.getFilterLeadsNeedingEmails,
      {}
    );

    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;

    for (const lead of leads) {
      const sentNums = (lead.emailsSent || []).map((e) => e.emailNumber);
      const daysSinceCapture = (now - lead.capturedAt) / DAY;
      const name = lead.name || "friend";

      // Email 2: Day 2
      if (daysSinceCapture >= 2 && !sentNums.includes(2)) {
        await sendFilterEmail(lead.email, name, 2);
        await ctx.runMutation(internal.emailSequence.recordEmailSent, {
          leadId: lead._id as any,
          emailNumber: 2,
        });
        continue; // one email per run per lead
      }

      // Email 3: Day 4
      if (daysSinceCapture >= 4 && !sentNums.includes(3)) {
        await sendFilterEmail(lead.email, name, 3);
        await ctx.runMutation(internal.emailSequence.recordEmailSent, {
          leadId: lead._id as any,
          emailNumber: 3,
        });
        continue;
      }

      // Email 4: Day 6
      if (daysSinceCapture >= 6 && !sentNums.includes(4)) {
        await sendFilterEmail(lead.email, name, 4);
        await ctx.runMutation(internal.emailSequence.recordEmailSent, {
          leadId: lead._id as any,
          emailNumber: 4,
        });
        continue;
      }
    }
  },
});

async function sendFilterEmail(
  to: string,
  name: string,
  emailNum: number
): Promise<void> {
  const template = filterEmails[emailNum];
  if (!template) return;

  const apiKey =
    process.env.RESEND_API_KEY ||
    process.env.RESEND_API_KEY!;
  if (!apiKey) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        subject: template.subject,
        html: template.html(name),
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`Filter email ${emailNum} failed for ${to}:`, err);
    }
  } catch (e) {
    console.error(`Filter email ${emailNum} error:`, e);
  }
}
