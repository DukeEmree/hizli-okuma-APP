import {
  XP_SOURCES,
  getLevelFromXp
} from "../src/constants/gamification";
import { Id } from "./_generated/dataModel";
import { DatabaseWriter } from "./_generated/server";

export async function processGamification(
  db: DatabaseWriter,
  userId: Id<"users">,
  sessionScore: number,
  sessionWpm: number | undefined,
  sessionComp: number | undefined,
  sessionCount: number, // total completed exercises by this user
  currentStreak: number,
  isDailyGoalCompleted: boolean,
) {
  const unlockedAchievements: string[] = [];
  let totalXpGained = 0;

  // 1. Base XP for exercise
  totalXpGained += XP_SOURCES.EXERCISE_COMPLETED;

  if (isDailyGoalCompleted) {
    totalXpGained += XP_SOURCES.DAILY_GOAL_COMPLETED;
  }

  // 2. Fetch existing achievements
  const existingAchievements = await db
    .query("userAchievements")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .collect();

  const hasAchievement = (id: string) =>
    existingAchievements.some((a) => a.achievementId === id);

  const awardAchievement = async (id: string) => {
    if (!hasAchievement(id)) {
      await db.insert("userAchievements", {
        userId,
        achievementId: id,
        unlockedAt: Date.now(),
      });
      unlockedAchievements.push(id);
      totalXpGained += XP_SOURCES.ACHIEVEMENT_UNLOCKED;
    }
  };

  // Check First Exercise
  if (sessionCount === 1) {
    await awardAchievement("first_exercise");
  }

  // Check 10 Exercises
  if (sessionCount === 10) {
    await awardAchievement("exercise_10");
  }

  // Check Streak
  if (currentStreak >= 7) {
    await awardAchievement("streak_7");
  }

  // Check WPM
  if (sessionWpm && sessionWpm >= 300) {
    await awardAchievement("wpm_300");
  }

  // Check Comprehension. sessionComp is `metrics.comprehensionAccuracy`,
  // which is a 0-1 ratio (see src/types/exercise.ts), not a percentage -
  // comparing it against 90 made this achievement unreachable.
  if (sessionComp !== undefined && sessionComp >= 0.9) {
    await awardAchievement("comp_90");
  }

  // 3. Update User XP and Level
  const user = await db.get(userId);
  if (!user)
    return { unlockedAchievements, xpGained: 0, newLevel: 1, levelUp: false };

  let currentXp = user.xp || 0;
  let currentLevel = user.level || 1;

  // Check XP achievement (before adding, or after? After adding this session's XP)
  currentXp += totalXpGained;

  if (currentXp >= 1000 && !hasAchievement("xp_1000")) {
    await awardAchievement("xp_1000");
    // totalXpGained and currentXp need to reflect this new award
    currentXp += XP_SOURCES.ACHIEVEMENT_UNLOCKED;
    totalXpGained += XP_SOURCES.ACHIEVEMENT_UNLOCKED;
  }

  const newLevel = getLevelFromXp(currentXp);
  const levelUp = newLevel > currentLevel;

  await db.patch(userId, {
    xp: currentXp,
    level: newLevel,
  });

  return {
    unlockedAchievements,
    xpGained: totalXpGained,
    newLevel,
    levelUp,
  };
}
