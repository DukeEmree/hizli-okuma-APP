/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test';
import { getPeriodString } from "@/utils/leaderboard";

describe('Leaderboard Utility', () => {
  describe('getPeriodString', () => {
    test('returns ALL_TIME for allTime', () => {
      expect(getPeriodString(Date.now(), 'allTime')).toBe('ALL_TIME');
    });

    test('returns correct monthly string', () => {
      // 2026-08-09
      const d = new Date(Date.UTC(2026, 7, 9)).getTime();
      expect(getPeriodString(d, 'monthly')).toBe('MONTH_2026_08');
    });

    test('returns correct weekly string based on ISO week', () => {
      // 2026-08-09 is Sunday, ISO Week 32
      const d1 = new Date(Date.UTC(2026, 7, 9)).getTime();
      expect(getPeriodString(d1, 'weekly')).toBe('WEEK_2026_32');
      
      // 2026-01-01 is Thursday, ISO Week 01
      const d2 = new Date(Date.UTC(2026, 0, 1)).getTime();
      expect(getPeriodString(d2, 'weekly')).toBe('WEEK_2026_01');
    });
  });
});
