import { ExerciseDefinition } from "@/types/exercise";

export const WORD_RECOGNITION_ID = 'word-recognition';

export const wordRecognitionDefinition: ExerciseDefinition = {
  id: WORD_RECOGNITION_ID,
  type: 'word-recognition',
  category: 'focus',
  nameKey: 'wordRecognition.name',
  descriptionKey: 'wordRecognition.description',
  defaultConfig: {
    initialDifficulty: 1,
    timeLimitMs: 60000,
    updateIntervalMs: 2000,
  }
};
