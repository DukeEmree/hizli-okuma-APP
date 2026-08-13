import { expect, test, describe } from "bun:test";
import { processGamification, type GamificationInput } from "../gamification";

// A mid-run session: the user is past the count thresholds and has already
// collected those achievements, so each test below isolates the one rule it
// is actually about.
const baseInput: GamificationInput = {
  xp: 0,
  level: 1,
  unlockedAchievementIds: ["first_exercise"],
  sessionScore: 100,
  sessionWpm: undefined,
  sessionComp: undefined,
  sessionCount: 5,
  currentStreak: 1,
  isDailyGoalCompleted: false,
};

describe("processGamification", () => {
  test("awards base XP for a plain session", () => {
    const result = processGamification(baseInput);
    expect(result.xp).toBe(10); // XP_SOURCES.EXERCISE_COMPLETED
    expect(result.newlyUnlockedAchievementIds).toEqual([]);
    expect(result.levelUp).toBe(false);
  });

  test("adds the daily goal bonus", () => {
    const result = processGamification({ ...baseInput, isDailyGoalCompleted: true });
    expect(result.xp).toBe(60); // 10 + 50 (DAILY_GOAL_COMPLETED)
  });

  test("unlocks first_exercise on the first session", () => {
    const result = processGamification({
      ...baseInput,
      sessionCount: 1,
      unlockedAchievementIds: [],
    });
    expect(result.newlyUnlockedAchievementIds).toEqual(["first_exercise"]);
    expect(result.unlockedAchievementIds).toEqual(["first_exercise"]);
    expect(result.xp).toBe(110); // 10 base + 100 achievement bonus
  });

  test("does not re-award an already-unlocked achievement", () => {
    const result = processGamification({ ...baseInput, sessionCount: 1 });
    expect(result.newlyUnlockedAchievementIds).toEqual([]);
    expect(result.xp).toBe(10);
  });

  test("still unlocks a count achievement when the exact count was skipped", () => {
    // Retention pruning can take the session count straight past 10, which an
    // `=== 10` check would miss permanently.
    const result = processGamification({ ...baseInput, sessionCount: 14 });
    expect(result.newlyUnlockedAchievementIds).toEqual(["exercise_10"]);
  });

  test("does not unlock exercise_10 before the tenth session", () => {
    const result = processGamification({ ...baseInput, sessionCount: 9 });
    expect(result.newlyUnlockedAchievementIds).toEqual([]);
  });

  test("unlocks streak_7 at currentStreak >= 7", () => {
    const result = processGamification({ ...baseInput, currentStreak: 7 });
    expect(result.newlyUnlockedAchievementIds).toContain("streak_7");
  });

  test("unlocks wpm_300 at sessionWpm >= 300", () => {
    const result = processGamification({ ...baseInput, sessionWpm: 300 });
    expect(result.newlyUnlockedAchievementIds).toContain("wpm_300");
  });

  test("unlocks comp_90 at sessionComp >= 0.9 (0-1 ratio, not percent)", () => {
    const result = processGamification({ ...baseInput, sessionComp: 0.9 });
    expect(result.newlyUnlockedAchievementIds).toContain("comp_90");
    const missed = processGamification({ ...baseInput, sessionComp: 90 });
    expect(missed.newlyUnlockedAchievementIds).not.toContain("comp_90");
  });

  test("unlocks xp_1000 and adds the extra achievement bonus once crossed", () => {
    const result = processGamification({ ...baseInput, xp: 995 });
    // 995 + 10 base = 1005 >= 1000 -> award xp_1000 (+100) -> 1105
    expect(result.newlyUnlockedAchievementIds).toContain("xp_1000");
    expect(result.xp).toBe(1105);
  });

  test("computes level and levelUp from the new xp total", () => {
    // Level 2 threshold is 100 xp (getXpThresholdForLevel(2) = 1*2*50 = 100)
    const result = processGamification({ ...baseInput, xp: 95 });
    expect(result.xp).toBe(105);
    expect(result.level).toBe(2);
    expect(result.levelUp).toBe(true);
  });
});
