import { useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { getAdaptiveConfig } from "@/utils/difficultyMapper";
import { ExerciseDefinition, ProgressionState, DifficultyLevel } from "@/types/exercise";
import { useMemo } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useExerciseProgressStore } from '@/stores/exerciseProgressStore';

export function useAdaptiveExerciseStart(definition: ExerciseDefinition | undefined) {
  const { isSignedIn, isLoaded } = useAuth();
  const { isPremium } = useRevenueCat();
  // Cloud progress is premium-only - free/guest users use local progress.
  const useRemote = isSignedIn && isPremium;

  const remoteProgress = useQuery(
    api.exerciseProgress.getProgress,
    definition && useRemote ? { exerciseId: definition.id } : "skip"
  );
  
  const getExerciseMetrics = useExerciseProgressStore(state => state.getExerciseMetrics);
  const localMetrics = useMemo(() => definition ? getExerciseMetrics(definition.id) : null, [definition, getExerciseMetrics]);

  const finalProgress = useMemo(() => {
    // If auth state is not loaded yet, or no definition, we wait.
    if (!isLoaded || !definition || !localMetrics) return undefined;

    // Premium + signed in: prefer remote progress (unless still loading)
    if (useRemote) {
      if (remoteProgress === undefined) return undefined; // still loading from Convex

      // If Convex returns null (somehow unauthenticated in backend but authenticated in frontend?), fallback to local
      if (remoteProgress === null) {
        return {
          currentLevel: localMetrics.currentDifficulty,
          consecutiveSuccesses: localMetrics.consecutiveSuccesses,
          consecutiveFailures: localMetrics.consecutiveFailures,
          historicalBest: localMetrics.historicalBestLevel,
        } as ProgressionState;
      }
      return remoteProgress as ProgressionState;
    } else {
      // Guest or free-tier user -> use local progress directly
      return {
        currentLevel: localMetrics.currentDifficulty,
        consecutiveSuccesses: localMetrics.consecutiveSuccesses,
        consecutiveFailures: localMetrics.consecutiveFailures,
        historicalBest: localMetrics.historicalBestLevel,
      } as ProgressionState;
    }
  }, [isLoaded, useRemote, remoteProgress, localMetrics, definition]);

  const config = useMemo(() => {
    if (finalProgress === undefined || !definition) return null;
    const adaptiveParams = getAdaptiveConfig(definition.type, finalProgress.currentLevel as DifficultyLevel);
    return {
      ...definition.defaultConfig,
      ...adaptiveParams,
      initialDifficulty: finalProgress.currentLevel,
    };
  }, [finalProgress, definition]);

  return {
    isReady: config !== null && definition !== undefined,
    config,
    progressionState: finalProgress,
  };
}
