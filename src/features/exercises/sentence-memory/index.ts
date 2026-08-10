import { ExerciseDefinition } from "@/types/exercise";

export const SENTENCE_MEMORY_ID = 'sentence-memory';

export const sentenceMemoryDefinition: ExerciseDefinition = {
  id: SENTENCE_MEMORY_ID,
  type: 'sentence-memory',
  category: 'memory',
  nameKey: 'sentenceMemory.name',
  descriptionKey: 'sentenceMemory.description',
  defaultConfig: {
    initialDifficulty: 1,
    timeLimitMs: 90000,
    updateIntervalMs: 2000,
  }
};
