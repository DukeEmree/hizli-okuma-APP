import { ExerciseResult, ProgressionState, DifficultyLevel } from "@/types/exercise";

export type PerformanceEvaluation = 'success' | 'failure' | 'neutral';

export const ADAPTIVE_ALGORITHM_VERSION = 1;

/**
 * Evaluate performance of an exercise session to determine if the user succeeded, failed, or stayed neutral.
 */
export function evaluatePerformance(result: ExerciseResult): PerformanceEvaluation {
  const isReading = result.exerciseType === 'rsvp' || result.exerciseType === 'chunking' || result.exerciseType === 'pacer';
  
  if (isReading) {
    const comprehension = result.metrics.comprehensionAccuracy;
    // If it's a reading exercise without comprehension, evaluate by completion rate
    if (comprehension === undefined) {
      const completion = result.metrics.completionRate || 0;
      if (completion >= 0.9) return 'success';
      if (completion < 0.5) return 'failure';
      return 'neutral';
    }

    // High speed but low comprehension -> failure
    if (comprehension < 0.7) {
      return 'failure';
    }

    // High comprehension
    if (comprehension >= 0.8) {
      return 'success';
    }

    return 'neutral';
  } else {
    // Attention/Focus (Schulte, Scanning, etc)
    const accuracy = result.metrics.correctCount !== undefined && result.metrics.errorCount !== undefined
      ? result.metrics.correctCount / Math.max(1, (result.metrics.correctCount + result.metrics.errorCount))
      : 1;
    
    if (accuracy >= 0.9) {
      return 'success';
    }
    if (accuracy < 0.7) {
      return 'failure';
    }
    return 'neutral';
  }
}

/**
 * Given the current state and evaluation, compute the next difficulty level based on Hysteresis.
 */
export function calculateNextDifficulty(
  currentState: ProgressionState,
  evaluation: PerformanceEvaluation
): ProgressionState {
  let { currentLevel, consecutiveSuccesses, consecutiveFailures, historicalBest } = currentState;
  
  if (evaluation === 'success') {
    consecutiveSuccesses += 1;
    consecutiveFailures = 0;
    
    // Level up if 2 consecutive successes
    if (consecutiveSuccesses >= 2) {
      currentLevel = Math.min(10, currentLevel + 1) as DifficultyLevel;
      consecutiveSuccesses = 0; // Reset after leveling up
    }
  } else if (evaluation === 'failure') {
    consecutiveFailures += 1;
    consecutiveSuccesses = 0;
    
    // Level down if 2 consecutive failures
    if (consecutiveFailures >= 2) {
      currentLevel = Math.max(1, currentLevel - 1) as DifficultyLevel;
      consecutiveFailures = 0; // Reset after leveling down
    }
  } else {
    // Neutral resets counters to prevent stale accumulation
    consecutiveSuccesses = 0;
    consecutiveFailures = 0;
  }
  
  if (currentLevel > historicalBest) {
    historicalBest = currentLevel;
  }

  return {
    currentLevel,
    consecutiveSuccesses,
    consecutiveFailures,
    historicalBest
  };
}
