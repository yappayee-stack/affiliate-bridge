import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const capture = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  returns: v.object({ success: v.boolean(), alreadyExists: v.boolean() }),
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .first();

    if (existing) {
      return { success: true, alreadyExists: true };
    }

    await ctx.db.insert("leads", {
      email: args.email.toLowerCase().trim(),
      name: args.name,
      capturedAt: Date.now(),
      source: args.source ?? "bridge-page",
    });

    return { success: true, alreadyExists: false };
  },
});

export const count = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();
    return leads.length;
  },
});
