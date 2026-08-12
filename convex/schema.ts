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

    // undefined is treated as enabled (matches client default) — only an
    // explicit false suppresses server-sent push notifications.
    pushNotificationsEnabled: v.optional(v.boolean()),

    // Client-side `progressNotificationsEnabled` (settingsStore) mirrored here so
    // server-sent progress pushes (e.g. the weekly summary digest) can honor it.
    // Same convention as pushNotificationsEnabled: undefined is treated as enabled,
    // only an explicit false suppresses.
    progressNotificationsEnabled: v.optional(v.boolean()),

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

  // One row per (user, device). A device's Expo push token is looked up by
  // `by_token` on registration so it can be reassigned when the same device
  // logs into a different account, instead of leaving it bound to the old user.
  pushTokens: defineTable({
    userId: v.id('users'),
    token: v.string(),
    platform: v.union(v.literal('ios'), v.literal('android')),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_userId', ['userId']).index('by_token', ['token']),

  // Dedup ledger for RevenueCat webhook events. `by_eventId` is unique per
  // RevenueCat event id; the check-then-insert in revenuecatEvents.ts is
  // race-safe because Convex mutations are serialized transactions (OCC).
  processedRevenueCatEvents: defineTable({
    eventId: v.string(),
    eventType: v.string(),
    clerkId: v.string(),
    processedAt: v.number(),
    notificationSent: v.optional(v.boolean()),
    notificationError: v.optional(v.string()),
  }).index('by_eventId', ['eventId']),

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
    // Achievements unlocked by gamification processing at insert time, so a
    // dedup'd retry (same clientSessionId) can return the original result
    // instead of silently dropping the notification or re-running
    // processGamification (which would double-award XP).
    unlockedAchievementIds: v.optional(v.array(v.string())),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_and_clientSessionId', ['userId', 'clientSessionId'])
    .index('by_userId_and_exerciseType', ['userId', 'exerciseType'])
    // Lets the dashboard read only today's sessions as an index range
    // instead of scanning every session the user has ever completed.
    .index('by_userId_and_completedAt', ['userId', 'completedAt']),

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
    // Unspent streak freezes: one is earned every 7 consecutive days (max 2)
    // and one is spent per missed day to keep a streak alive. Optional
    // because rows written before freezes existed don't have the field.
    freezesAvailable: v.optional(v.number()),
  }).index('by_userId', ['userId']),

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
