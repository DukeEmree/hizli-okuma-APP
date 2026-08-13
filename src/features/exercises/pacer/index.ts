import { ExerciseDefinition } from "@/types/exercise";


export const PACER_ID = 'pacer-reading';

export const pacerDefinition: ExerciseDefinition = {
  id: PACER_ID,
  type: 'pacer',
  category: 'reading',
  nameKey: 'pacer.name',
  descriptionKey: 'pacer.description',
  defaultConfig: {
    initialDifficulty: 1,
    wpm: 250,
    fontSize: 24,
    text: '',
    updateIntervalMs: 16,
    highlightMode: 'word', // 'word' veya 'line'
    direction: 'forward', // ileri vs.
  },
};

