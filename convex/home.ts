import { query } from './_generated/server';
import { getLocalDateString } from '../src/utils/streak';

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

    // 2. Get today's training duration, in the user's own timezone.
    // A UTC day boundary would put a UTC+3 user's 00:00-03:00 sessions on
    // the previous day (and yesterday's evening sessions on today), so the
    // daily-goal ring was wrong for several hours every night. Read a
    // 48h window as an index range (bounded, no full scan) and keep the
    // rows whose local date matches today's local date - this is also
    // DST-safe, unlike a fixed offset calculation.
    const timeZone = user.timezone || 'UTC';
    const todayStr = getLocalDateString(Date.now(), timeZone);
    const windowStart = Date.now() - 48 * 60 * 60 * 1000;

    const recentWindow = await ctx.db
      .query('exerciseSessions')
      .withIndex('by_userId_and_completedAt', (q) =>
        q.eq('userId', user._id).gte('completedAt', windowStart)
      )
      .collect();

    const todayTrainingMs = recentWindow
      .filter((s) => getLocalDateString(s.completedAt, timeZone) === todayStr)
      .reduce((sum, s) => sum + s.durationMs, 0);

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
    // comprehensionAccuracy is a 0-1 ratio; the UI renders avgComp as a
    // percentage (and user.initialComprehension is already 0-100), so it
    // has to be scaled here - otherwise the dashboard showed "1%".
    const avgComp = compCount > 0
      ? Math.round((totalComp / compCount) * 100)
      : (user.initialComprehension || null);

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
