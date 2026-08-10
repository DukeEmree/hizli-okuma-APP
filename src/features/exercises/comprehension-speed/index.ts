import { ExerciseDefinition } from "@/types/exercise";

export const COMPREHENSION_SPEED_ID = 'comprehension-speed';

export const comprehensionSpeedDefinition: ExerciseDefinition = {
  id: COMPREHENSION_SPEED_ID,
  type: 'comprehension-speed',
  category: 'comprehension',
  nameKey: 'comprehensionSpeed.name',
  descriptionKey: 'comprehensionSpeed.description',
  defaultConfig: {
    initialDifficulty: 1,
    timeLimitMs: 300000, // 5 minutes max
    updateIntervalMs: 2000,
  }
};
