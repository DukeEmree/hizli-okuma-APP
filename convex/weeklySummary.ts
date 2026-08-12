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
