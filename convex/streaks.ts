import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getStreak = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return null;

    const streak = await ctx.db
      .query("streaks")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    return (
      streak || {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityAt: 0,
      }
    );
  },
});

// Gerekirse manual streak güncellemeleri için
export const updateTimezone = mutation({
  args: { timezone: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, { timezone: args.timezone });
  },
});
