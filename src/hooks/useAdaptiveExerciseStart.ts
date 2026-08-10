import { useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { getAdaptiveConfig } from "@/utils/difficultyMapper";
import { ExerciseDefinition, ProgressionState, DifficultyLevel } from "@/types/exercise";
import { useMemo } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useExerciseProgressStore } from '@/stores/exerciseProgressStore';

export function useAdaptiveExerciseStart(definition: ExerciseDefinition | undefined) {
  const { isSignedIn, isLoaded } = useAuth();
  
  // Use `skip` pattern if not signed in, but useQuery doesn't support conditional execution natively like Apollo
  // However, passing "skip" as a query parameter usually doesn't work unless Convex supports it.
  // Actually, Convex useQuery returns undefined while loading, and we modified it to return `null` if unauthenticated.
  const remoteProgress = useQuery(
    api.exerciseProgress.getProgress, 
    definition ? { exerciseId: definition.id } : "skip"
  );
  
  const getExerciseMetrics = useExerciseProgressStore(state => state.getExerciseMetrics);
  const localMetrics = useMemo(() => definition ? getExerciseMetrics(definition.id) : null, [definition, getExerciseMetrics]);

  const finalProgress = useMemo(() => {
    // If auth state is not loaded yet, or no definition, we wait.
    if (!isLoaded || !definition || !localMetrics) return undefined;

    // If signed in, we prefer the remote progress (unless it's still loading = undefined)
    if (isSignedIn) {
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
      // Guest user -> use local progress directly
      return {
        currentLevel: localMetrics.currentDifficulty,
        consecutiveSuccesses: localMetrics.consecutiveSuccesses,
        consecutiveFailures: localMetrics.consecutiveFailures,
        historicalBest: localMetrics.historicalBestLevel,
      } as ProgressionState;
    }
  }, [isLoaded, isSignedIn, remoteProgress, localMetrics, definition]);

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
