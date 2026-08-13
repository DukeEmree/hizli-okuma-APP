import { getAdaptiveConfig, CROSS_EXERCISE_METRICS_SOURCE } from "@/utils/difficultyMapper";
import { ExerciseDefinition, ProgressionState, DifficultyLevel } from "@/types/exercise";
import { useMemo } from 'react';
import { useExerciseProgressStore } from "@/stores/exerciseProgressStore";

export function useAdaptiveExerciseStart(definition: ExerciseDefinition | undefined) {
  const getExerciseMetrics = useExerciseProgressStore(state => state.getExerciseMetrics);
  const metricsId = definition ? (CROSS_EXERCISE_METRICS_SOURCE[definition.type] ?? definition.id) : null;
  const localMetrics = useMemo(() => metricsId ? getExerciseMetrics(metricsId) : null, [metricsId, getExerciseMetrics]);

  const finalProgress = useMemo(() => {
    if (!definition || !localMetrics) return undefined;
    return {
      currentLevel: localMetrics.currentDifficulty,
      consecutiveSuccesses: localMetrics.consecutiveSuccesses,
      consecutiveFailures: localMetrics.consecutiveFailures,
      historicalBest: localMetrics.historicalBestLevel,
    } as ProgressionState;
  }, [definition, localMetrics]);

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
