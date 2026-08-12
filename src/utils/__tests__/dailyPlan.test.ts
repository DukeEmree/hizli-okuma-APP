/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test';
import { selectDailyPlan, DAILY_PLAN_SIZE } from "@/utils/dailyPlan";

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
});
