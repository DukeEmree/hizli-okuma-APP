import { expect, test, describe } from "bun:test";
import { buildLocalStats } from "../localStatistics";
import type { LocalSession } from "@/stores/localHistoryStore";

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 5, 10, 12, 0, 0);
const TZ = "UTC";

function session(
  completedAt: number,
  overrides: Partial<LocalSession> = {},
): LocalSession {
  return {
    clientSessionId: `s-${completedAt}-${overrides.exerciseType ?? "rsvp"}`,
    exerciseId: "rsvp",
    exerciseType: "rsvp",
    startedAt: completedAt - 60_000,
    completedAt,
    durationMs: 60_000,
    difficulty: 1,
    score: 100,
    algorithmVersion: 1,
    synced: false,
    ...overrides,
  };
}

describe("buildLocalStats", () => {
  test("empty history produces an empty, non-throwing result", () => {
    const stats = buildLocalStats([], "7d", NOW, TZ);

    expect(stats.totalSessions).toBe(0);
    expect(stats.totalTrainingTimeMs).toBe(0);
    expect(stats.dailyTrends).toEqual([]);
    expect(stats.exerciseStats).toEqual([]);
  });

  test("filters by the selected time range", () => {
    const sessions = [
      session(NOW - 2 * DAY),
      session(NOW - 20 * DAY),
      session(NOW - 100 * DAY),
    ];

    expect(buildLocalStats(sessions, "7d", NOW, TZ).totalSessions).toBe(1);
    expect(buildLocalStats(sessions, "30d", NOW, TZ).totalSessions).toBe(2);
    expect(buildLocalStats(sessions, "all", NOW, TZ).totalSessions).toBe(3);
  });

  test("groups sessions by local day, oldest first", () => {
    const sessions = [
      session(NOW - DAY, { score: 100 }),
      session(NOW - DAY + 3600_000, { score: 200, clientSessionId: "b" }),
      session(NOW, { score: 50, clientSessionId: "c" }),
    ];

    const trends = buildLocalStats(sessions, "7d", NOW, TZ).dailyTrends;

    expect(trends).toHaveLength(2);
    expect(trends[0].date < trends[1].date).toBe(true);
    expect(trends[0].sessionCount).toBe(2);
    expect(trends[0].avgScore).toBe(150);
  });

  test("averages each metric over the sessions that reported it", () => {
    const sessions = [
      session(NOW, { metrics: { wpm: 200 }, clientSessionId: "a" }),
      session(NOW, { metrics: { wpm: 400 }, clientSessionId: "b" }),
      // No wpm at all - must not drag the average down as a zero.
      session(NOW, { clientSessionId: "c" }),
    ];

    const day = buildLocalStats(sessions, "7d", NOW, TZ).dailyTrends[0];

    expect(day.avgWpm).toBe(300);
  });

  test("comprehension and accuracy stay as 0-1 ratios", () => {
    const sessions = [
      session(NOW, {
        metrics: { comprehensionAccuracy: 0.8, correctCount: 3, errorCount: 1 },
      }),
    ];

    const day = buildLocalStats(sessions, "7d", NOW, TZ).dailyTrends[0];

    expect(day.avgComprehension).toBe(0.8);
    expect(day.avgAccuracy).toBe(0.75);
  });

  test("accuracy is skipped when a session answered nothing", () => {
    const sessions = [session(NOW, { metrics: { correctCount: 0, errorCount: 0 } })];

    expect(buildLocalStats(sessions, "7d", NOW, TZ).dailyTrends[0].avgAccuracy).toBeNull();
  });

  test("per-exercise stats track best and average separately", () => {
    const sessions = [
      session(NOW, { exerciseType: "rsvp", score: 100, metrics: { wpm: 300 } }),
      session(NOW, {
        exerciseType: "rsvp",
        score: 300,
        metrics: { wpm: 500 },
        clientSessionId: "b",
      }),
      session(NOW, { exerciseType: "schulte", score: 42, clientSessionId: "c" }),
    ];

    const stats = buildLocalStats(sessions, "7d", NOW, TZ).exerciseStats;
    const rsvp = stats.find((e) => e.type === "rsvp")!;
    const schulte = stats.find((e) => e.type === "schulte")!;

    expect(rsvp.bestScore).toBe(300);
    expect(rsvp.averageScore).toBe(200);
    expect(rsvp.bestWpm).toBe(500);
    expect(rsvp.averageWpm).toBe(400);
    expect(rsvp.attemptCount).toBe(2);
    // An exercise that never reports WPM reports null, not 0.
    expect(schulte.averageWpm).toBeNull();
  });

  test("buckets by the user's local day, not UTC", () => {
    // 22:30 UTC = 01:30 the next day in Istanbul
    const lateNight = Date.UTC(2026, 5, 9, 22, 30, 0);

    const utc = buildLocalStats([session(lateNight)], "all", NOW, "UTC");
    const istanbul = buildLocalStats(
      [session(lateNight)],
      "all",
      NOW,
      "Europe/Istanbul",
    );

    expect(utc.dailyTrends[0].date).toBe("2026-06-09");
    expect(istanbul.dailyTrends[0].date).toBe("2026-06-10");
  });
});
