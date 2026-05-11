import { v } from "convex/values";
import { query } from "./_generated/server";

// Get all leads with full details for the dashboard
export const getAllLeads = query({
  args: { password: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("leads"),
      email: v.string(),
      name: v.optional(v.string()),
      capturedAt: v.number(),
      source: v.optional(v.string()),
      emailsSent: v.optional(
        v.array(
          v.object({
            emailNumber: v.number(),
            sentAt: v.number(),
          })
        )
      ),
    })
  ),
  handler: async (ctx, args) => {
    // Simple password gate
    if (args.password !== "baybe2026") {
      return [];
    }
    const leads = await ctx.db.query("leads").collect();
    return leads.map((l) => ({
      _id: l._id,
      email: l.email,
      name: l.name,
      capturedAt: l.capturedAt,
      source: l.source,
      emailsSent: l.emailsSent,
    }));
  },
});

// Get summary stats
export const getStats = query({
  args: { password: v.string() },
  returns: v.object({
    totalLeads: v.number(),
    todayLeads: v.number(),
    weekLeads: v.number(),
    emailsSentTotal: v.number(),
    sequenceCompletion: v.object({
      email1: v.number(),
      email2: v.number(),
      email3: v.number(),
      email4: v.number(),
      email5: v.number(),
    }),
  }),
  handler: async (ctx, args) => {
    if (args.password !== "baybe2026") {
      return {
        totalLeads: 0,
        todayLeads: 0,
        weekLeads: 0,
        emailsSentTotal: 0,
        sequenceCompletion: { email1: 0, email2: 0, email3: 0, email4: 0, email5: 0 },
      };
    }

    const leads = await ctx.db.query("leads").collect();
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const todayStart = now - dayMs;
    const weekStart = now - 7 * dayMs;

    const todayLeads = leads.filter((l) => l.capturedAt >= todayStart).length;
    const weekLeads = leads.filter((l) => l.capturedAt >= weekStart).length;

    let emailsSentTotal = 0;
    const sequenceCompletion = { email1: 0, email2: 0, email3: 0, email4: 0, email5: 0 };

    // Email 1 = welcome email, count all leads as having received it
    sequenceCompletion.email1 = leads.length;

    for (const lead of leads) {
      const sent = lead.emailsSent || [];
      emailsSentTotal += sent.length + 1; // +1 for welcome email
      for (const e of sent) {
        const key = `email${e.emailNumber}` as keyof typeof sequenceCompletion;
        if (key in sequenceCompletion) {
          sequenceCompletion[key]++;
        }
      }
    }

    return {
      totalLeads: leads.length,
      todayLeads,
      weekLeads,
      emailsSentTotal,
      sequenceCompletion,
    };
  },
});
