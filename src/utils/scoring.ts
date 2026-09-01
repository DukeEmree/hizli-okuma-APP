import { ExerciseScore, ExerciseMetrics, DifficultyLevel } from "@/types/exercise";

export const CURRENT_ALGORITHM_VERSION = 1;

/**
 * Reading exercises (RSVP, Chunking, Pacer) scoring logic.
 * Base score depends on WPM and duration.
 * Comprehension accuracy (if available) acts as a multiplier.
 * Difficulty multiplier scales the final score.
 */
export function calculateReadingScore(
  metrics: ExerciseMetrics,
  durationMs: number,
  difficulty: DifficultyLevel
): ExerciseScore {
  const wpm = metrics.wpm || 0;
  
  // Base raw score: 1 point for every 10 WPM sustained for 1 minute
  // raw = (WPM / 10) * (durationMs / 60000)
  // To avoid 0 scores for short exercises, we will provide a sensible math.
  let rawScore = (wpm / 10) * (durationMs / 60000);
  
  // If it's too short (e.g., just testing), we might get fractions.
  rawScore = Math.max(0, rawScore);

  let accuracy = 1; // Default to 100% if no comprehension
  if (metrics.comprehensionAccuracy !== undefined) {
    accuracy = metrics.comprehensionAccuracy;
  } else if (metrics.completionRate !== undefined) {
    // If no comprehension but completion rate exists, accuracy can be bound to completion.
    accuracy = metrics.completionRate;
  }

  // Difficulty multiplier: 1.0 at level 1, up to 2.0 at level 10 (0.1 step)
  const difficultyMultiplier = 1 + ((difficulty - 1) * 0.1);

  let finalScore = rawScore * accuracy * difficultyMultiplier;

  // Let's amplify the score so it's a nice integer for gamification (e.g. * 100)
  rawScore = Math.round(rawScore * 100);
  finalScore = Math.round(finalScore * 100);

  return {
    rawScore,
    accuracy,
    difficultyMultiplier,
    finalScore
  };
}

/**
 * Attention/Focus exercises (Schulte, Scanning, Memory, Main Idea) scoring logic.
 * Score primarily depends on reaction time (if applicable) and accuracy.
 */
export function calculateAttentionScore(
  metrics: ExerciseMetrics,
  difficulty: DifficultyLevel
): ExerciseScore {
  let avgReactionTime = 0;
  if (metrics.reactionTimeMs && metrics.reactionTimeMs.length > 0) {
    const sum = metrics.reactionTimeMs.reduce((a, b) => a + b, 0);
    avgReactionTime = sum / metrics.reactionTimeMs.length;
  }

  // If reaction time is 0 (impossible, question-answering, or error), we cap it to a logical minimum (100ms)
  const safeReactionTime = Math.max(avgReactionTime, 100);

  // Speed Score: 1000 / reaction time (e.g. 500ms -> 2 points, 250ms -> 4 points, 100ms -> 10 points)
  let rawScore = 1000 / safeReactionTime;

  // Accuracy
  let accuracy = 1;
  if (typeof metrics.comprehensionAccuracy === 'number') {
    accuracy = metrics.comprehensionAccuracy;
  } else {
    const correct = metrics.correctCount || 0;
    const error = metrics.errorCount || 0;
    const total = correct + error;
    if (total > 0) {
      accuracy = correct / total;
    }
  }

  const difficultyMultiplier = 1 + ((difficulty - 1) * 0.1);

  let finalScore = rawScore * accuracy * difficultyMultiplier;

  rawScore = Math.round(rawScore * 100);
  finalScore = Math.round(finalScore * 100);

  return {
    rawScore,
    accuracy,
    difficultyMultiplier,
    finalScore
  };
}

/**
 * General router function
 */
export function calculateExerciseScore(
  category: 'reading' | 'comprehension' | 'vision' | 'memory' | 'focus',
  metrics: ExerciseMetrics,
  durationMs: number,
  difficulty: DifficultyLevel
): ExerciseScore {
  if (category === 'reading') {
    return calculateReadingScore(metrics, durationMs, difficulty);
  } else if (category === 'comprehension') {
    // If comprehension exercise measures WPM (e.g. comprehension-speed), use reading score.
    // Otherwise (e.g. main-idea questions), score by accuracy.
    if (typeof metrics.wpm === 'number' && metrics.wpm > 0) {
      return calculateReadingScore(metrics, durationMs, difficulty);
    }
    return calculateAttentionScore(metrics, difficulty);
  } else {
    // vision, memory, focus defaults to attention logic
    return calculateAttentionScore(metrics, difficulty);
  }
}
