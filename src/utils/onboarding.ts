import { MAX_DIFFICULTY, MIN_DIFFICULTY } from "@/utils/adaptiveDifficulty";
import type { DifficultyLevel } from "@/types/exercise";

/**
 * The reading exercises map difficulty to speed as `wpm = 100 + level * 50`
 * (see `utils/difficultyMapper.ts`). This is the inverse: given the WPM the
 * onboarding assessment measured, pick the level whose target speed is
 * closest to it.
 *
 * Without this, every user starts at level 1 (150 WPM) regardless of what the
 * assessment measured - a 400 WPM reader has to grind five sessions of
 * pointlessly slow text before the adaptive loop catches up to where they
 * already were.
 */
export function startingLevelFromWpm(wpm: number): DifficultyLevel {
  if (!Number.isFinite(wpm) || wpm <= 0) return MIN_DIFFICULTY as DifficultyLevel;

  const level = Math.round((wpm - 100) / 50);
  return Math.min(MAX_DIFFICULTY, Math.max(MIN_DIFFICULTY, level)) as DifficultyLevel;
}
