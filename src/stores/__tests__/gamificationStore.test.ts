import { expect, test, describe, beforeEach } from "bun:test";
import { useGamificationStore } from "../gamificationStore";

describe("useGamificationStore", () => {
  beforeEach(() => {
    useGamificationStore.setState({
      xp: 0,
      level: 1,
      unlockedAchievementIds: [],
      pendingAchievements: [],
    });
  });

  test("applyResult merges xp/level/unlockedAchievementIds", () => {
    useGamificationStore.getState().applyResult({
      xp: 110,
      level: 1,
      unlockedAchievementIds: ["first_exercise"],
      newlyUnlockedAchievementIds: ["first_exercise"],
      levelUp: false,
    });
    const state = useGamificationStore.getState();
    expect(state.xp).toBe(110);
    expect(state.unlockedAchievementIds).toEqual(["first_exercise"]);
  });

  test("resetProgress clears xp/level/achievements but not the popup queue helpers", () => {
    useGamificationStore.getState().applyResult({
      xp: 500,
      level: 3,
      unlockedAchievementIds: ["first_exercise", "streak_7"],
      newlyUnlockedAchievementIds: [],
      levelUp: false,
    });
    useGamificationStore.getState().resetProgress();
    const state = useGamificationStore.getState();
    expect(state.xp).toBe(0);
    expect(state.level).toBe(1);
    expect(state.unlockedAchievementIds).toEqual([]);
  });
});
