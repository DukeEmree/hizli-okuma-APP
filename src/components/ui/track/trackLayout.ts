import { getLocalDateString } from "@/utils/streak";

export type TrackPoint = {
  /** e.g. WPM for this slot. null = no session / empty slot. */
  value: number | null;
  /** 0..1 — how much of the bar is filled (e.g. comprehension ratio). */
  comprehension?: number;
  /** whether this slot continues an unbroken streak (drawn on the baseline). */
  streak?: boolean;
};

export type TrackBar = {
  /** 0..1, relative to the tallest bar in the dataset. */
  heightRatio: number;
  /** 0..1 */
  fillRatio: number;
  empty: boolean;
  streak: boolean;
};

export type DailyTrendInput = {
  date: string; // 'YYYY-MM-DD', local
  avgWpm: number | null;
  avgComprehension: number | null;
};

/**
 * Dense-fills the last `days` calendar days into TrackPoints from a sparse
 * daily-trend list (server `getPerformanceStats` / local `buildLocalStats`
 * both return this shape) — days without an entry become empty slots.
 */
export function buildTrackFromDailyTrends(
  dailyTrends: DailyTrendInput[],
  days: number,
  timeZone: string,
  now: number = Date.now(),
): TrackPoint[] {
  const byDate = new Map(dailyTrends.map((d) => [d.date, d]));
  const points: TrackPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const dateStr = getLocalDateString(now - i * 86400000, timeZone);
    const entry = byDate.get(dateStr);
    points.push({
      value: entry?.avgWpm ?? null,
      comprehension: entry?.avgComprehension ?? 0,
      streak: !!entry && entry.avgWpm != null,
    });
  }
  return points;
}

export function computeTrackLayout(data: TrackPoint[]): TrackBar[] {
  const max = Math.max(1, ...data.map((d) => d.value ?? 0));
  return data.map((d) => ({
    heightRatio: d.value == null ? 0 : d.value / max,
    fillRatio:
      d.value == null ? 0 : Math.min(1, Math.max(0, d.comprehension ?? 0)),
    empty: d.value == null,
    streak: !!d.streak,
  }));
}
