import { ExerciseDefinition } from "@/types/exercise";

export const PERIPHERAL_ID = 'peripheral-vision';

export const peripheralDefinition: ExerciseDefinition = {
  id: PERIPHERAL_ID,
  type: 'peripheral',
  category: 'vision',
  nameKey: 'peripheral.name',
  descriptionKey: 'peripheral.description',
  defaultConfig: {
    initialDifficulty: 1,
    timeLimitMs: 60000,
    updateIntervalMs: 2000, // Show a new item every 2 seconds initially
  }
};
