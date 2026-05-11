import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// Log a page visit
export const logVisit = mutation({
  args: {
    ip: v.string(),
    page: v.string(),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    device: v.optional(v.string()),
    source: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    city: v.optional(v.string()),
    region: v.optional(v.string()),
    country: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("visitors", {
      ip: args.ip,
      page: args.page,
      referrer: args.referrer,
      userAgent: args.userAgent,
      device: args.device,
      source: args.source,
      sessionId: args.sessionId,
      visitedAt: Date.now(),
      city: args.city,
      region: args.region,
      country: args.country,
    });
    return null;
  },
});

// Internal mutation for HTTP endpoint
export const logVisitInternal = internalMutation({
  args: {
    ip: v.string(),
    page: v.string(),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    device: v.optional(v.string()),
    source: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    city: v.optional(v.string()),
    region: v.optional(v.string()),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("visitors", {
      ip: args.ip,
      page: args.page,
      referrer: args.referrer,
      userAgent: args.userAgent,
      device: args.device,
      source: args.source,
      sessionId: args.sessionId,
      visitedAt: Date.now(),
      city: args.city,
      region: args.region,
      country: args.country,
    });
  },
});

// Get all visitors (password-gated)
export const getAll = query({
  args: { password: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("visitors"),
      ip: v.string(),
      page: v.string(),
      referrer: v.optional(v.string()),
      userAgent: v.optional(v.string()),
      device: v.optional(v.string()),
      source: v.optional(v.string()),
      visitedAt: v.number(),
      sessionId: v.optional(v.string()),
      city: v.optional(v.string()),
      region: v.optional(v.string()),
      country: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    if (args.password !== "baybe2026") return [];
    const visitors = await ctx.db
      .query("visitors")
      .withIndex("by_visitedAt")
      .order("desc")
      .take(500);
    return visitors.map((v) => ({
      _id: v._id,
      ip: v.ip,
      page: v.page,
      referrer: v.referrer,
      userAgent: v.userAgent,
      device: v.device,
      source: v.source,
      visitedAt: v.visitedAt,
      sessionId: v.sessionId,
      city: v.city,
      region: v.region,
      country: v.country,
    }));
  },
});

// Get visitor stats (password-gated)
export const getStats = query({
  args: { password: v.string() },
  returns: v.object({
    totalVisits: v.number(),
    todayVisits: v.number(),
    weekVisits: v.number(),
    uniqueIPs: v.number(),
    todayUniqueIPs: v.number(),
    pageBreakdown: v.array(
      v.object({ page: v.string(), count: v.number() })
    ),
    sourceBreakdown: v.array(
      v.object({ source: v.string(), count: v.number() })
    ),
    deviceBreakdown: v.array(
      v.object({ device: v.string(), count: v.number() })
    ),
    locationBreakdown: v.array(
      v.object({ location: v.string(), count: v.number() })
    ),
  }),
  handler: async (ctx, args) => {
    if (args.password !== "baybe2026") {
      return {
        totalVisits: 0,
        todayVisits: 0,
        weekVisits: 0,
        uniqueIPs: 0,
        todayUniqueIPs: 0,
        pageBreakdown: [],
        sourceBreakdown: [],
        deviceBreakdown: [],
        locationBreakdown: [],
      };
    }

    const allVisitors = await ctx.db.query("visitors").collect();
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const todayStart = now - dayMs;
    const weekStart = now - 7 * dayMs;

    const todayVisitors = allVisitors.filter((v) => v.visitedAt >= todayStart);
    const weekVisitors = allVisitors.filter((v) => v.visitedAt >= weekStart);

    const allIPs = new Set(allVisitors.map((v) => v.ip));
    const todayIPs = new Set(todayVisitors.map((v) => v.ip));

    // Page breakdown
    const pageCounts: Record<string, number> = {};
    for (const v of allVisitors) {
      pageCounts[v.page] = (pageCounts[v.page] || 0) + 1;
    }
    const pageBreakdown = Object.entries(pageCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count);

    // Source breakdown
    const sourceCounts: Record<string, number> = {};
    for (const v of allVisitors) {
      const src = v.source || "direct";
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    }
    const sourceBreakdown = Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    // Device breakdown
    const deviceCounts: Record<string, number> = {};
    for (const v of allVisitors) {
      const dev = v.device || "unknown";
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
    }
    const deviceBreakdown = Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count);

    // Location breakdown (city, region)
    const locationCounts: Record<string, number> = {};
    for (const v of allVisitors) {
      let loc = "Unknown";
      if (v.city && v.region) {
        loc = `${v.city}, ${v.region}`;
      } else if (v.city) {
        loc = v.city;
      } else if (v.region) {
        loc = v.region;
      } else if (v.country) {
        loc = v.country;
      }
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    }
    const locationBreakdown = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalVisits: allVisitors.length,
      todayVisits: todayVisitors.length,
      weekVisits: weekVisitors.length,
      uniqueIPs: allIPs.size,
      todayUniqueIPs: todayIPs.size,
      pageBreakdown,
      sourceBreakdown,
      deviceBreakdown,
      locationBreakdown,
    };
  },
});
