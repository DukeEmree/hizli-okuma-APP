import { expect, test, describe } from 'bun:test';
import { buildTodaySnapshot, paragraphSeconds } from '../todayStats';
import type { PerformanceStats } from '../localStatistics';

type Trend = PerformanceStats['dailyTrends'][number];

function trend(date: string, avgWpm: number | null, extra: Partial<Trend> = {}): Trend {
  return {
    date,
    avgWpm,
    avgComprehension: null,
    avgAccuracy: null,
    avgScore: null,
    durationMs: 0,
    sessionCount: 0,
    ...extra,
  };
}

describe('buildTodaySnapshot', () => {
  test('reports today only, and its delta against the preceding days', () => {
    const snapshot = buildTodaySnapshot(
      [
        trend('2026-08-29', 200),
        trend('2026-08-30', 240),
        trend('2026-08-31', 260, {
          avgComprehension: 0.8,
          durationMs: 9 * 60_000,
          sessionCount: 4,
        }),
      ],
      '2026-08-31',
    );

    expect(snapshot.wpm).toBe(260);
    expect(snapshot.comprehension).toBe(0.8);
    expect(snapshot.minutes).toBe(9);
    expect(snapshot.sessionCount).toBe(4);
    expect(snapshot.baselineDays).toBe(2);
    expect(snapshot.wpmDelta).toBe(40); // 260 - mean(200, 240)
  });

  test('no session today reads as null rather than borrowing an older number', () => {
    const snapshot = buildTodaySnapshot([trend('2026-08-30', 240)], '2026-08-31');

    expect(snapshot.wpm).toBeNull();
    expect(snapshot.wpmDelta).toBeNull();
    expect(snapshot.minutes).toBe(0);
  });

  test('first ever day has no baseline to compare against', () => {
    const snapshot = buildTodaySnapshot([trend('2026-08-31', 210)], '2026-08-31');

    expect(snapshot.wpm).toBe(210);
    expect(snapshot.baselineDays).toBe(0);
    expect(snapshot.wpmDelta).toBeNull();
  });

  test('days without a WPM reading do not dilute the baseline', () => {
    const snapshot = buildTodaySnapshot(
      [trend('2026-08-29', null), trend('2026-08-30', 200), trend('2026-08-31', 300)],
      '2026-08-31',
    );

    expect(snapshot.baselineDays).toBe(1);
    expect(snapshot.wpmDelta).toBe(100);
  });
});

describe('paragraphSeconds', () => {
  test('converts a reading speed into the cost of one exam paragraph', () => {
    expect(paragraphSeconds(90)).toBe(60);
    expect(paragraphSeconds(180)).toBe(30);
  });
});
