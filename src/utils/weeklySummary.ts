/**
 * One user-local calendar day's aggregate. Shape is deliberately the
 * intersection of what the server's `dailyStatistics` rows and the client's
 * `buildLocalStats` dailyTrends both carry, so `buildWeeklySummary` runs
 * identically for premium (server) and free/guest (local) users.
 */
export interface DailyStatInput {
  /** 'YYYY-MM-DD', already in the user's local timezone. */
  date: string;
  durationMs: number;
  avgWpm: number | null;
  sessionCount: number;
}

export interface WeeklySummary {
  weekStartDate: string;
  weekEndDate: string;
  totalMinutes: number;
  sessionCount: number;
  avgWpmThisWeek: number | null;
  avgWpmLastWeek: number | null;
  /** null when either week has no WPM data — never a divide-by-zero guess. */
  wpmDeltaPercent: number | null;
  streakDays: number;
  isEmpty: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return toDateStr(new Date(d.getTime() + days * DAY_MS));
}

/** Monday-anchored week (Mon..Sun) containing `dateStr`. */
export function getWeekBounds(dateStr: string): { weekStart: string; weekEnd: string } {
  const d = new Date(`${dateStr}T00:00:00Z`);
  const dayOfWeek = d.getUTCDay(); // 0 = Sunday .. 6 = Saturday
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = addDays(dateStr, -daysSinceMonday);
  const weekEnd = addDays(weekStart, 6);
  return { weekStart, weekEnd };
}

/** Unweighted mean of each day's own average — a simple week-level trend, not session-weighted. */
function averageWpm(days: DailyStatInput[]): number | null {
  const withWpm = days.filter((d): d is DailyStatInput & { avgWpm: number } => d.avgWpm !== null);
  if (withWpm.length === 0) return null;
  const sum = withWpm.reduce((acc, d) => acc + d.avgWpm, 0);
  return Math.round(sum / withWpm.length);
}

export function buildWeeklySummary(
  dailyStats: DailyStatInput[],
  todayDateStr: string,
  streakDays: number,
): WeeklySummary {
  const { weekStart, weekEnd } = getWeekBounds(todayDateStr);
  const lastWeekStart = addDays(weekStart, -7);
  const lastWeekEnd = addDays(weekStart, -1);

  const thisWeek = dailyStats.filter((d) => d.date >= weekStart && d.date <= weekEnd);
  const lastWeek = dailyStats.filter((d) => d.date >= lastWeekStart && d.date <= lastWeekEnd);

  const totalDurationMs = thisWeek.reduce((sum, d) => sum + d.durationMs, 0);
  const sessionCount = thisWeek.reduce((sum, d) => sum + d.sessionCount, 0);

  const avgWpmThisWeek = averageWpm(thisWeek);
  const avgWpmLastWeek = averageWpm(lastWeek);
  const wpmDeltaPercent =
    avgWpmThisWeek !== null && avgWpmLastWeek !== null && avgWpmLastWeek !== 0
      ? Math.round(((avgWpmThisWeek - avgWpmLastWeek) / avgWpmLastWeek) * 100)
      : null;

  return {
    weekStartDate: weekStart,
    weekEndDate: weekEnd,
    totalMinutes: Math.round(totalDurationMs / 60000),
    sessionCount,
    avgWpmThisWeek,
    avgWpmLastWeek,
    wpmDeltaPercent,
    streakDays,
    isEmpty: sessionCount === 0,
  };
}
