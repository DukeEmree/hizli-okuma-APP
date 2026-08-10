import { ExerciseDefinition } from "@/types/exercise";

export const SELECTIVE_ATTENTION_ID = 'selective-attention';

export const selectiveAttentionDefinition: ExerciseDefinition = {
  id: SELECTIVE_ATTENTION_ID,
  type: 'selective-attention',
  category: 'focus',
  nameKey: 'selectiveAttention.name',
  descriptionKey: 'selectiveAttention.description',
  defaultConfig: {
    initialDifficulty: 1,
    timeLimitMs: 60000,
    updateIntervalMs: 2000,
  }
};
