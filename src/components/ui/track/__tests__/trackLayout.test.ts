import { describe, expect, test } from "bun:test";
import { buildTrackFromDailyTrends, computeTrackLayout } from "../trackLayout";

describe("computeTrackLayout", () => {
  test("empty dataset — every slot is an empty/zero bar", () => {
    const bars = computeTrackLayout([
      { value: null },
      { value: null },
      { value: null },
    ]);
    expect(bars).toHaveLength(3);
    for (const bar of bars) {
      expect(bar.empty).toBe(true);
      expect(bar.heightRatio).toBe(0);
      expect(bar.fillRatio).toBe(0);
      expect(bar.streak).toBe(false);
    }
  });

  test("partial dataset — mixes real, empty, and streak slots", () => {
    const bars = computeTrackLayout([
      { value: 300, comprehension: 0.8, streak: true },
      { value: null },
      { value: 450, comprehension: 0.6, streak: true },
    ]);
    expect(bars[0].empty).toBe(false);
    expect(bars[0].heightRatio).toBeCloseTo(300 / 450, 5);
    expect(bars[0].fillRatio).toBe(0.8);
    expect(bars[0].streak).toBe(true);

    expect(bars[1].empty).toBe(true);
    expect(bars[1].heightRatio).toBe(0);

    expect(bars[2].heightRatio).toBe(1); // tallest bar
    expect(bars[2].fillRatio).toBe(0.6);
  });

  test("full dataset — heightRatio always relative to the max, fillRatio clamped to [0,1]", () => {
    const bars = computeTrackLayout([
      { value: 100, comprehension: 1.4 }, // clamp above 1
      { value: 200, comprehension: -0.3 }, // clamp below 0
      { value: 400, comprehension: 0.5 },
    ]);
    expect(bars[0].heightRatio).toBeCloseTo(0.25, 5);
    expect(bars[0].fillRatio).toBe(1);
    expect(bars[1].heightRatio).toBeCloseTo(0.5, 5);
    expect(bars[1].fillRatio).toBe(0);
    expect(bars[2].heightRatio).toBe(1);
    expect(bars[2].fillRatio).toBe(0.5);
  });
});

describe("buildTrackFromDailyTrends", () => {
  const timeZone = "UTC";
  const now = Date.UTC(2026, 0, 15, 12, 0, 0); // 2026-01-15 noon UTC

  test("dense-fills 5 days from a sparse trend list", () => {
    const points = buildTrackFromDailyTrends(
      [
        { date: "2026-01-13", avgWpm: 300, avgComprehension: 0.7 },
        { date: "2026-01-15", avgWpm: 400, avgComprehension: 0.9 },
      ],
      5,
      timeZone,
      now,
    );
    expect(points).toHaveLength(5);
    // 01-11, 01-12, 01-13, 01-14, 01-15
    expect(points[0]).toEqual({ value: null, comprehension: 0, streak: false });
    expect(points[1]).toEqual({ value: null, comprehension: 0, streak: false });
    expect(points[2]).toEqual({ value: 300, comprehension: 0.7, streak: true });
    expect(points[3]).toEqual({ value: null, comprehension: 0, streak: false });
    expect(points[4]).toEqual({ value: 400, comprehension: 0.9, streak: true });
  });

  test("empty trend list produces every-slot-empty output", () => {
    const points = buildTrackFromDailyTrends([], 3, timeZone, now);
    expect(points.every((p) => p.value === null && p.streak === false)).toBe(true);
  });
});
