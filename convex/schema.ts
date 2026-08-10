import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    displayName: v.optional(v.string()),
    nickname: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    timezone: v.optional(v.string()),
    isPremium: v.optional(v.boolean()),
    premiumExpiresAt: v.optional(v.number()),
    
    // Onboarding fields
    isOnboarded: v.optional(v.boolean()),
    onboardingReason: v.optional(v.string()),
    trainingGoalMins: v.optional(v.number()),
    initialWpm: v.optional(v.number()),
    initialComprehension: v.optional(v.number()),
    startingDifficulty: v.optional(v.number()),

    // Gamification fields
    xp: v.optional(v.number()),
    level: v.optional(v.number()),
  }).index('by_clerkId', ['clerkId']),

  userAchievements: defineTable({
    userId: v.id('users'),
    achievementId: v.string(),
    unlockedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_achievementId', ['userId', 'achievementId']),

  exerciseSessions: defineTable({
    userId: v.id('users'),
    clientSessionId: v.string(),
    exerciseId: v.string(),
    exerciseType: v.string(),
    startedAt: v.number(),
    completedAt: v.number(),
    durationMs: v.number(),
    difficulty: v.number(),
    score: v.number(),
    metrics: v.optional(v.any()), // flexible object for specific exercise metrics
    algorithmVersion: v.optional(v.number()),
  }).index('by_userId', ['userId']).index('by_userId_and_clientSessionId', ['userId', 'clientSessionId']),

  exerciseProgress: defineTable({
    userId: v.id('users'),
    exerciseId: v.string(), // 'rsvp', 'chunking', etc.
    bestScore: v.number(),
    bestWpm: v.optional(v.number()),
    attemptCount: v.number(),
    currentLevel: v.number(),
    consecutiveSuccesses: v.number(),
    consecutiveFailures: v.number(),
    historicalBest: v.number(),
  }).index('by_userId', ['userId']).index('by_userId_and_exercise', ['userId', 'exerciseId']),

  streaks: defineTable({
    userId: v.id('users'),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActivityAt: v.number(),
  }).index('by_userId', ['userId']),

  leaderboardEntries: defineTable({
    userId: v.id('users'),
    period: v.string(), // "ALL_TIME", "MONTH_YYYY_MM", "WEEK_YYYY_WW"
    score: v.number(),
  }).index('by_period_and_score', ['period', 'score']).index('by_userId_and_period', ['userId', 'period']),

  userStatistics: defineTable({
    userId: v.id('users'),
    totalTrainingTimeMs: v.number(),
    totalSessions: v.number(),
  }).index('by_userId', ['userId']),

  exerciseStatistics: defineTable({
    userId: v.id('users'),
    exerciseType: v.string(),
    bestScore: v.number(),
    scoreSum: v.number(),
    bestWpm: v.number(),
    wpmSum: v.number(),
    attemptCount: v.number(),
  }).index('by_userId', ['userId']).index('by_userId_and_type', ['userId', 'exerciseType']),

  dailyStatistics: defineTable({
    userId: v.id('users'),
    date: v.string(), // "2024-03-24"
    timestamp: v.number(), // start of day timestamp
    wpmSum: v.number(),
    wpmCount: v.number(),
    compSum: v.number(),
    compCount: v.number(),
    accSum: v.number(),
    accCount: v.number(),
    scoreSum: v.number(),
    scoreCount: v.number(),
    durationMs: v.number(),
  }).index('by_userId', ['userId']).index('by_userId_and_date', ['userId', 'date']).index('by_userId_and_timestamp', ['userId', 'timestamp']),
});
