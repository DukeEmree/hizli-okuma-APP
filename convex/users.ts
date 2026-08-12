import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const store = mutation({
  args: { isOnboarded: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called storeUser without authentication present');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (user !== null) {
      const patch: Record<string, unknown> = {};
      if (
        user.displayName !== identity.name ||
        user.avatarUrl !== identity.pictureUrl
      ) {
        patch.displayName = identity.name;
        patch.avatarUrl = identity.pictureUrl;
      }
      // Bu cihazda daha önce guest olarak tamamlanmış onboarding'i taşı, hiç geri almadan.
      if (args.isOnboarded && !user.isOnboarded) {
        patch.isOnboarded = true;
      }
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(user._id, patch);
      }
      return user._id;
    }

    return await ctx.db.insert('users', {
      clerkId: identity.subject,
      displayName: identity.name,
      avatarUrl: identity.pictureUrl,
      isOnboarded: args.isOnboarded ?? false,
    });
  },
});

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    return user;
  },
});

export const setPushNotificationsEnabled = mutation({
  args: { enabled: v.boolean() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, { pushNotificationsEnabled: args.enabled });
  },
});

export const setProgressNotificationsEnabled = mutation({
  args: { enabled: v.boolean() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, { progressNotificationsEnabled: args.enabled });
  },
});

export const completeOnboarding = mutation({
  args: {
    onboardingReason: v.string(),
    trainingGoalMins: v.number(),
    initialWpm: v.number(),
    initialComprehension: v.number(),
    startingDifficulty: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      isOnboarded: true,
      onboardingReason: args.onboardingReason,
      trainingGoalMins: args.trainingGoalMins,
      initialWpm: args.initialWpm,
      initialComprehension: args.initialComprehension,
      startingDifficulty: args.startingDifficulty,
    });
  },
});

export const resetMyStatistics = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    // 1. Delete Exercise Sessions
    const sessions = await ctx.db
      .query('exerciseSessions')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    // 2. Delete Exercise Progress
    const progress = await ctx.db
      .query('exerciseProgress')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const p of progress) {
      await ctx.db.delete(p._id);
    }

    // 3. Delete Streaks
    const streaks = await ctx.db
      .query('streaks')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const s of streaks) {
      await ctx.db.delete(s._id);
    }

    // 5. Delete Achievements
    const achievements = await ctx.db
      .query('userAchievements')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const a of achievements) {
      await ctx.db.delete(a._id);
    }

    // 6. Delete Aggregate Statistics
    const dailyStats = await ctx.db
      .query('dailyStatistics')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const d of dailyStats) {
      await ctx.db.delete(d._id);
    }
    const exStats = await ctx.db
      .query('exerciseStatistics')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const e of exStats) {
      await ctx.db.delete(e._id);
    }
    const userStats = await ctx.db
      .query('userStatistics')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const u of userStats) {
      await ctx.db.delete(u._id);
    }

    // 7. Reset gamification and onboarding state
    await ctx.db.patch(user._id, {
      xp: 0,
      level: 1,
      isOnboarded: false,
    });

    return true;
  },
});

export const deleteMyAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    if (user.isPremium) {
      throw new Error('Aktif bir aboneliğiniz bulunuyor. Hesabınızı silmeden önce lütfen aboneliğinizi Play Store veya App Store üzerinden iptal ediniz.');
    }

    // Re-use logic to clear stats
    // 1. Delete Exercise Sessions
    const sessions = await ctx.db
      .query('exerciseSessions')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    // 2. Delete Exercise Progress
    const progress = await ctx.db
      .query('exerciseProgress')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const p of progress) {
      await ctx.db.delete(p._id);
    }

    // 3. Delete Streaks
    const streaks = await ctx.db
      .query('streaks')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const s of streaks) {
      await ctx.db.delete(s._id);
    }

    // 5. Delete Achievements
    const achievements = await ctx.db
      .query('userAchievements')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const a of achievements) {
      await ctx.db.delete(a._id);
    }

    // 6. Delete Aggregate Statistics
    const dailyStats = await ctx.db
      .query('dailyStatistics')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const d of dailyStats) {
      await ctx.db.delete(d._id);
    }
    const exStats = await ctx.db
      .query('exerciseStatistics')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const e of exStats) {
      await ctx.db.delete(e._id);
    }
    const userStats = await ctx.db
      .query('userStatistics')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const u of userStats) {
      await ctx.db.delete(u._id);
    }

    // 7. Delete registered push tokens (otherwise they're left pointing at
    // a deleted user id, and could still receive server-sent pushes)
    const tokens = await ctx.db
      .query('pushTokens')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const t of tokens) {
      await ctx.db.delete(t._id);
    }

    // Finally delete the user
    await ctx.db.delete(user._id);

    return true;
  },
});

