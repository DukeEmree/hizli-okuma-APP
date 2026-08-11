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
      return null;
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

    // Cloud sync is a premium feature - see exerciseSessions.createSession
    // for the matching guard and rationale.
    if (!user.isPremium) {
      return;
    }

    // Server-side anti-cheat validation. The adaptive algorithm
    // (src/utils/adaptiveDifficulty.ts) only ever moves currentLevel by one
    // step per submission, so a client-reported jump larger than that (or an
    // out-of-range level) cannot be a legitimate progression result.
    if (!Number.isInteger(args.currentLevel) || args.currentLevel < 1 || args.currentLevel > 10) {
      throw new Error('Invalid difficulty level');
    }
    if (args.consecutiveSuccesses < 0 || args.consecutiveFailures < 0) {
      throw new Error('Invalid progression counters');
    }
    if (args.score < 0) {
      throw new Error('Score cannot be negative');
    }
    if (args.wpm !== undefined && (args.wpm < 0 || args.wpm > 5000)) {
      throw new Error('Impossible WPM value. Anti-cheat triggered.');
    }

    const existingProgress = await ctx.db
      .query('exerciseProgress')
      .withIndex('by_userId_and_exercise', (q) =>
        q.eq('userId', user._id).eq('exerciseId', args.exerciseId)
      )
      .unique();

    if (existingProgress) {
      if (Math.abs(args.currentLevel - existingProgress.currentLevel) > 1) {
        throw new Error('Difficulty level cannot jump by more than one step. Anti-cheat triggered.');
      }

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
        historicalBest: Math.max(existingProgress.historicalBest, args.currentLevel),
        bestScore,
        bestWpm,
        attemptCount: existingProgress.attemptCount + 1,
      });
    } else {
      // İlk kayıt: başlangıç seviyesi 1'dir, algoritma tek adımda en fazla
      // 2'ye çıkarabilir - daha yükseği sahtecilik anlamına gelir.
      if (args.currentLevel > 2) {
        throw new Error('Invalid initial difficulty level. Anti-cheat triggered.');
      }

      // Yeni yarat
      await ctx.db.insert('exerciseProgress', {
        userId: user._id,
        exerciseId: args.exerciseId,
        currentLevel: args.currentLevel,
        consecutiveSuccesses: args.consecutiveSuccesses,
        consecutiveFailures: args.consecutiveFailures,
        historicalBest: args.currentLevel,
        bestScore: args.score,
        bestWpm: args.wpm,
        attemptCount: 1,
      });
    }
  },
});
