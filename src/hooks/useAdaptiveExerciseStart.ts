import { useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { getAdaptiveConfig } from "@/utils/difficultyMapper";
import { ExerciseDefinition, ProgressionState, DifficultyLevel } from "@/types/exercise";
import { useMemo } from 'react';

export function useAdaptiveExerciseStart(definition: ExerciseDefinition) {
  const progress = useQuery(api.exerciseProgress.getProgress, { exerciseId: definition.id });

  const config = useMemo(() => {
    if (!progress) return null;
    const adaptiveParams = getAdaptiveConfig(definition.type, progress.currentLevel as DifficultyLevel);
    return {
      ...definition.defaultConfig,
      ...adaptiveParams,
      initialDifficulty: progress.currentLevel,
    };
  }, [progress, definition]);

  return {
    isReady: config !== null,
    config,
    progressionState: progress as ProgressionState | undefined,
  };
}
