import { ExerciseDefinition } from "@/types/exercise";

export const KEYWORD_ID = 'keyword';

export const keywordDefinition: ExerciseDefinition = {
  id: KEYWORD_ID,
  type: 'keyword',
  category: 'focus',
  nameKey: 'keyword.name',
  descriptionKey: 'keyword.description',
  defaultConfig: {
    initialDifficulty: 1,
    timeLimitMs: 90000,
    updateIntervalMs: 2000,
  }
};
