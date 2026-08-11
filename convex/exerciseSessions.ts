import { calculateStreakUpdate, getLocalDateString } from "../src/utils/streak";

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { processGamification } from "./gamification";

export const getMySessions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db
      .query("exerciseSessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);
  },
});

export const getSessionsByExerciseType = query({
  args: {
    exerciseType: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const sessions = await ctx.db
      .query("exerciseSessions")
      .withIndex("by_userId_and_exerciseType", (q) =>
        q.eq("userId", user._id).eq("exerciseType", args.exerciseType),
      )
      .order("desc")
      .take(15);

    return sessions
      .map((s) => ({
        completedAt: s.completedAt,
        score: s.score,
        metrics: s.metrics,
      }))
      .reverse();
  },
});

export const createSession = mutation({
  args: {
    clientSessionId: v.string(),
    exerciseId: v.string(),
    exerciseType: v.string(),
    startedAt: v.number(),
    completedAt: v.number(),
    durationMs: v.number(),
    difficulty: v.number(),
    score: v.number(),
    metrics: v.optional(v.any()),
    algorithmVersion: v.number(),
  },
  handler: async (ctx, args) => {
    // 1. Server-side Data Validation
    if (args.durationMs < 0) {
      throw new Error("Invalid duration");
    }
    // Sessions longer than 4 hours are implausible for a single exercise rep.
    if (args.durationMs > 4 * 60 * 60 * 1000) {
      throw new Error("Implausible session duration. Anti-cheat triggered.");
    }
    if (args.startedAt > args.completedAt) {
      throw new Error("startedAt cannot be after completedAt");
    }
    // Prevent future dates with 5 minute tolerance
    if (args.completedAt > Date.now() + 5 * 60 * 1000) {
      throw new Error("completedAt cannot be in the future");
    }
    if (args.score < 0) {
      throw new Error("Score cannot be negative");
    }
    // Generous sanity ceiling - no legitimate single session should score
    // this high; catches obviously forged submissions without having to
    // re-derive the exact client-side scoring formula server-side.
    if (args.score > 50000) {
      throw new Error("Implausible score. Anti-cheat triggered.");
    }

    // Metrics validation
    if (args.metrics) {
      if (typeof args.metrics.wpm === "number" && args.metrics.wpm > 5000) {
        throw new Error("Impossible WPM value. Anti-cheat triggered.");
      }
      if (Array.isArray(args.metrics.reactionTimeMs)) {
        for (const rt of args.metrics.reactionTimeMs) {
          if (typeof rt !== "number" || rt < 0) {
            throw new Error("Reaction time cannot be negative");
          }
        }
      }
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { sessionId: 'offline-pending', gamification: null };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Cloud sync (sessions, streaks, statistics, gamification) is a premium
    // feature - free/guest users keep everything in local storage on the
    // client. The client already skips this call for non-premium users;
    // this guard stops a bypassed/modified client from writing for free.
    if (!user.isPremium) {
      return { sessionId: 'offline-pending', gamification: null };
    }

    // Check duplicate clientSessionId (scoped to this user - clientSessionId
    // is only `${exerciseId}-${Date.now()}`, so two different users can
    // collide on the same millisecond and must not dedupe against each other)
    const existing = await ctx.db
      .query("exerciseSessions")
      .withIndex("by_userId_and_clientSessionId", (q) =>
        q.eq("userId", user._id).eq("clientSessionId", args.clientSessionId),
      )
      .first();

    if (existing) {
      // Same session already processed by an earlier (successful but
      // unacknowledged) call - return the achievements that call actually
      // unlocked instead of a hardcoded null, otherwise a retry silently
      // drops the achievement notification even though the data is correct.
      const unlockedAchievements = existing.unlockedAchievementIds ?? [];
      return {
        sessionId: existing._id,
        gamification: unlockedAchievements.length > 0 ? { unlockedAchievements } : null,
      };
    }

    const sessionId = await ctx.db.insert("exerciseSessions", {
      ...args,
      userId: user._id,
    });

    // 2. Streak Update
    const existingStreak = await ctx.db
      .query("streaks")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    const streakState = existingStreak
      ? {
          currentStreak: existingStreak.currentStreak,
          longestStreak: existingStreak.longestStreak,
          lastActivityAt: existingStreak.lastActivityAt,
          freezesAvailable: existingStreak.freezesAvailable ?? 0,
        }
      : null;

    const newStreakState = calculateStreakUpdate(
      streakState,
      args.completedAt,
      user.timezone || "UTC",
    );

    if (existingStreak) {
      // Sadece tarih yeni ise patch at
      if (newStreakState.lastActivityAt >= existingStreak.lastActivityAt) {
        await ctx.db.patch(existingStreak._id, newStreakState);
      }
    } else {
      await ctx.db.insert("streaks", {
        userId: user._id,
        ...newStreakState,
      });
    }

    // 4. Aggregate Statistics Updates
    // A) userStatistics
    const existingUserStats = await ctx.db
      .query("userStatistics")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();
    if (existingUserStats) {
      await ctx.db.patch(existingUserStats._id, {
        totalTrainingTimeMs: existingUserStats.totalTrainingTimeMs + args.durationMs,
        totalSessions: existingUserStats.totalSessions + 1,
      });
    } else {
      await ctx.db.insert("userStatistics", {
        userId: user._id,
        totalTrainingTimeMs: args.durationMs,
        totalSessions: 1,
      });
    }

    // B) exerciseStatistics
    const existingExStats = await ctx.db
      .query("exerciseStatistics")
      .withIndex("by_userId_and_type", (q) => q.eq("userId", user._id).eq("exerciseType", args.exerciseType))
      .unique();
    const wpm = args.metrics?.wpm ?? 0;
    if (existingExStats) {
      await ctx.db.patch(existingExStats._id, {
        bestScore: Math.max(existingExStats.bestScore, args.score),
        scoreSum: existingExStats.scoreSum + args.score,
        bestWpm: Math.max(existingExStats.bestWpm, wpm),
        wpmSum: existingExStats.wpmSum + wpm,
        attemptCount: existingExStats.attemptCount + 1,
      });
    } else {
      await ctx.db.insert("exerciseStatistics", {
        userId: user._id,
        exerciseType: args.exerciseType,
        bestScore: args.score,
        scoreSum: args.score,
        bestWpm: wpm,
        wpmSum: wpm,
        attemptCount: 1,
      });
    }

    // C) dailyStatistics
    // Bucket by the user's local date (same rule the streak uses), not by
    // UTC - otherwise a UTC+3 user's late-evening/early-morning sessions
    // land on the wrong day in every chart on the statistics screen.
    // `timestamp` stays the UTC instant of that local date's midnight so
    // the by_userId_and_timestamp range queries keep working unchanged.
    const dateStr = getLocalDateString(args.completedAt, user.timezone || 'UTC');
    const timestamp = Date.parse(`${dateStr}T00:00:00Z`);

    const existingDaily = await ctx.db
      .query("dailyStatistics")
      .withIndex("by_userId_and_date", (q) => q.eq("userId", user._id).eq("date", dateStr))
      .unique();
      
    const wpmC = args.metrics?.wpm !== undefined ? 1 : 0;
    const comp = args.metrics?.comprehensionAccuracy ?? 0;
    const compC = args.metrics?.comprehensionAccuracy !== undefined ? 1 : 0;
    
    let accSum = 0;
    let accC = 0;
    if (args.metrics?.correctCount !== undefined && args.metrics?.errorCount !== undefined) {
        const total = args.metrics.correctCount + args.metrics.errorCount;
        if (total > 0) {
          accSum = (args.metrics.correctCount / total);
          accC = 1;
        }
    }

    if (existingDaily) {
      await ctx.db.patch(existingDaily._id, {
        durationMs: existingDaily.durationMs + args.durationMs,
        scoreSum: existingDaily.scoreSum + args.score,
        scoreCount: existingDaily.scoreCount + 1,
        wpmSum: existingDaily.wpmSum + wpm,
        wpmCount: existingDaily.wpmCount + wpmC,
        compSum: existingDaily.compSum + comp,
        compCount: existingDaily.compCount + compC,
        accSum: existingDaily.accSum + accSum,
        accCount: existingDaily.accCount + accC,
      });
    } else {
      await ctx.db.insert("dailyStatistics", {
        userId: user._id,
        date: dateStr,
        timestamp,
        durationMs: args.durationMs,
        scoreSum: args.score,
        scoreCount: 1,
        wpmSum: wpm,
        wpmCount: wpmC,
        compSum: comp,
        compCount: compC,
        accSum: accSum,
        accCount: accC,
      });
    }

    // 4. Gamification (XP, Level, Achievements)
    // Session count only gates exact-match achievements at 1 and 10, so a
    // bounded read is enough - no need to collect every session a
    // long-time user has ever done.
    const recentUserSessions = await ctx.db
      .query("exerciseSessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .take(11);

    const isDailyGoalCompleted = false; // Simplified for now, or could check total duration today
    const gamificationResult = await processGamification(
      ctx.db,
      user._id,
      args.score,
      args.metrics?.wpm,
      args.metrics?.comprehensionAccuracy,
      recentUserSessions.length + 1, // include this session (capped at 11, only exact-match checks at 1/10 need this)
      newStreakState.currentStreak,
      isDailyGoalCompleted,
    );

    // Persist which achievements this session unlocked so a later dedup'd
    // retry (see the `existing` branch above) can return the same result
    // instead of re-running processGamification and double-awarding XP.
    if (gamificationResult.unlockedAchievements.length > 0) {
      await ctx.db.patch(sessionId, {
        unlockedAchievementIds: gamificationResult.unlockedAchievements,
      });
    }

    return {
      sessionId,
      gamification: gamificationResult,
    };
  },
});
