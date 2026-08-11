import { useSyncStore } from "@/stores/syncStore";
import { useLocalHistoryStore } from "@/stores/localHistoryStore";
import { useExerciseProgressStore } from "@/stores/exerciseProgressStore";
import { calculateNextProgression } from "@/utils/adaptiveDifficulty";
import { ProgressionState, ExerciseResult } from "@/types/exercise";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRevenueCat } from "@/providers/RevenueCatProvider";

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
  const addSession = useSyncStore((state) => state.addSession);
  const addLocalSession = useLocalHistoryStore((state) => state.addSession);
  const getExerciseMetrics = useExerciseProgressStore((state) => state.getExerciseMetrics);
  const updateExerciseMetrics = useExerciseProgressStore((state) => state.updateExerciseMetrics);

  const { isSignedIn } = useAuth();
  const { isPremium } = useRevenueCat();
  const updateProgress = useMutation(api.exerciseProgress.updateProgress);

  // `result` is the raw ExerciseResult the engine produced; `args` is its
  // flattened Convex-session shape. Adaptive progression needs the former
  // (result.score.accuracy etc.), so it must be passed explicitly rather
  // than inferred from `args` - args.score is a plain number.
  return async (args: CreateSessionArgs, result?: ExerciseResult) => {
    if (result) {
      // Calculate Adaptive Difficulty progression
      const currentMetrics = getExerciseMetrics(result.exerciseId);
      const currentProgression: ProgressionState = {
        currentLevel: currentMetrics.currentDifficulty,
        consecutiveSuccesses: currentMetrics.consecutiveSuccesses || 0,
        consecutiveFailures: currentMetrics.consecutiveFailures || 0,
        historicalBest: currentMetrics.historicalBestLevel || 1,
      };

      const newProgression = calculateNextProgression(result, currentProgression);

      // Save locally
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

      // Cloud sync is premium-only - free/guest users keep progress local.
      if (isSignedIn && isPremium) {
        // Fire and forget - if network fails, local storage still has the state.
        updateProgress({
          exerciseId: result.exerciseId,
          currentLevel: newProgression.currentLevel,
          consecutiveSuccesses: newProgression.consecutiveSuccesses,
          consecutiveFailures: newProgression.consecutiveFailures,
          historicalBest: newProgression.historicalBest,
          score: result.score.finalScore,
          wpm: result.metrics?.wpm,
        }).catch((err) => {
          console.warn("Failed to sync adaptive progress to backend", err);
        });
      }
    }

    // Every session is recorded in the on-device 6-month history, whoever
    // the user is - that is what the dashboard, the daily limit and the
    // per-exercise charts read.
    addLocalSession(args);

    // The upload queue is only for users whose sessions Convex will actually
    // accept. Queueing for anyone else would leave entries that can never be
    // drained (see localHistoryStore for the full rationale).
    if (isSignedIn && isPremium) {
      addSession(args);
    }

    // Return a dummy session ID since it will be synced later
    return { sessionId: 'offline-pending', gamification: null };
  };
}
