import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Kullanıcının mevcut exercise Progress durumunu çeker.
 * Yoksa, başlangıç değerleriyle (Difficulty 1) yeni bir kayıt oluşturup döner.
 */
export const getProgress = query({
  args: { exerciseId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        currentLevel: 1,
        consecutiveSuccesses: 0,
        consecutiveFailures: 0,
        historicalBest: 1,
      };
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const existingProgress = await ctx.db
      .query('exerciseProgress')
      .withIndex('by_userId_and_exercise', (q) =>
        q.eq('userId', user._id).eq('exerciseId', args.exerciseId)
      )
      .unique();

    if (existingProgress) {
      return {
        currentLevel: existingProgress.currentLevel,
        consecutiveSuccesses: existingProgress.consecutiveSuccesses,
        consecutiveFailures: existingProgress.consecutiveFailures,
        historicalBest: existingProgress.historicalBest,
      };
    }

    // Default başlangıç
    return {
      currentLevel: 1,
      consecutiveSuccesses: 0,
      consecutiveFailures: 0,
      historicalBest: 1,
    };
  },
});

/**
 * Adaptive Engine tarafından hesaplanan yeni state'i veritabanına kaydeder.
 */
export const updateProgress = mutation({
  args: {
    exerciseId: v.string(),
    currentLevel: v.number(),
    consecutiveSuccesses: v.number(),
    consecutiveFailures: v.number(),
    historicalBest: v.number(),
    score: v.number(),
    wpm: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const existingProgress = await ctx.db
      .query('exerciseProgress')
      .withIndex('by_userId_and_exercise', (q) =>
        q.eq('userId', user._id).eq('exerciseId', args.exerciseId)
      )
      .unique();

    if (existingProgress) {
      // Güncelle
      const bestScore = Math.max(existingProgress.bestScore, args.score);
      let bestWpm = existingProgress.bestWpm;
      if (args.wpm) {
        bestWpm = bestWpm ? Math.max(bestWpm, args.wpm) : args.wpm;
      }

      await ctx.db.patch(existingProgress._id, {
        currentLevel: args.currentLevel,
        consecutiveSuccesses: args.consecutiveSuccesses,
        consecutiveFailures: args.consecutiveFailures,
        historicalBest: Math.max(existingProgress.historicalBest, args.historicalBest),
        bestScore,
        bestWpm,
        attemptCount: existingProgress.attemptCount + 1,
      });
    } else {
      // Yeni yarat
      await ctx.db.insert('exerciseProgress', {
        userId: user._id,
        exerciseId: args.exerciseId,
        currentLevel: args.currentLevel,
        consecutiveSuccesses: args.consecutiveSuccesses,
        consecutiveFailures: args.consecutiveFailures,
        historicalBest: args.historicalBest,
        bestScore: args.score,
        bestWpm: args.wpm,
        attemptCount: 1,
      });
    }
  },
});
