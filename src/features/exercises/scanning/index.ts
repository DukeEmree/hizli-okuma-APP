import { ExerciseDefinition } from "@/types/exercise";


export const SCANNING_ID = 'scanning-attention';

export const scanningDefinition: ExerciseDefinition = {
  id: SCANNING_ID,
  type: 'scanning',
  category: 'focus',
  nameKey: 'scanning.name',
  descriptionKey: 'scanning.description',
  defaultConfig: {
    initialDifficulty: 1,
    gridSize: 5, // 5x5
    timeLimitMs: 60000,
    updateIntervalMs: 100,
  }
};

