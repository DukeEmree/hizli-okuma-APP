import { expect, test, describe } from "bun:test";
import { isDailyGoalCompletedBy, type DailyGoalSession } from "../dailyGoal";

const TZ = "Europe/Istanbul";
const PLAN = ["schulte", "rsvp", "pacer", "keyword"];

// 2026-08-13 midday and the day before, in the test timezone.
const TODAY = Date.UTC(2026, 7, 13, 9, 0, 0);
const YESTERDAY = Date.UTC(2026, 7, 12, 9, 0, 0);

function session(id: string, exerciseType: string, completedAt = TODAY): DailyGoalSession {
  return { clientSessionId: id, exerciseType, completedAt };
}

describe("isDailyGoalCompletedBy", () => {
  test("fires on the session that completes the last distinct plan step", () => {
    const sessions = [
      session("s1", "schulte"),
      session("s2", "rsvp"),
      session("s3", "pacer"),
      session("s4", "keyword"),
    ];
    expect(isDailyGoalCompletedBy(sessions, PLAN, "s4", TODAY, TZ)).toBe(true);
  });

  test("does not fire again on later sessions the same day", () => {
    const sessions = [
      session("s1", "schulte"),
      session("s2", "rsvp"),
      session("s3", "pacer"),
      session("s4", "keyword"),
      session("s5", "rsvp"),
    ];
    expect(isDailyGoalCompletedBy(sessions, PLAN, "s5", TODAY, TZ)).toBe(false);
  });

  test("does not fire when four sessions are done but a plan step is missing", () => {
    // Three plan steps plus a repeat - the old count-based rule awarded this.
    const sessions = [
      session("s1", "schulte"),
      session("s2", "rsvp"),
      session("s3", "rsvp"),
      session("s4", "pacer"),
    ];
    expect(isDailyGoalCompletedBy(sessions, PLAN, "s4", TODAY, TZ)).toBe(false);
  });

  test("ignores exercises that are not part of today's plan", () => {
    // Four sessions, none of them a full plan - the old rule awarded this too.
    const sessions = [
      session("s1", "memory"),
      session("s2", "visual-search"),
      session("s3", "number-scan"),
      session("s4", "peripheral"),
    ];
    expect(isDailyGoalCompletedBy(sessions, PLAN, "s4", TODAY, TZ)).toBe(false);
  });

  test("does not count plan steps completed on a previous day", () => {
    const sessions = [
      session("s1", "schulte", YESTERDAY),
      session("s2", "rsvp", YESTERDAY),
      session("s3", "pacer", YESTERDAY),
      session("s4", "keyword"),
    ];
    expect(isDailyGoalCompletedBy(sessions, PLAN, "s4", TODAY, TZ)).toBe(false);
  });

  test("returns false when there is no plan for today", () => {
    expect(isDailyGoalCompletedBy([session("s1", "rsvp")], [], "s1", TODAY, TZ)).toBe(false);
  });
});
