import { ExerciseResult, ProgressionState } from "@/types/exercise";

export const MAX_DIFFICULTY = 10;
export const MIN_DIFFICULTY = 1;

export const SUCCESS_THRESHOLD_ACCURACY = 0.8;
export const FAILURE_THRESHOLD_ACCURACY = 0.5;

export const SUCCESS_CONSECUTIVE_REQUIRED = 2;
export const FAILURE_CONSECUTIVE_REQUIRED = 2;

export function calculateNextProgression(
  result: ExerciseResult,
  currentState: ProgressionState
): ProgressionState {
  const { accuracy } = result.score;
  const comprehensionAccuracy = result.metrics?.comprehensionAccuracy;

  // Determine if this session was a success, failure, or neutral
  let isSuccess = false;
  let isFailure = false;

  // Evaluate accuracy
  const hasGoodAccuracy = accuracy >= SUCCESS_THRESHOLD_ACCURACY;
  const hasBadAccuracy = accuracy < FAILURE_THRESHOLD_ACCURACY;

  // Evaluate comprehension if applicable
  const hasComprehension = typeof comprehensionAccuracy === 'number';
  const hasGoodComprehension = hasComprehension && (comprehensionAccuracy as number) >= SUCCESS_THRESHOLD_ACCURACY;
  const hasBadComprehension = hasComprehension && (comprehensionAccuracy as number) < FAILURE_THRESHOLD_ACCURACY;

  if (hasComprehension) {
    if (hasGoodAccuracy && hasGoodComprehension) {
      isSuccess = true;
    } else if (hasBadAccuracy || hasBadComprehension) {
      isFailure = true;
    }
  } else {
    if (hasGoodAccuracy) {
      isSuccess = true;
    } else if (hasBadAccuracy) {
      isFailure = true;
    }
  }

  let { currentLevel, consecutiveSuccesses, consecutiveFailures, historicalBest } = currentState;

  if (isSuccess) {
    consecutiveSuccesses += 1;
    consecutiveFailures = 0;
  } else if (isFailure) {
    consecutiveFailures += 1;
    consecutiveSuccesses = 0;
  } else {
    // Neutral performance: don't reset streaks to allow eventual leveling if mostly good,
    // but a stricter system might reset them. We'll reset both to ensure a user truly needs
    // consecutive distinct performances to change level.
    consecutiveSuccesses = 0;
    consecutiveFailures = 0;
  }

  // Check if we need to level up
  if (consecutiveSuccesses >= SUCCESS_CONSECUTIVE_REQUIRED) {
    if (currentLevel < MAX_DIFFICULTY) {
      currentLevel += 1;
    }
    consecutiveSuccesses = 0;
    consecutiveFailures = 0;
  }

  // Check if we need to level down
  if (consecutiveFailures >= FAILURE_CONSECUTIVE_REQUIRED) {
    if (currentLevel > MIN_DIFFICULTY) {
      currentLevel -= 1;
    }
    consecutiveSuccesses = 0;
    consecutiveFailures = 0;
  }

  if (currentLevel > historicalBest) {
    historicalBest = currentLevel;
  }

  // Cast to standard levels for TypeScript safety (1-10)
  const normalizedLevel = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, currentLevel)) as ProgressionState['currentLevel'];

  return {
    currentLevel: normalizedLevel,
    consecutiveSuccesses,
    consecutiveFailures,
    historicalBest: Math.max(historicalBest, normalizedLevel),
  };
}
