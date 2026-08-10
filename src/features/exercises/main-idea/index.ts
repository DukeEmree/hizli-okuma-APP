import { ExerciseDefinition } from "@/types/exercise";

export const MAIN_IDEA_ID = 'main-idea';

export const mainIdeaDefinition: ExerciseDefinition = {
  id: MAIN_IDEA_ID,
  type: 'main-idea',
  category: 'comprehension',
  nameKey: 'mainIdea.name',
  descriptionKey: 'mainIdea.description',
  defaultConfig: {
    initialDifficulty: 1,
    timeLimitMs: 120000,
    updateIntervalMs: 2000,
  }
};
