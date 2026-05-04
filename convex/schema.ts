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
  }).index("by_email", ["email"]),
});

export default schema;
