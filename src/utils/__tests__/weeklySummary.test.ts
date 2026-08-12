/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test';
import { getWeekBounds, buildWeeklySummary, type DailyStatInput } from '@/utils/weeklySummary';

describe('getWeekBounds', () => {
  test('mid-week date resolves to its Monday-Sunday week', () => {
    expect(getWeekBounds('2026-08-12')).toEqual({ weekStart: '2026-08-10', weekEnd: '2026-08-16' });
  });

  test('Monday resolves to itself as weekStart', () => {
    expect(getWeekBounds('2026-08-10')).toEqual({ weekStart: '2026-08-10', weekEnd: '2026-08-16' });
  });

  test('Sunday resolves to the week it ends, not the next one', () => {
    expect(getWeekBounds('2026-08-16')).toEqual({ weekStart: '2026-08-10', weekEnd: '2026-08-16' });
  });
});

describe('buildWeeklySummary', () => {
  const dailyStats: DailyStatInput[] = [
    { date: '2026-08-05', durationMs: 400_000, avgWpm: 280, sessionCount: 1 }, // last week
    { date: '2026-08-10', durationMs: 600_000, avgWpm: 300, sessionCount: 2 }, // this week (Mon)
    { date: '2026-08-12', durationMs: 300_000, avgWpm: 320, sessionCount: 1 }, // this week (Wed)
    { date: '2026-08-20', durationMs: 999_999, avgWpm: 999, sessionCount: 5 }, // next week, excluded
  ];

  test('sums only this week\'s minutes and sessions', () => {
    const summary = buildWeeklySummary(dailyStats, '2026-08-12', 4);
    expect(summary.totalMinutes).toBe(15);
    expect(summary.sessionCount).toBe(3);
    expect(summary.isEmpty).toBe(false);
    expect(summary.streakDays).toBe(4);
  });

  test('averages WPM across each week\'s days and computes delta percent', () => {
    const summary = buildWeeklySummary(dailyStats, '2026-08-12', 0);
    expect(summary.avgWpmThisWeek).toBe(310); // (300 + 320) / 2
    expect(summary.avgWpmLastWeek).toBe(280);
    expect(summary.wpmDeltaPercent).toBe(11); // round(((310-280)/280)*100)
  });

  test('empty week has null WPM figures and isEmpty true', () => {
    const summary = buildWeeklySummary([], '2026-08-12', 2);
    expect(summary.isEmpty).toBe(true);
    expect(summary.totalMinutes).toBe(0);
    expect(summary.sessionCount).toBe(0);
    expect(summary.avgWpmThisWeek).toBeNull();
    expect(summary.wpmDeltaPercent).toBeNull();
  });

  test('no last-week data means delta is null, not a divide-by-zero result', () => {
    const thisWeekOnly: DailyStatInput[] = [
      { date: '2026-08-11', durationMs: 100_000, avgWpm: 250, sessionCount: 1 },
    ];
    const summary = buildWeeklySummary(thisWeekOnly, '2026-08-12', 1);
    expect(summary.avgWpmLastWeek).toBeNull();
    expect(summary.wpmDeltaPercent).toBeNull();
  });

  test('last week averaging to exactly 0 WPM guards the delta division', () => {
    const dataWithZero: DailyStatInput[] = [
      { date: '2026-08-05', durationMs: 100_000, avgWpm: 0, sessionCount: 1 },
      { date: '2026-08-11', durationMs: 100_000, avgWpm: 250, sessionCount: 1 },
    ];
    const summary = buildWeeklySummary(dataWithZero, '2026-08-12', 0);
    expect(summary.avgWpmLastWeek).toBe(0);
    expect(summary.wpmDeltaPercent).toBeNull();
  });
});
