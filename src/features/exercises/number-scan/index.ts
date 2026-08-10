import { ExerciseDefinition } from "@/types/exercise";

export const NUMBER_SCAN_ID = 'number-scan';

export const numberScanDefinition: ExerciseDefinition = {
  id: NUMBER_SCAN_ID,
  type: 'number-scan',
  category: 'vision',
  nameKey: 'numberScan.name',
  descriptionKey: 'numberScan.description',
  defaultConfig: {
    initialDifficulty: 1,
    timeLimitMs: 60000,
    updateIntervalMs: 2000,
  }
};
