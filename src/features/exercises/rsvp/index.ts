import { ExerciseDefinition } from "@/types/exercise";


export const RSVP_ID = 'rsvp-reading';

export const rsvpDefinition: ExerciseDefinition = {
  id: RSVP_ID,
  type: 'rsvp',
  category: 'reading',
  nameKey: 'rsvp.name',
  descriptionKey: 'rsvp.description',
  defaultConfig: {
    initialDifficulty: 1,
    wpm: 250,
    fontSize: 32,
    text: '',
    updateIntervalMs: 16, // 60 FPS hassasiyet
  }
};
