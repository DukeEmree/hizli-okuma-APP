import type { PerformanceStats } from './localStatistics';

/**
 * A paragraph question in YKS/LGS runs roughly this long. It is the reference
 * point that turns a bare WPM into something an exam student can act on -
 * "how long does one paragraph cost me" rather than an unanchored number.
 */
export const EXAM_PARAGRAPH_WORDS = 90;

export interface TodaySnapshot {
  /** Today's average WPM, or null when nothing was read today. */
  wpm: number | null;
  /** Today's average comprehension as a 0-1 ratio. */
  comprehension: number | null;
  /** Minutes trained today. */
  minutes: number;
  sessionCount: number;
  /** Today's WPM minus the mean of the preceding days in the window. */
  wpmDelta: number | null;
  /** How many preceding days carried a WPM reading, so the UI can say so. */
  baselineDays: number;
  /** Mean WPM over those preceding days, or null when there are none. */
  baselineWpm: number | null;
}

/**
 * Reduces a daily-trend list to "what happened today", plus how today compares
 * to the days before it in the same window.
 *
 * Deliberately never falls back to an all-time or best value: the home screen
 * used to label an onboarding *best* WPM as an average, which is the one thing
 * a measuring instrument must not do. No session today means null, and the UI
 * says so.
 */
export function buildTodaySnapshot(
  dailyTrends: PerformanceStats['dailyTrends'],
  today: string,
): TodaySnapshot {
  const todayTrend = dailyTrends.find((d) => d.date === today);

  let baselineSum = 0;
  let baselineDays = 0;
  for (const day of dailyTrends) {
    if (day.date >= today || day.avgWpm == null) continue;
    baselineSum += day.avgWpm;
    baselineDays += 1;
  }

  const wpm = todayTrend?.avgWpm ?? null;
  const baselineWpm = baselineDays > 0 ? Math.round(baselineSum / baselineDays) : null;
  const wpmDelta = wpm != null && baselineWpm != null ? wpm - baselineWpm : null;

  return {
    wpm,
    comprehension: todayTrend?.avgComprehension ?? null,
    minutes: Math.round((todayTrend?.durationMs ?? 0) / 60_000),
    sessionCount: todayTrend?.sessionCount ?? 0,
    wpmDelta,
    baselineDays,
    baselineWpm,
  };
}

/** Seconds an exam-length paragraph takes at `wpm`. */
export function paragraphSeconds(wpm: number): number {
  return Math.round((EXAM_PARAGRAPH_WORDS / wpm) * 60);
}
