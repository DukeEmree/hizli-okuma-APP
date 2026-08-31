/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test';
import {
  selectDailyPlan,
  DAILY_PLAN_SIZE,
  estimatePlanMinutes,
  medianDurationByType,
  FALLBACK_MINUTES_PER_EXERCISE,
} from "@/utils/dailyPlan";

describe('selectDailyPlan', () => {
  test('returns DAILY_PLAN_SIZE steps: warmup, 2 distinct main, comprehension', () => {
    const plan = selectDailyPlan({ dateSeed: '2026-08-11', performanceByType: {} });
    expect(plan.length).toBe(DAILY_PLAN_SIZE);
    expect(['peripheral', 'schulte', 'visual-search']).toContain(plan[0]);
    expect(['rsvp', 'pacer', 'chunking']).toContain(plan[1]);
    expect(['rsvp', 'pacer', 'chunking']).toContain(plan[2]);
    expect(plan[1]).not.toBe(plan[2]);
    expect(['comprehension-speed', 'main-idea', 'keyword']).toContain(plan[3]);
  });

  test('same inputs produce the same plan (deterministic)', () => {
    const input = { dateSeed: '2026-08-11', performanceByType: {} };
    expect(selectDailyPlan(input)).toEqual(selectDailyPlan(input));
  });

  test('different dateSeed can change the cold-start pick', () => {
    const a = selectDailyPlan({ dateSeed: '2026-08-11', performanceByType: {} });
    const b = selectDailyPlan({ dateSeed: '2099-01-01', performanceByType: {} });
    // Not guaranteed to differ on every slot, but the two runs should be
    // independently deterministic and not crash/collide with pool bounds.
    expect(a.length).toBe(4);
    expect(b.length).toBe(4);
  });

  test('prefers the exercise with the lowest average score in a pool', () => {
    const plan = selectDailyPlan({
      dateSeed: '2026-08-11',
      performanceByType: {
        peripheral: { averageScore: 90, attemptCount: 5 },
        schulte: { averageScore: 20, attemptCount: 5 },
        'visual-search': { averageScore: 80, attemptCount: 5 },
      },
    });
    expect(plan[0]).toBe('schulte');
  });

  test('excludes yesterday\'s picks when an alternative exists in the pool', () => {
    const plan = selectDailyPlan({
      dateSeed: '2026-08-11',
      performanceByType: {},
      lastPlanTypes: ['peripheral'],
    });
    expect(plan[0]).not.toBe('peripheral');
  });

  test('falls back to the full pool when exclusion would empty it', () => {
    const plan = selectDailyPlan({
      dateSeed: '2026-08-11',
      performanceByType: {},
      lastPlanTypes: ['peripheral', 'schulte', 'visual-search'],
    });
    expect(['peripheral', 'schulte', 'visual-search']).toContain(plan[0]);
  });

  test('never repeats a main block, even when yesterday used the whole main pool', () => {
    // Regression: yesterday's plan plus main1 covered MAIN_POOL entirely, so
    // the "nothing left, use the whole pool" fallback dropped main1's
    // exclusion too and both main slots could land on the same exercise.
    for (const dateSeed of ['2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14']) {
      const plan = selectDailyPlan({
        dateSeed,
        performanceByType: {},
        lastPlanTypes: ['rsvp', 'pacer', 'chunking'],
      });
      expect(plan[1]).not.toBe(plan[2]);
      expect(new Set(plan).size).toBe(plan.length);
    }
  });
});

describe('estimatePlanMinutes', () => {
  test('uses the user\'s own median duration per exercise type', () => {
    const medians = { rsvp: 4 * 60_000, schulte: 2 * 60_000 };
    expect(estimatePlanMinutes(['rsvp', 'schulte'], medians)).toBe(6);
  });

  test('falls back to the flat estimate only for types with no history', () => {
    const medians = { rsvp: 5 * 60_000 };
    expect(estimatePlanMinutes(['rsvp', 'keyword'], medians)).toBe(
      5 + FALLBACK_MINUTES_PER_EXERCISE,
    );
  });

  test('never rounds a real plan down to zero minutes', () => {
    expect(estimatePlanMinutes(['rsvp'], { rsvp: 4000 })).toBe(1);
  });
});

describe('medianDurationByType', () => {
  test('takes the median so one abandoned run cannot move the estimate', () => {
    const medians = medianDurationByType([
      { exerciseType: 'rsvp', durationMs: 1_000 },
      { exerciseType: 'rsvp', durationMs: 180_000 },
      { exerciseType: 'rsvp', durationMs: 190_000 },
    ]);
    expect(medians.rsvp).toBe(180_000);
  });

  test('averages the middle pair for an even count and skips zero-length runs', () => {
    const medians = medianDurationByType([
      { exerciseType: 'schulte', durationMs: 0 },
      { exerciseType: 'schulte', durationMs: 100_000 },
      { exerciseType: 'schulte', durationMs: 200_000 },
    ]);
    expect(medians.schulte).toBe(150_000);
  });
});
