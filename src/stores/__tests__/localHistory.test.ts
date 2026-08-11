import { expect, test, describe } from "bun:test";
import {
  pruneSessions,
  LOCAL_HISTORY_RETENTION_MS,
  type LocalSession,
} from "../localHistoryStore";

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 5, 1);

function session(completedAt: number, id = `s-${completedAt}`): LocalSession {
  return {
    clientSessionId: id,
    exerciseId: "rsvp",
    exerciseType: "rsvp",
    startedAt: completedAt - 60_000,
    completedAt,
    durationMs: 60_000,
    difficulty: 1,
    score: 100,
    algorithmVersion: 1,
    synced: false,
  };
}

describe("pruneSessions", () => {
  test("keeps everything inside the retention window", () => {
    const sessions = [
      session(NOW - DAY),
      session(NOW - 30 * DAY),
      session(NOW - 179 * DAY),
    ];

    expect(pruneSessions(sessions, NOW)).toHaveLength(3);
  });

  test("drops sessions older than the retention window", () => {
    const kept = session(NOW - 179 * DAY, "kept");
    const dropped = session(NOW - 181 * DAY, "dropped");

    const result = pruneSessions([dropped, kept], NOW);

    expect(result.map((s) => s.clientSessionId)).toEqual(["kept"]);
  });

  test("keeps a session exactly on the retention boundary", () => {
    const boundary = session(NOW - LOCAL_HISTORY_RETENTION_MS, "boundary");

    expect(pruneSessions([boundary], NOW)).toHaveLength(1);
  });

  test("returns sessions oldest-first so charts read left to right", () => {
    const older = session(NOW - 10 * DAY, "older");
    const newer = session(NOW - DAY, "newer");

    const result = pruneSessions([newer, older], NOW);

    expect(result.map((s) => s.clientSessionId)).toEqual(["older", "newer"]);
  });

  test("an empty history stays empty", () => {
    expect(pruneSessions([], NOW)).toEqual([]);
  });
});
