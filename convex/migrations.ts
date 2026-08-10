import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Migration script to backfill userStatistics, exerciseStatistics, and dailyStatistics
 * from existing exerciseSessions for users who existed before the Phase 6 performance update.
 * 
 * Usage: Can be called via Convex Dashboard or a temporary admin UI.
 */
export const migrateAllUserStatistics = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Get all users
    const users = await ctx.db.query("users").collect();
    let migratedCount = 0;

    for (const user of users) {
      // Check if already migrated (has userStatistics)
      const existingUserStats = await ctx.db
        .query("userStatistics")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .unique();
        
      if (existingUserStats) {
        continue; // Skip already migrated
      }

      // 2. Fetch all sessions for this user
      const sessions = await ctx.db
        .query("exerciseSessions")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .collect();

      if (sessions.length === 0) {
        continue; // No data to migrate
      }

      let totalTrainingTimeMs = 0;
      let totalSessions = 0;
      
      const dailyTrends: Record<string, any> = {};
      const exerciseStats: Record<string, any> = {};

      // 3. Aggregate data exactly like the old getPerformanceStats
      for (const session of sessions) {
        totalTrainingTimeMs += session.durationMs;
        totalSessions += 1;

        // Daily
        const dateObj = new Date(session.completedAt);
        const dateStr = dateObj.toISOString().split('T')[0];
        const timestamp = Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate());
        
        if (!dailyTrends[dateStr]) {
          dailyTrends[dateStr] = {
            date: dateStr,
            timestamp,
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

        // Exercise
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

      // 4. Insert into new tables
      await ctx.db.insert("userStatistics", {
        userId: user._id,
        totalTrainingTimeMs,
        totalSessions,
      });

      for (const exType of Object.keys(exerciseStats)) {
        const ex = exerciseStats[exType];
        await ctx.db.insert("exerciseStatistics", {
          userId: user._id,
          exerciseType: exType,
          bestScore: ex.bestScore,
          scoreSum: ex.scoreSum,
          bestWpm: ex.bestWpm,
          wpmSum: ex.wpmSum,
          attemptCount: ex.attemptCount,
        });
      }

      for (const dateStr of Object.keys(dailyTrends)) {
        const day = dailyTrends[dateStr];
        await ctx.db.insert("dailyStatistics", {
          userId: user._id,
          date: day.date,
          timestamp: day.timestamp,
          durationMs: day.durationMs,
          scoreSum: day.scoreSum,
          scoreCount: day.scoreCount,
          wpmSum: day.wpmSum,
          wpmCount: day.wpmCount,
          compSum: day.compSum,
          compCount: day.compCount,
          accSum: day.accSum,
          accCount: day.accCount,
        });
      }

      migratedCount++;
    }

    return { migratedUsers: migratedCount };
  },
});
