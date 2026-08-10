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

    // Get all sessions for this user within the time range
    const sessions = await ctx.db
      .query('exerciseSessions')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .filter((q) => q.gte(q.field('completedAt'), threshold))
      .collect();

    // Aggregations
    const dailyTrends: Record<string, {
      date: string;
      wpmSum: number;
      wpmCount: number;
      compSum: number;
      compCount: number;
      accSum: number;
      accCount: number;
      scoreSum: number;
      scoreCount: number;
      durationMs: number;
    }> = {};

    const exerciseStats: Record<string, {
      type: string;
      bestScore: number;
      scoreSum: number;
      bestWpm: number;
      wpmSum: number;
      attemptCount: number;
    }> = {};

    let totalTrainingTimeMs = 0;
    let totalSessions = 0;

    for (const session of sessions) {
      totalTrainingTimeMs += session.durationMs;
      totalSessions += 1;

      // Group by Day (YYYY-MM-DD in UTC for simplicity, or local if provided. Let's use UTC string)
      const dateStr = new Date(session.completedAt).toISOString().split('T')[0];
      
      if (!dailyTrends[dateStr]) {
        dailyTrends[dateStr] = {
          date: dateStr,
          wpmSum: 0, wpmCount: 0,
          compSum: 0, compCount: 0,
          accSum: 0, accCount: 0,
          scoreSum: 0, scoreCount: 0,
          durationMs: 0
        };
      }

      const day = dailyTrends[dateStr];
      day.durationMs += session.durationMs;
      day.scoreSum += session.score;
      day.scoreCount += 1;

      if (session.metrics?.wpm) {
        day.wpmSum += session.metrics.wpm;
        day.wpmCount += 1;
      }
      if (session.metrics?.comprehensionAccuracy !== undefined) {
        day.compSum += session.metrics.comprehensionAccuracy;
        day.compCount += 1;
      }
      if (session.metrics?.correctCount !== undefined && session.metrics?.errorCount !== undefined) {
        const total = session.metrics.correctCount + session.metrics.errorCount;
        if (total > 0) {
          day.accSum += (session.metrics.correctCount / total);
          day.accCount += 1;
        }
      }

      // Exercise specific stats
      const exType = session.exerciseType;
      if (!exerciseStats[exType]) {
        exerciseStats[exType] = {
          type: exType,
          bestScore: 0,
          scoreSum: 0,
          bestWpm: 0,
          wpmSum: 0,
          attemptCount: 0
        };
      }
      
      const ex = exerciseStats[exType];
      ex.attemptCount += 1;
      ex.scoreSum += session.score;
      if (session.score > ex.bestScore) ex.bestScore = session.score;
      
      if (session.metrics?.wpm) {
        ex.wpmSum += session.metrics.wpm;
        if (session.metrics.wpm > ex.bestWpm) ex.bestWpm = session.metrics.wpm;
      }
    }

    // Format final daily trend array sorted by date
    const trendArray = Object.values(dailyTrends).sort((a, b) => a.date.localeCompare(b.date)).map(day => ({
      date: day.date,
      avgWpm: day.wpmCount > 0 ? Math.round(day.wpmSum / day.wpmCount) : null,
      avgComprehension: day.compCount > 0 ? (day.compSum / day.compCount) : null,
      avgAccuracy: day.accCount > 0 ? (day.accSum / day.accCount) : null,
      avgScore: day.scoreCount > 0 ? Math.round(day.scoreSum / day.scoreCount) : null,
      durationMs: day.durationMs,
      sessionCount: day.scoreCount
    }));

    // Format exercise stats
    const exStatsArray = Object.values(exerciseStats).map(ex => ({
      type: ex.type,
      bestScore: ex.bestScore,
      averageScore: Math.round(ex.scoreSum / ex.attemptCount),
      bestWpm: ex.bestWpm,
      averageWpm: ex.wpmSum > 0 ? Math.round(ex.wpmSum / ex.attemptCount) : null,
      attemptCount: ex.attemptCount
    }));

    return {
      totalTrainingTimeMs,
      totalSessions,
      dailyTrends: trendArray,
      exerciseStats: exStatsArray
    };
  }
});
