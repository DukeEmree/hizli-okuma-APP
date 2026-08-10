import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called storeUser without authentication present');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (user !== null) {
      if (
        user.displayName !== identity.name ||
        user.avatarUrl !== identity.pictureUrl
      ) {
        await ctx.db.patch(user._id, {
          displayName: identity.name,
          avatarUrl: identity.pictureUrl,
        });
      }
      return user._id;
    }

    return await ctx.db.insert('users', {
      clerkId: identity.subject,
      displayName: identity.name,
      avatarUrl: identity.pictureUrl,
      // timezone eklenebilir
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

    // 4. Delete Leaderboard Entries
    const entries = await ctx.db
      .query('leaderboardEntries')
      .withIndex('by_userId_and_period', (q) => q.eq('userId', user._id))
      .collect();
    for (const e of entries) {
      await ctx.db.delete(e._id);
    }

    // 5. Delete Achievements
    const achievements = await ctx.db
      .query('userAchievements')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const a of achievements) {
      await ctx.db.delete(a._id);
    }

    // 6. Reset gamification and onboarding state
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

    // 4. Delete Leaderboard Entries
    const entries = await ctx.db
      .query('leaderboardEntries')
      .withIndex('by_userId_and_period', (q) => q.eq('userId', user._id))
      .collect();
    for (const e of entries) {
      await ctx.db.delete(e._id);
    }

    // 5. Delete Achievements
    const achievements = await ctx.db
      .query('userAchievements')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();
    for (const a of achievements) {
      await ctx.db.delete(a._id);
    }

    // Finally delete the user
    await ctx.db.delete(user._id);

    return true;
  },
});

