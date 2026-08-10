import { ExerciseDefinition } from "@/types/exercise";

export const VISUAL_SEARCH_ID = 'visual-search';

export const visualSearchDefinition: ExerciseDefinition = {
  id: VISUAL_SEARCH_ID,
  type: 'visual-search',
  category: 'vision',
  nameKey: 'visualSearch.name',
  descriptionKey: 'visualSearch.description',
  defaultConfig: {
    initialDifficulty: 1,
    timeLimitMs: 60000,
    updateIntervalMs: 2000,
  }
};
