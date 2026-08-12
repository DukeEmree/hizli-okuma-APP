/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test';
import { decideWeeklySummaryNotification, isWeeklyDigestHour, WEEKLY_SUMMARY_SCREEN } from '../weeklySummary';
import type { WeeklySummary } from '../../src/utils/weeklySummary';

function summary(overrides: Partial<WeeklySummary> = {}): WeeklySummary {
  return {
    weekStartDate: '2026-08-10',
    weekEndDate: '2026-08-16',
    totalMinutes: 47,
    sessionCount: 6,
    avgWpmThisWeek: 320,
    avgWpmLastWeek: 300,
    wpmDeltaPercent: 7,
    streakDays: 4,
    isEmpty: false,
    ...overrides,
  };
}

describe('decideWeeklySummaryNotification', () => {
  test('empty week produces no notification (no nagging)', () => {
    expect(decideWeeklySummaryNotification(summary({ isEmpty: true, sessionCount: 0, totalMinutes: 0 }))).toBeNull();
  });

  test('positive trend mentions the increase and deep-links to the summary screen', () => {
    const result = decideWeeklySummaryNotification(summary({ wpmDeltaPercent: 7 }));
    expect(result).not.toBeNull();
    expect(result?.body).toContain('47 dakika');
    expect(result?.body).toContain('%7 arttı');
    expect(result?.data).toEqual({ screen: WEEKLY_SUMMARY_SCREEN });
  });

  test('negative trend mentions the decrease without a negative sign', () => {
    const result = decideWeeklySummaryNotification(summary({ wpmDeltaPercent: -12 }));
    expect(result?.body).toContain('%12 azaldı');
  });

  test('no comparison data omits the trend clause entirely', () => {
    const result = decideWeeklySummaryNotification(summary({ wpmDeltaPercent: null }));
    expect(result?.body).toBe('Bu hafta 47 dakika çalıştın.');
  });
});

describe('isWeeklyDigestHour', () => {
  test('matches Sunday 20:00 in the given timezone', () => {
    // 2026-08-16T17:00:00Z is 2026-08-16 20:00 in Europe/Istanbul (UTC+3), a Sunday.
    const nowUtc = Date.UTC(2026, 7, 16, 17, 0, 0);
    expect(isWeeklyDigestHour(nowUtc, 'Europe/Istanbul')).toBe(true);
  });

  test('does not match the same instant in a different timezone', () => {
    const nowUtc = Date.UTC(2026, 7, 16, 17, 0, 0);
    expect(isWeeklyDigestHour(nowUtc, 'America/New_York')).toBe(false);
  });

  test('does not match Sunday at a different hour', () => {
    const nowUtc = Date.UTC(2026, 7, 16, 10, 0, 0); // 13:00 in Istanbul
    expect(isWeeklyDigestHour(nowUtc, 'Europe/Istanbul')).toBe(false);
  });

  test('does not match Monday at 20:00', () => {
    const nowUtc = Date.UTC(2026, 7, 17, 17, 0, 0); // Monday 20:00 in Istanbul
    expect(isWeeklyDigestHour(nowUtc, 'Europe/Istanbul')).toBe(false);
  });
});
