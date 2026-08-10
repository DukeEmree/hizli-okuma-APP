import { query } from './_generated/server';

export const getDashboardData = query({
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

    if (!user) {
      throw new Error('User not found');
    }

    // 1. Get recent 5 sessions
    const recentSessions = await ctx.db
      .query('exerciseSessions')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .order('desc')
      .take(5);

    // 2. Get today's training duration
    const now = new Date();
    // Use UTC date string for matching completedAt
    const todayStr = now.toISOString().split('T')[0];
    const todayStart = new Date(todayStr + 'T00:00:00.000Z').getTime();
    
    // Instead of querying all sessions, we just query from todayStart
    const todaysSessions = await ctx.db
      .query('exerciseSessions')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .filter((q) => q.gte(q.field('completedAt'), todayStart))
      .collect();

    const todayTrainingMs = todaysSessions.reduce((sum, s) => sum + s.durationMs, 0);

    // 3. Compute overall simple stats from all sessions (to avoid huge cost, we could limit it, but for now we fetch recent 100 for stats)
    // Or we use existing statistics query. Let's do a lightweight aggregate for the top level.
    const allRecentForStats = await ctx.db
      .query('exerciseSessions')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .order('desc')
      .take(100);

    let totalWpm = 0;
    let wpmCount = 0;
    let totalComp = 0;
    let compCount = 0;
    let totalDurationMs = 0;

    for (const session of allRecentForStats) {
      totalDurationMs += session.durationMs;
      if (session.metrics?.wpm) {
        totalWpm += session.metrics.wpm;
        wpmCount++;
      }
      if (session.metrics?.comprehensionAccuracy !== undefined) {
        totalComp += session.metrics.comprehensionAccuracy;
        compCount++;
      }
    }

    const avgWpm = wpmCount > 0 ? Math.round(totalWpm / wpmCount) : (user.initialWpm || null);
    const avgComp = compCount > 0 ? Math.round(totalComp / compCount) : (user.initialComprehension || null);

    return {
      user: {
        displayName: user.displayName,
        trainingGoalMins: user.trainingGoalMins || 10,
      },
      todayTrainingMs,
      stats: {
        avgWpm,
        avgComp,
        totalDurationMs // this is just from last 100 to save bandwidth, or we could aggregate properly
      },
      recentSessions
    };
  }
});
