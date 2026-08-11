import type { LocalSession } from '@/stores/localHistoryStore';
import { getLocalDateString } from '@/utils/streak';

export type TimeRange = '7d' | '30d' | '90d' | 'all';

/**
 * Same shape `convex/statistics.ts` `getPerformanceStats` returns, so the
 * statistics dashboard can render on-device history for free users without
 * knowing where the numbers came from.
 */
export interface PerformanceStats {
  totalTrainingTimeMs: number;
  totalSessions: number;
  dailyTrends: {
    date: string;
    avgWpm: number | null;
    avgComprehension: number | null;
    avgAccuracy: number | null;
    avgScore: number | null;
    durationMs: number;
    sessionCount: number;
  }[];
  exerciseStats: {
    type: string;
    bestScore: number;
    averageScore: number;
    bestWpm: number;
    averageWpm: number | null;
    attemptCount: number;
  }[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

function thresholdFor(range: TimeRange, now: number): number {
  switch (range) {
    case '7d':
      return now - 7 * DAY_MS;
    case '30d':
      return now - 30 * DAY_MS;
    case '90d':
      return now - 90 * DAY_MS;
    default:
      return 0;
  }
}

interface DayBucket {
  durationMs: number;
  scoreSum: number;
  scoreCount: number;
  wpmSum: number;
  wpmCount: number;
  compSum: number;
  compCount: number;
  accSum: number;
  accCount: number;
}

interface ExerciseBucket {
  bestScore: number;
  scoreSum: number;
  bestWpm: number;
  wpmSum: number;
  wpmCount: number;
  attemptCount: number;
}

/**
 * Aggregates on-device sessions into the dashboard's statistics shape.
 *
 * Mirrors the server aggregation deliberately: days are bucketed by the
 * user's local date (not UTC), comprehension and accuracy stay as 0-1 ratios
 * because the dashboard scales them itself, and averages divide by the count
 * of sessions that actually carried that metric rather than by all sessions.
 */
export function buildLocalStats(
  sessions: LocalSession[],
  range: TimeRange,
  now: number = Date.now(),
  timeZone: string = 'UTC',
): PerformanceStats {
  const threshold = thresholdFor(range, now);
  const inRange = sessions.filter((s) => s.completedAt >= threshold);

  const days = new Map<string, DayBucket>();
  const exercises = new Map<string, ExerciseBucket>();
  let totalTrainingTimeMs = 0;

  for (const session of inRange) {
    totalTrainingTimeMs += session.durationMs;

    const date = getLocalDateString(session.completedAt, timeZone);
    const day: DayBucket = days.get(date) ?? {
      durationMs: 0,
      scoreSum: 0,
      scoreCount: 0,
      wpmSum: 0,
      wpmCount: 0,
      compSum: 0,
      compCount: 0,
      accSum: 0,
      accCount: 0,
    };

    day.durationMs += session.durationMs;
    day.scoreSum += session.score;
    day.scoreCount += 1;

    const wpm = session.metrics?.wpm;
    if (typeof wpm === 'number') {
      day.wpmSum += wpm;
      day.wpmCount += 1;
    }

    const comprehension = session.metrics?.comprehensionAccuracy;
    if (typeof comprehension === 'number') {
      day.compSum += comprehension;
      day.compCount += 1;
    }

    const correct = session.metrics?.correctCount;
    const errors = session.metrics?.errorCount;
    if (typeof correct === 'number' && typeof errors === 'number' && correct + errors > 0) {
      day.accSum += correct / (correct + errors);
      day.accCount += 1;
    }

    days.set(date, day);

    const ex: ExerciseBucket = exercises.get(session.exerciseType) ?? {
      bestScore: 0,
      scoreSum: 0,
      bestWpm: 0,
      wpmSum: 0,
      wpmCount: 0,
      attemptCount: 0,
    };

    ex.attemptCount += 1;
    ex.scoreSum += session.score;
    ex.bestScore = Math.max(ex.bestScore, session.score);
    if (typeof wpm === 'number') {
      ex.wpmSum += wpm;
      ex.wpmCount += 1;
      ex.bestWpm = Math.max(ex.bestWpm, wpm);
    }

    exercises.set(session.exerciseType, ex);
  }

  const dailyTrends = [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, d]) => ({
      date,
      avgWpm: d.wpmCount > 0 ? Math.round(d.wpmSum / d.wpmCount) : null,
      avgComprehension: d.compCount > 0 ? d.compSum / d.compCount : null,
      avgAccuracy: d.accCount > 0 ? d.accSum / d.accCount : null,
      avgScore: d.scoreCount > 0 ? Math.round(d.scoreSum / d.scoreCount) : null,
      durationMs: d.durationMs,
      sessionCount: d.scoreCount,
    }));

  const exerciseStats = [...exercises.entries()].map(([type, ex]) => ({
    type,
    bestScore: ex.bestScore,
    averageScore: Math.round(ex.scoreSum / ex.attemptCount),
    bestWpm: ex.bestWpm,
    averageWpm: ex.wpmCount > 0 ? Math.round(ex.wpmSum / ex.wpmCount) : null,
    attemptCount: ex.attemptCount,
  }));

  return {
    totalTrainingTimeMs,
    totalSessions: inRange.length,
    dailyTrends,
    exerciseStats,
  };
}
