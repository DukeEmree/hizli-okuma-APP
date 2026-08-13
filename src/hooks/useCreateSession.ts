import { useLocalHistoryStore } from "@/stores/localHistoryStore";
import { useExerciseProgressStore } from "@/stores/exerciseProgressStore";
import { useStreakCacheStore } from "@/stores/streakCacheStore";
import { useGamificationStore } from "@/stores/gamificationStore";
import { calculateNextProgression } from "@/utils/adaptiveDifficulty";
import { CROSS_EXERCISE_METRICS_SOURCE } from "@/utils/difficultyMapper";
import { sounds } from "@/lib/sounds";
import { calculateStreakUpdate } from "@/utils/streak";
import { processGamification } from "@/utils/gamification";
import { useDailyPlanStore } from "@/stores/dailyPlanStore";
import { isDailyGoalCompletedBy } from "@/utils/dailyGoal";
import { ACHIEVEMENTS } from "@/constants/gamification";
import { ProgressionState, ExerciseResult } from "@/types/exercise";
import { captureException } from "@/lib/sentry";

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
  const createSession = async (args: CreateSessionArgs, result?: ExerciseResult) => {
    // Idempotency guard: addLocalSession silently no-ops on a duplicate
    // clientSessionId, but streak/gamification below have no way to know
    // that happened, so a double-tap or retried call must not double-run them.
    // Keyed on exerciseId + completedAt rather than clientSessionId: every
    // call site builds clientSessionId as `${exerciseId}-${Date.now()}`, so a
    // retried completion gets a *different* id each time and would slip past
    // a clientSessionId-based check.
    const alreadyRecorded = useLocalHistoryStore
      .getState()
      .sessions.some(
        (s) => s.exerciseId === args.exerciseId && s.completedAt === args.completedAt,
      );
    if (alreadyRecorded) {
      return { sessionId: "local", gamification: null };
    }

    // Exercises listed in CROSS_EXERCISE_METRICS_SOURCE (e.g. Pacer) can't
    // measure their own accuracy - it's always 1 - so writing a "progression"
    // for them would just ratchet straight to max difficulty. They read
    // another exercise's progression instead (see useAdaptiveExerciseStart),
    // so there's nothing meaningful to record here.
    const hasOwnProgression = !(result?.exerciseType && CROSS_EXERCISE_METRICS_SOURCE[result.exerciseType]);

    if (result && hasOwnProgression) {
      const currentMetrics = getExerciseMetrics(result.exerciseId);
      const currentProgression: ProgressionState = {
        currentLevel: currentMetrics.currentDifficulty,
        consecutiveSuccesses: currentMetrics.consecutiveSuccesses || 0,
        consecutiveFailures: currentMetrics.consecutiveFailures || 0,
        historicalBest: currentMetrics.historicalBestLevel || 1,
      };

      const newProgression = calculateNextProgression(result, currentProgression);

      if (newProgression.currentLevel !== currentProgression.currentLevel) {
        sounds.difficultyChanged();
      }

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

    // Gamification - finishing today's daily plan drives the goal XP bonus;
    // total session count (capped by the 6-month local retention window,
    // same as the rest of the dashboard) drives the count-based achievements.
    const { sessions } = useLocalHistoryStore.getState();
    const isDailyGoalCompleted = isDailyGoalCompletedBy(
      sessions,
      useDailyPlanStore.getState().exerciseTypes,
      args.clientSessionId,
      args.completedAt,
      timeZone,
    );

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

  // Every exercise engine calls this and then does `.catch(console.error)`,
  // which in a release build means a failed write - the user's completed
  // session, streak and XP - vanishes with no signal anywhere. Reporting
  // here rather than at each of the fifteen call sites means no engine can
  // be added later that forgets to. The error is still re-thrown so the
  // existing call-site handling is unchanged.
  return async (args: CreateSessionArgs, result?: ExerciseResult) => {
    try {
      return await createSession(args, result);
    } catch (error) {
      captureException(error, {
        context: "useCreateSession",
        exerciseId: args.exerciseId,
        exerciseType: args.exerciseType,
      });
      throw error;
    }
  };
}
