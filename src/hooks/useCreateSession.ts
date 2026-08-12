import { useLocalHistoryStore } from "@/stores/localHistoryStore";
import { useExerciseProgressStore } from "@/stores/exerciseProgressStore";
import { useStreakCacheStore } from "@/stores/streakCacheStore";
import { useGamificationStore } from "@/stores/gamificationStore";
import { calculateNextProgression } from "@/utils/adaptiveDifficulty";
import { calculateStreakUpdate, getLocalDateString } from "@/utils/streak";
import { processGamification } from "@/utils/gamification";
import { DAILY_PLAN_SIZE } from "@/utils/dailyPlan";
import { ACHIEVEMENTS } from "@/constants/gamification";
import { ProgressionState, ExerciseResult } from "@/types/exercise";

export interface CreateSessionArgs {
  clientSessionId: string;
  exerciseId: string;
  exerciseType: string;
  startedAt: number;
  completedAt: number;
  durationMs: number;
  difficulty: number;
  score: number;
  metrics?: Record<string, unknown>;
  algorithmVersion: number;
}

export function useCreateSession() {
  const addLocalSession = useLocalHistoryStore((state) => state.addSession);
  const getExerciseMetrics = useExerciseProgressStore((state) => state.getExerciseMetrics);
  const updateExerciseMetrics = useExerciseProgressStore((state) => state.updateExerciseMetrics);

  // `result` is the raw ExerciseResult the engine produced; `args` is its
  // flattened session shape. Adaptive progression needs the former
  // (result.score.accuracy etc.), so it must be passed explicitly rather
  // than inferred from `args` - args.score is a plain number.
  return async (args: CreateSessionArgs, result?: ExerciseResult) => {
    // Idempotency guard: addLocalSession silently no-ops on a duplicate
    // clientSessionId, but streak/gamification below have no way to know
    // that happened, so a double-tap or retried call must not double-run them.
    const alreadyRecorded = useLocalHistoryStore
      .getState()
      .sessions.some((s) => s.clientSessionId === args.clientSessionId);
    if (alreadyRecorded) {
      return { sessionId: "local", gamification: null };
    }

    if (result) {
      const currentMetrics = getExerciseMetrics(result.exerciseId);
      const currentProgression: ProgressionState = {
        currentLevel: currentMetrics.currentDifficulty,
        consecutiveSuccesses: currentMetrics.consecutiveSuccesses || 0,
        consecutiveFailures: currentMetrics.consecutiveFailures || 0,
        historicalBest: currentMetrics.historicalBestLevel || 1,
      };

      const newProgression = calculateNextProgression(result, currentProgression);

      updateExerciseMetrics(result.exerciseId, {
        currentDifficulty: newProgression.currentLevel,
        consecutiveSuccesses: newProgression.consecutiveSuccesses,
        consecutiveFailures: newProgression.consecutiveFailures,
        historicalBestLevel: newProgression.historicalBest,
        bestScore: result.score.finalScore,
        bestWpm: result.metrics?.wpm,
        bestAccuracy: result.score.accuracy,
        bestComprehension: result.metrics?.comprehensionAccuracy,
      });
    }

    // Every session is recorded in the on-device 6-month history - that is
    // what the dashboard, the daily limit and the per-exercise charts read.
    addLocalSession(args);

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    // Streak
    const streakState = useStreakCacheStore.getState();
    const newStreak = calculateStreakUpdate(
      {
        currentStreak: streakState.currentStreak,
        longestStreak: streakState.longestStreak,
        lastActivityAt: streakState.lastActivityAt,
        freezesAvailable: streakState.freezesAvailable,
      },
      args.completedAt,
      timeZone,
    );
    streakState.updateCache(newStreak);

    // Gamification - today's session count drives the daily-goal XP bonus;
    // total session count (capped by the 6-month local retention window,
    // same as the rest of the dashboard) drives the count-based achievements.
    const { sessions } = useLocalHistoryStore.getState();
    const todayStr = getLocalDateString(args.completedAt, timeZone);
    const todaysSessionCount = sessions.filter(
      (s) => getLocalDateString(s.completedAt, timeZone) === todayStr,
    ).length;
    const isDailyGoalCompleted = todaysSessionCount === DAILY_PLAN_SIZE;

    const gamificationState = useGamificationStore.getState();
    const gamificationResult = processGamification({
      xp: gamificationState.xp,
      level: gamificationState.level,
      unlockedAchievementIds: gamificationState.unlockedAchievementIds,
      sessionScore: args.score,
      sessionWpm: result?.metrics?.wpm,
      sessionComp: result?.metrics?.comprehensionAccuracy,
      sessionCount: sessions.length,
      currentStreak: newStreak.currentStreak,
      isDailyGoalCompleted,
    });
    gamificationState.applyResult(gamificationResult);
    gamificationResult.newlyUnlockedAchievementIds.forEach((id) => {
      const definition = ACHIEVEMENTS[id];
      if (definition) {
        gamificationState.addAchievement({
          id: definition.id,
          title: definition.title,
          icon: definition.icon,
        });
      }
    });

    return {
      sessionId: "local",
      gamification:
        gamificationResult.newlyUnlockedAchievementIds.length > 0
          ? { unlockedAchievements: gamificationResult.newlyUnlockedAchievementIds }
          : null,
    };
  };
}
