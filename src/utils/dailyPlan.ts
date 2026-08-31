/**
 * Deterministic daily-plan exercise selection. Pure: no store access, no
 * Math.random. Same inputs -> same 4-step plan, so it can be recomputed
 * client-side at any time - same pattern as `streak.ts`.
 */

const WARMUP_POOL = ['peripheral', 'schulte', 'visual-search'] as const;
const MAIN_POOL = ['rsvp', 'pacer', 'chunking'] as const;
const COMPREHENSION_POOL = ['comprehension-speed', 'main-idea', 'keyword'] as const;

export const DAILY_PLAN_SIZE = 4;

/** Used only for an exercise type the user has never run. */
export const FALLBACK_MINUTES_PER_EXERCISE = 3;

/**
 * How long today's plan will actually take, from the user's own median
 * duration per exercise type. The flat "3 minutes each" it replaces was the
 * most decision-relevant string on the home screen and it was fiction - a
 * Schulte grid and a comprehension passage are not the same three minutes.
 * Median rather than mean so one abandoned 20-second run or one session left
 * open on a locked phone doesn't move the estimate.
 */
export function estimatePlanMinutes(
  exerciseTypes: string[],
  medianMsByType: Record<string, number | undefined>,
): number {
  const fallbackMs = FALLBACK_MINUTES_PER_EXERCISE * 60_000;
  const totalMs = exerciseTypes.reduce(
    (sum, type) => sum + (medianMsByType[type] ?? fallbackMs),
    0,
  );
  return Math.max(1, Math.round(totalMs / 60_000));
}

/** Median session duration per exercise type, in ms. */
export function medianDurationByType(
  sessions: readonly { exerciseType: string; durationMs: number }[],
): Record<string, number> {
  const byType = new Map<string, number[]>();
  for (const session of sessions) {
    if (session.durationMs <= 0) continue;
    const list = byType.get(session.exerciseType);
    if (list) list.push(session.durationMs);
    else byType.set(session.exerciseType, [session.durationMs]);
  }

  const result: Record<string, number> = {};
  for (const [type, durations] of byType) {
    durations.sort((a, b) => a - b);
    const mid = Math.floor(durations.length / 2);
    result[type] =
      durations.length % 2 === 0 ? (durations[mid - 1] + durations[mid]) / 2 : durations[mid];
  }
  return result;
}

export interface ExercisePerformance {
  averageScore: number;
  attemptCount: number;
}

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * `avoid` is a preference (don't repeat yesterday's plan) and is dropped when
 * honoring it would leave nothing to pick. `forbid` is a hard constraint (the
 * same exercise cannot appear twice in one plan) and survives that fallback -
 * conflating the two is what let a plan list the same exercise as both main
 * blocks once yesterday's plan already covered the pool.
 */
function pickWeakest(
  pool: readonly string[],
  performanceByType: Record<string, ExercisePerformance | undefined>,
  avoid: string[],
  seed: number,
  forbid: string[] = [],
): string {
  const allowed = pool.filter((type) => !forbid.includes(type));
  const candidates = allowed.filter((type) => !avoid.includes(type));
  const usable = candidates.length > 0 ? candidates : allowed;

  let weakest: string | null = null;
  let weakestScore = Infinity;
  for (const type of usable) {
    const perf = performanceByType[type];
    if (!perf || perf.attemptCount === 0) continue;
    if (perf.averageScore < weakestScore) {
      weakestScore = perf.averageScore;
      weakest = type;
    }
  }
  if (weakest) return weakest;

  // No history for anyone in the pool (cold start) - deterministic
  // date-seeded pick instead of Math.random so the plan stays reproducible.
  return usable[seed % usable.length];
}

/**
 * Selects today's 4-step plan: 1 warmup, 2 main blocks (distinct exercises),
 * 1 comprehension closer. Within each slot's fixed pool, prefers whichever
 * exercise the user is weakest at (lowest average session score); falls
 * back to a seeded pick when there's no performance history yet.
 */
export function selectDailyPlan(input: {
  dateSeed: string;
  performanceByType: Record<string, ExercisePerformance | undefined>;
  lastPlanTypes?: string[];
}): string[] {
  const { dateSeed, performanceByType, lastPlanTypes = [] } = input;
  const seed = hashSeed(dateSeed);

  const warmup = pickWeakest(WARMUP_POOL, performanceByType, lastPlanTypes, seed);
  const main1 = pickWeakest(MAIN_POOL, performanceByType, lastPlanTypes, seed + 1);
  const main2 = pickWeakest(MAIN_POOL, performanceByType, lastPlanTypes, seed + 2, [main1]);
  const comprehension = pickWeakest(COMPREHENSION_POOL, performanceByType, lastPlanTypes, seed + 3);

  return [warmup, main1, main2, comprehension];
}
