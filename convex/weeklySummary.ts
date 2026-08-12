// convex/weeklySummary.ts (pure section — DB-touching exports added in Task 3)
import type { WeeklySummary } from "../src/utils/weeklySummary";

/** Every push/local notification for this feature deep-links here. */
export const WEEKLY_SUMMARY_SCREEN = "/(app)/weekly-summary";

/** Used when a user has no `timezone` set yet (matches the app's primary market). */
export const DEFAULT_TIMEZONE = "Europe/Istanbul";

export interface WeeklySummaryNotification {
  title: string;
  body: string;
  data: { screen: string };
}

/**
 * Null for an empty week — the digest must skip sending entirely rather than
 * nag a user who did nothing this week.
 */
export function decideWeeklySummaryNotification(summary: WeeklySummary): WeeklySummaryNotification | null {
  if (summary.isEmpty) {
    return null;
  }

  let trendClause = "";
  if (summary.wpmDeltaPercent !== null) {
    trendClause =
      summary.wpmDeltaPercent >= 0
        ? `, hızın %${summary.wpmDeltaPercent} arttı 📈`
        : `, hızın %${Math.abs(summary.wpmDeltaPercent)} azaldı`;
  }

  return {
    title: "Haftalık Özetin Hazır",
    body: `Bu hafta ${summary.totalMinutes} dakika çalıştın${trendClause}.`,
    data: { screen: WEEKLY_SUMMARY_SCREEN },
  };
}

/**
 * True at hour-granularity when it's currently Sunday 20:00 in `timezone`.
 * The cron ticks once an hour, so matching to the minute would miss every tick.
 */
export function isWeeklyDigestHour(nowUtc: number, timezone: string): boolean {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
      hour: "numeric",
      hourCycle: "h23",
    }).formatToParts(new Date(nowUtc));
    const weekday = parts.find((p) => p.type === "weekday")?.value;
    const hour = parts.find((p) => p.type === "hour")?.value;
    return weekday === "Sun" && hour === "20";
  } catch {
    return false;
  }
}

import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import type { PaginationResult } from "convex/server";
import { internalQuery, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import { getLocalDateString } from "../src/utils/streak";
import { buildWeeklySummary, type DailyStatInput } from "../src/utils/weeklySummary";

const DAY_MS = 24 * 60 * 60 * 1000;
/** Read enough trailing history to cover this week and last week's comparison. */
const HISTORY_DAYS = 14;

export const listUsersPage = internalQuery({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db.query("users").paginate(args.paginationOpts);
  },
});

// Bounded to at most HISTORY_DAYS rows (one `dailyStatistics` row per user
// per calendar day), so `.collect()` on this indexed range is safe.
export const getUserWeeklySummary = internalQuery({
  args: { userId: v.id("users"), timezone: v.string(), now: v.number() },
  handler: async (ctx, args) => {
    const todayDateStr = getLocalDateString(args.now, args.timezone);
    const todayTimestamp = Date.parse(`${todayDateStr}T00:00:00Z`);
    const thresholdTimestamp = todayTimestamp - (HISTORY_DAYS - 1) * DAY_MS;

    const rows = await ctx.db
      .query("dailyStatistics")
      .withIndex("by_userId_and_timestamp", (q) =>
        q.eq("userId", args.userId).gte("timestamp", thresholdTimestamp),
      )
      .collect();

    const dailyStats: DailyStatInput[] = rows.map((row) => ({
      date: row.date,
      durationMs: row.durationMs,
      avgWpm: row.wpmCount > 0 ? Math.round(row.wpmSum / row.wpmCount) : null,
      sessionCount: row.scoreCount,
    }));

    const streak = await ctx.db
      .query("streaks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    return buildWeeklySummary(dailyStats, todayDateStr, streak?.currentStreak ?? 0);
  },
});

// Ticks hourly; for each tick, only users whose local time is currently
// Sunday 20:00 are candidates (see `isWeeklyDigestHour`). Free/guest users
// never appear here — they never sync `dailyStatistics` to the server, so
// `!user.isPremium` skips them before any per-user query runs.
export const sendWeeklyDigest = internalAction({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let cursor: string | null = null;
    let isDone = false;

    while (!isDone) {
      const page: PaginationResult<Doc<"users">> = await ctx.runQuery(internal.weeklySummary.listUsersPage, {
        paginationOpts: { numItems: 200, cursor },
      });

      for (const user of page.page) {
        if (
          !user.isPremium ||
          user.pushNotificationsEnabled === false ||
          user.progressNotificationsEnabled === false
        ) {
          continue;
        }

        const timezone = user.timezone || DEFAULT_TIMEZONE;
        if (!isWeeklyDigestHour(now, timezone)) {
          continue;
        }

        const summary = await ctx.runQuery(internal.weeklySummary.getUserWeeklySummary, {
          userId: user._id,
          timezone,
          now,
        });

        const notification = decideWeeklySummaryNotification(summary);
        if (!notification) {
          continue;
        }

        await ctx.runAction(internal.expoPush.sendPushToUser, {
          userId: user._id,
          title: notification.title,
          body: notification.body,
          data: notification.data,
        });
      }

      isDone = page.isDone;
      cursor = page.continueCursor;
    }

    return null;
  },
});
