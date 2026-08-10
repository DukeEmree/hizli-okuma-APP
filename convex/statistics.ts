import { query } from './_generated/server';
import { v } from 'convex/values';

export type TimeRange = '7d' | '30d' | '90d' | 'all';

function getTimeThreshold(range: TimeRange): number {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  switch (range) {
    case '7d': return now - (7 * dayMs);
    case '30d': return now - (30 * dayMs);
    case '90d': return now - (90 * dayMs);
    case 'all': return 0;
    default: return 0;
  }
}

export const getPerformanceStats = query({
  args: { timeRange: v.union(v.literal('7d'), v.literal('30d'), v.literal('90d'), v.literal('all')) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        totalTrainingTimeMs: 0,
        totalSessions: 0,
        dailyTrends: [],
        exerciseStats: []
      };
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const threshold = getTimeThreshold(args.timeRange);

    // 1. Get global stats
    const userStats = await ctx.db
      .query('userStatistics')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .unique();

    let totalTrainingTimeMs = 0;
    let totalSessions = 0;
    if (userStats) {
      totalTrainingTimeMs = userStats.totalTrainingTimeMs;
      totalSessions = userStats.totalSessions;
    }

    // 2. Get exercise stats
    const exerciseStatsDocs = await ctx.db
      .query('exerciseStatistics')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect();

    const exStatsArray = exerciseStatsDocs.map(ex => ({
      type: ex.exerciseType,
      bestScore: ex.bestScore,
      averageScore: Math.round(ex.scoreSum / ex.attemptCount),
      bestWpm: ex.bestWpm,
      averageWpm: ex.wpmSum > 0 ? Math.round(ex.wpmSum / ex.attemptCount) : null,
      attemptCount: ex.attemptCount
    }));

    // 3. Get daily trends filtered by timeRange
    const dailyStatsDocs = await ctx.db
      .query('dailyStatistics')
      .withIndex('by_userId_and_timestamp', (q) => 
        q.eq('userId', user._id).gte('timestamp', threshold)
      )
      .collect();

    const trendArray = dailyStatsDocs
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(day => ({
        date: day.date,
        avgWpm: day.wpmCount > 0 ? Math.round(day.wpmSum / day.wpmCount) : null,
        avgComprehension: day.compCount > 0 ? (day.compSum / day.compCount) : null,
        avgAccuracy: day.accCount > 0 ? (day.accSum / day.accCount) : null,
        avgScore: day.scoreCount > 0 ? Math.round(day.scoreSum / day.scoreCount) : null,
        durationMs: day.durationMs,
        sessionCount: day.scoreCount
      }));

    return {
      totalTrainingTimeMs,
      totalSessions,
      dailyTrends: trendArray,
      exerciseStats: exStatsArray
    };
  }
});
