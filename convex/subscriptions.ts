import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const syncPremiumState = internalMutation({
  args: {
    clerkId: v.string(),
    isPremium: v.boolean(),
    premiumExpiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      console.error(`User not found for clerkId: ${args.clerkId}`);
      return;
    }

    await ctx.db.patch(user._id, {
      isPremium: args.isPremium,
      premiumExpiresAt: args.premiumExpiresAt,
    });
    
    console.log(`Synced premium state for ${args.clerkId}: isPremium=${args.isPremium}`);
  },
});
