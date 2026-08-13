import { ACHIEVEMENTS, XP_SOURCES, getLevelFromXp } from "@/constants/gamification";

export interface GamificationInput {
  xp: number;
  level: number;
  unlockedAchievementIds: string[];
  sessionScore: number;
  sessionWpm?: number;
  /** 0-1 ratio, e.g. `metrics.comprehensionAccuracy` — not a percentage. */
  sessionComp?: number;
  /** Total completed sessions including this one. */
  sessionCount: number;
  currentStreak: number;
  isDailyGoalCompleted: boolean;
}

export interface GamificationResult {
  xp: number;
  level: number;
  unlockedAchievementIds: string[];
  newlyUnlockedAchievementIds: string[];
  levelUp: boolean;
}

/**
 * Pure local gamification engine — there is no backend, so this is the only
 * place XP, levels and achievements are computed. Kept deliberately simple
 * and side-effect-free so it's trivial to test and to call from
 * `useCreateSession` on every completed session.
 */
export function processGamification(input: GamificationInput): GamificationResult {
  const unlocked = new Set(input.unlockedAchievementIds);
  const newlyUnlocked: string[] = [];
  let xpGained = XP_SOURCES.EXERCISE_COMPLETED;

  if (input.isDailyGoalCompleted) {
    xpGained += XP_SOURCES.DAILY_GOAL_COMPLETED;
  }

  const award = (id: string) => {
    if (!unlocked.has(id) && ACHIEVEMENTS[id]) {
      unlocked.add(id);
      newlyUnlocked.push(id);
      xpGained += XP_SOURCES.ACHIEVEMENT_UNLOCKED;
    }
  };

  // Thresholds are `>=`, not `===`: `award()` already refuses to hand out an
  // achievement twice, and exact equality means a user who crosses the
  // boundary while the 6-month retention window is pruning older sessions
  // skips the number entirely and can never unlock it.
  if (input.sessionCount >= 1) award("first_exercise");
  if (input.sessionCount >= 10) award("exercise_10");
  if (input.currentStreak >= 7) award("streak_7");
  if (input.sessionWpm && input.sessionWpm >= 300) award("wpm_300");
  if (input.sessionComp !== undefined && input.sessionComp <= 1 && input.sessionComp >= 0.9) award("comp_90");

  let xp = input.xp + xpGained;

  if (xp >= 1000 && !unlocked.has("xp_1000")) {
    award("xp_1000");
    xp += XP_SOURCES.ACHIEVEMENT_UNLOCKED;
  }

  const level = getLevelFromXp(xp);
  const levelUp = level > input.level;

  return {
    xp,
    level,
    unlockedAchievementIds: Array.from(unlocked),
    newlyUnlockedAchievementIds: newlyUnlocked,
    levelUp,
  };
}
