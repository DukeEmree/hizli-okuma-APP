import { internalMutation, internalQuery, mutation, MutationCtx } from './_generated/server';
import { v } from 'convex/values';

async function requireUser(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Not authenticated');
  }
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
    .unique();
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

// Upserts by token (not by user), so a device that logs into a different
// account has its token reassigned instead of duplicated across two users —
// a stale token can never keep pointing at the previous account.
export const registerToken = mutation({
  args: {
    token: v.string(),
    platform: v.union(v.literal('ios'), v.literal('android')),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const now = Date.now();

    const existing = await ctx.db
      .query('pushTokens')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        userId: user._id,
        platform: args.platform,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert('pushTokens', {
      userId: user._id,
      token: args.token,
      platform: args.platform,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Ownership-checked: only removes the token if it belongs to the caller, so
// one user can't blind-delete another user's device token by guessing it.
export const removeToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    const existing = await ctx.db
      .query('pushTokens')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .unique();

    if (existing && existing.userId === user._id) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getTokensForUser = internalQuery({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('pushTokens')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();
  },
});

// Called by the push-send action when Expo reports a token as
// DeviceNotRegistered — removes only that token, leaving the user's other
// devices unaffected.
export const deleteTokenById = internalMutation({
  args: { tokenId: v.id('pushTokens') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.tokenId);
  },
});
