/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test';
import { calculateStreakUpdate, getLocalDateString } from "@/utils/streak";

describe('Streak Utility', () => {

  describe('getLocalDateString', () => {
    test('UTC timestamp should map correctly for UTC timezone', () => {
      // 2026-08-09T10:00:00Z
      const date = new Date(Date.UTC(2026, 7, 9, 10, 0, 0)).getTime();
      expect(getLocalDateString(date, 'UTC')).toBe('2026-08-09');
    });

    test('Late night UTC could be next day in Istanbul', () => {
      // 2026-08-09T22:00:00Z -> Local time in Istanbul (UTC+3) is 01:00 AM on 2026-08-10
      const date = new Date(Date.UTC(2026, 7, 9, 22, 0, 0)).getTime();
      expect(getLocalDateString(date, 'Europe/Istanbul')).toBe('2026-08-10');
      // In UTC it is still the 9th
      expect(getLocalDateString(date, 'UTC')).toBe('2026-08-09');
    });

    test('Early morning UTC could be previous day in New York', () => {
      // 2026-08-09T02:00:00Z -> Local time in NY (UTC-4) is 22:00 PM on 2026-08-08
      const date = new Date(Date.UTC(2026, 7, 9, 2, 0, 0)).getTime();
      expect(getLocalDateString(date, 'America/New_York')).toBe('2026-08-08');
      expect(getLocalDateString(date, 'UTC')).toBe('2026-08-09');
    });
  });

  describe('calculateStreakUpdate', () => {
    const tz = 'Europe/Istanbul';

    test('Initializes streak to 1 on first session', () => {
      const now = Date.now();
      const nextState = calculateStreakUpdate(null, now, tz);
      expect(nextState.currentStreak).toBe(1);
      expect(nextState.longestStreak).toBe(1);
      expect(nextState.lastActivityAt).toBe(now);
    });

    test('Duplicate session on same day keeps streak same', () => {
      // First session: 10:00 AM UTC
      const d1 = new Date(Date.UTC(2026, 7, 9, 10, 0, 0)).getTime();
      const state1 = calculateStreakUpdate(null, d1, tz);

      // Second session: 15:00 PM UTC
      const d2 = new Date(Date.UTC(2026, 7, 9, 15, 0, 0)).getTime();
      const state2 = calculateStreakUpdate(state1, d2, tz);

      expect(state2.currentStreak).toBe(1); // Same
      expect(state2.longestStreak).toBe(1);
      expect(state2.lastActivityAt).toBe(d2);
    });

    test('23:59 -> 00:01 in local time correctly increments streak', () => {
      // 23:50 local in Istanbul (UTC+3) -> 20:50 UTC
      const d1 = new Date(Date.UTC(2026, 7, 9, 20, 50, 0)).getTime();
      const state1 = calculateStreakUpdate(null, d1, tz);

      // 00:10 local next day in Istanbul (UTC+3) -> 21:10 UTC (same day in UTC, but NEXT DAY locally)
      const d2 = new Date(Date.UTC(2026, 7, 9, 21, 10, 0)).getTime();
      const state2 = calculateStreakUpdate(state1, d2, tz);

      expect(state2.currentStreak).toBe(2);
      expect(state2.longestStreak).toBe(2);
    });

    test('Missed day resets streak', () => {
      // Day 1
      const d1 = new Date(Date.UTC(2026, 7, 9, 10, 0, 0)).getTime();
      const state1 = calculateStreakUpdate(null, d1, tz);

      // Day 2 (Streak 2)
      const d2 = new Date(Date.UTC(2026, 7, 10, 10, 0, 0)).getTime();
      const state2 = calculateStreakUpdate(state1, d2, tz);
      expect(state2.currentStreak).toBe(2);

      // Day 4 (Missed Day 3)
      const d3 = new Date(Date.UTC(2026, 7, 12, 10, 0, 0)).getTime();
      const state3 = calculateStreakUpdate(state2, d3, tz);

      expect(state3.currentStreak).toBe(1); // Reset
      expect(state3.longestStreak).toBe(2); // Keeps longest
    });
  });
});
