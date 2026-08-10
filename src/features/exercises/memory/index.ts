import { ExerciseDefinition } from "@/types/exercise";

export const MEMORY_ID = 'word-memory';

export const memoryDefinition: ExerciseDefinition = {
  id: MEMORY_ID,
  type: 'memory',
  category: 'memory',
  nameKey: 'memory.name',
  descriptionKey: 'memory.description',
  defaultConfig: {
    initialDifficulty: 1,
    timeLimitMs: 60000,
    updateIntervalMs: 2000,
  }
};
