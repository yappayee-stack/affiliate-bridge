import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  leads: defineTable({
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
  }).index("by_email", ["email"]),
  visitors: defineTable({
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
    .index("by_visitedAt", ["visitedAt"])
    .index("by_ip", ["ip"])
    .index("by_page", ["page"]),
  serviceRequests: defineTable({
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
    logoFileId: v.optional(v.id("_storage")),
    contentNotes: v.optional(v.string()),
    submittedAt: v.number(),
    status: v.string(),
  }),
});

export default schema;
