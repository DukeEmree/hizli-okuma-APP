import { ExerciseDefinition } from "@/types/exercise";


export const CHUNKING_ID = 'chunking-reading';

export const chunkingDefinition: ExerciseDefinition = {
  id: CHUNKING_ID,
  type: 'chunking',
  category: 'reading',
  nameKey: 'chunking.name',
  descriptionKey: 'chunking.description',
  defaultConfig: {
    initialDifficulty: 1,
    wpm: 250,
    chunkSize: 2, // 1, 2, 3, 4 vb.
    fontSize: 28,
    text: '',
    updateIntervalMs: 16,
  },
  isPremium: true,
};

