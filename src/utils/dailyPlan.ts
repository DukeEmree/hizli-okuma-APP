/**
 * Deterministic daily-plan exercise selection. Pure: no store access, no
 * Math.random. Same inputs -> same 4-step plan, so it can be recomputed
 * client-side at any time - same pattern as `streak.ts`.
 */

const WARMUP_POOL = ['peripheral', 'schulte', 'visual-search'] as const;
const MAIN_POOL = ['rsvp', 'pacer', 'chunking'] as const;
const COMPREHENSION_POOL = ['comprehension-speed', 'main-idea', 'keyword'] as const;

export const DAILY_PLAN_SIZE = 4;

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

function pickWeakest(
  pool: readonly string[],
  performanceByType: Record<string, ExercisePerformance | undefined>,
  exclude: string[],
  seed: number,
): string {
  const candidates = pool.filter((type) => !exclude.includes(type));
  const usable = candidates.length > 0 ? candidates : pool;

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
  const main2 = pickWeakest(MAIN_POOL, performanceByType, [...lastPlanTypes, main1], seed + 2);
  const comprehension = pickWeakest(COMPREHENSION_POOL, performanceByType, lastPlanTypes, seed + 3);

  return [warmup, main1, main2, comprehension];
}
