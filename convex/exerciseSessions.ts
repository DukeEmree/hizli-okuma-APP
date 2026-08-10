import { getPeriodString } from "../src/utils/leaderboard";
import { calculateStreakUpdate } from "../src/utils/streak";

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

    // Check duplicate clientSessionId
    const existing = await ctx.db
      .query("exerciseSessions")
      .withIndex("by_clientSessionId", (q) =>
        q.eq("clientSessionId", args.clientSessionId),
      )
      .first();

    if (existing) {
      return { sessionId: existing._id, gamification: null };
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

    // 3. Leaderboard Update
    if (args.score > 0) {
      const periods: ("allTime" | "monthly" | "weekly")[] = [
        "allTime",
        "monthly",
        "weekly",
      ];

      for (const p of periods) {
        const periodStr = getPeriodString(args.completedAt, p);

        const existingEntry = await ctx.db
          .query("leaderboardEntries")
          .withIndex("by_userId_and_period", (q) =>
            q.eq("userId", user._id).eq("period", periodStr),
          )
          .unique();

        if (existingEntry) {
          await ctx.db.patch(existingEntry._id, {
            score: existingEntry.score + args.score,
          });
        } else {
          await ctx.db.insert("leaderboardEntries", {
            userId: user._id,
            period: periodStr,
            score: args.score,
          });
        }
      }
    }
    // 4. Gamification (XP, Level, Achievements)
    // Find how many total sessions this user has completed today/all-time
    const allUserSessions = await ctx.db
      .query("exerciseSessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const isDailyGoalCompleted = false; // Simplified for now, or could check total duration today
    const gamificationResult = await processGamification(
      ctx.db,
      user._id,
      args.score,
      args.metrics?.wpm,
      args.metrics?.comprehensionAccuracy,
      allUserSessions.length + 1, // include this session
      newStreakState.currentStreak,
      isDailyGoalCompleted,
    );

    return {
      sessionId,
      gamification: gamificationResult,
    };
  },
});
