import { ExerciseDefinition } from "@/types/exercise";


export const SCHULTE_ID = 'schulte-attention';

export const schulteDefinition: ExerciseDefinition = {
  id: SCHULTE_ID,
  type: 'schulte',
  category: 'focus',
  nameKey: 'schulte.name',
  descriptionKey: 'schulte.description',
  defaultConfig: {
    initialDifficulty: 1,
    gridSize: 5,
    timeLimitMs: 60000,
    updateIntervalMs: 100, // Performans için daha düşük FPS yeterli.
  }
};

