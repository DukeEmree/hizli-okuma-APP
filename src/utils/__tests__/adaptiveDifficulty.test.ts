import { expect, test, describe } from "bun:test";
import {
  calculateNextProgression,
  MAX_DIFFICULTY,
  MIN_DIFFICULTY,
  SUCCESS_THRESHOLD_ACCURACY,
  FAILURE_THRESHOLD_ACCURACY,
  SUCCESS_CONSECUTIVE_REQUIRED,
  FAILURE_CONSECUTIVE_REQUIRED
} from "../adaptiveDifficulty";
import { ExerciseResult, ProgressionState } from "@/types/exercise";

describe("Adaptive Difficulty Engine", () => {
  
  const createInitialState = (level = 1): ProgressionState => ({
    currentLevel: level as ProgressionState["currentLevel"],
    consecutiveSuccesses: 0,
    consecutiveFailures: 0,
    historicalBest: level,
  });

  const createMockResult = (accuracy: number, comprehension?: number): ExerciseResult => ({
    exerciseId: "test-1",
    exerciseType: "rsvp",
    algorithmVersion: 1,
    startedAt: Date.now(),
    completedAt: Date.now() + 1000,
    durationMs: 1000,
    difficulty: 1,
    score: {
      rawScore: 100,
      speedBonus: 0,
      accuracy,
      difficultyMultiplier: 1,
      finalScore: 100
    },
    metrics: comprehension !== undefined ? { comprehensionAccuracy: comprehension } : {}
  });

  describe("Basic Performance Evaluation", () => {
    test("Neutral performance resets streaks", () => {
      const state = { ...createInitialState(5), consecutiveSuccesses: 1, consecutiveFailures: 1 };
      const result = createMockResult(0.7); // Neutral: 0.5 <= x < 0.8
      
      const nextState = calculateNextProgression(result, state);
      
      expect(nextState.currentLevel).toBe(5);
      expect(nextState.consecutiveSuccesses).toBe(0);
      expect(nextState.consecutiveFailures).toBe(0);
    });

    test("Success performance increments success streak and resets failure streak", () => {
      const state = { ...createInitialState(5), consecutiveFailures: 1 };
      const result = createMockResult(0.85); // Success: >= 0.8
      
      const nextState = calculateNextProgression(result, state);
      
      expect(nextState.currentLevel).toBe(5);
      expect(nextState.consecutiveSuccesses).toBe(1);
      expect(nextState.consecutiveFailures).toBe(0);
    });

    test("Failure performance increments failure streak and resets success streak", () => {
      const state = { ...createInitialState(5), consecutiveSuccesses: 1 };
      const result = createMockResult(0.4); // Failure: < 0.5
      
      const nextState = calculateNextProgression(result, state);
      
      expect(nextState.currentLevel).toBe(5);
      expect(nextState.consecutiveSuccesses).toBe(0);
      expect(nextState.consecutiveFailures).toBe(1);
    });
  });

  describe("Level Progression & Regression", () => {
    test("Level up when consecutive successes reach threshold", () => {
      const state = { ...createInitialState(5), consecutiveSuccesses: SUCCESS_CONSECUTIVE_REQUIRED - 1 };
      const result = createMockResult(1.0);
      
      const nextState = calculateNextProgression(result, state);
      
      expect(nextState.currentLevel).toBe(6);
      expect(nextState.consecutiveSuccesses).toBe(0); // Should reset after level up
      expect(nextState.historicalBest).toBe(6); // Should update historical best
    });

    test("Level down when consecutive failures reach threshold", () => {
      const state = { ...createInitialState(5), consecutiveFailures: FAILURE_CONSECUTIVE_REQUIRED - 1 };
      const result = createMockResult(0.0);
      
      const nextState = calculateNextProgression(result, state);
      
      expect(nextState.currentLevel).toBe(4);
      expect(nextState.consecutiveFailures).toBe(0); // Should reset after level down
      expect(nextState.historicalBest).toBe(5); // Historical best should remain 5
    });
  });

  describe("Threshold Boundaries", () => {
    test("Accuracy exactly on success threshold is a success", () => {
      const state = createInitialState(1);
      const result = createMockResult(SUCCESS_THRESHOLD_ACCURACY);
      const nextState = calculateNextProgression(result, state);
      expect(nextState.consecutiveSuccesses).toBe(1);
    });

    test("Accuracy just below success threshold is neutral", () => {
      const state = createInitialState(1);
      const result = createMockResult(SUCCESS_THRESHOLD_ACCURACY - 0.01);
      const nextState = calculateNextProgression(result, state);
      expect(nextState.consecutiveSuccesses).toBe(0);
      expect(nextState.consecutiveFailures).toBe(0);
    });

    test("Accuracy exactly on failure threshold is neutral", () => {
      const state = createInitialState(1);
      const result = createMockResult(FAILURE_THRESHOLD_ACCURACY);
      const nextState = calculateNextProgression(result, state);
      expect(nextState.consecutiveSuccesses).toBe(0);
      expect(nextState.consecutiveFailures).toBe(0);
    });

    test("Accuracy just below failure threshold is failure", () => {
      const state = createInitialState(1);
      const result = createMockResult(FAILURE_THRESHOLD_ACCURACY - 0.01);
      const nextState = calculateNextProgression(result, state);
      expect(nextState.consecutiveFailures).toBe(1);
    });
  });

  describe("Level Limits (Min/Max Boundaries)", () => {
    test("Cannot level down below MIN_DIFFICULTY", () => {
      const state = { ...createInitialState(MIN_DIFFICULTY), consecutiveFailures: FAILURE_CONSECUTIVE_REQUIRED - 1 };
      const result = createMockResult(0); // Failure
      
      const nextState = calculateNextProgression(result, state);
      
      expect(nextState.currentLevel).toBe(MIN_DIFFICULTY as any);
      expect(nextState.consecutiveFailures).toBe(0); // Still resets streaks
    });

    test("Cannot level up above MAX_DIFFICULTY", () => {
      const state = { ...createInitialState(MAX_DIFFICULTY), consecutiveSuccesses: SUCCESS_CONSECUTIVE_REQUIRED - 1 };
      const result = createMockResult(1); // Success
      
      const nextState = calculateNextProgression(result, state);
      
      expect(nextState.currentLevel).toBe(MAX_DIFFICULTY as any);
      expect(nextState.consecutiveSuccesses).toBe(0); // Still resets streaks
    });
  });

  describe("Comprehension Evaluation", () => {
    test("Success requires BOTH good accuracy and good comprehension", () => {
      const state = createInitialState(5);
      
      // Good accuracy, bad comprehension -> Failure (because comprehension < 0.5)
      let result = createMockResult(0.9, 0.4);
      let nextState = calculateNextProgression(result, state);
      expect(nextState.consecutiveFailures).toBe(1);
      expect(nextState.consecutiveSuccesses).toBe(0);

      // Good accuracy, neutral comprehension -> Neutral (neither success nor failure conditions met fully for BOTH)
      // Wait, let's trace the logic:
      // hasGoodAccuracy=true, hasGoodComprehension=false, hasBadAccuracy=false, hasBadComprehension=false
      // isSuccess = false, isFailure = false
      result = createMockResult(0.9, 0.6);
      nextState = calculateNextProgression(result, state);
      expect(nextState.consecutiveFailures).toBe(0);
      expect(nextState.consecutiveSuccesses).toBe(0);

      // Good accuracy, good comprehension -> Success
      result = createMockResult(0.9, 0.9);
      nextState = calculateNextProgression(result, state);
      expect(nextState.consecutiveSuccesses).toBe(1);
    });

    test("Failure triggers if EITHER accuracy or comprehension is bad", () => {
      const state = createInitialState(5);
      
      // Bad accuracy, good comprehension -> Failure
      let result = createMockResult(0.4, 0.9);
      let nextState = calculateNextProgression(result, state);
      expect(nextState.consecutiveFailures).toBe(1);

      // Good accuracy, bad comprehension -> Failure
      result = createMockResult(0.9, 0.4);
      nextState = calculateNextProgression(result, state);
      expect(nextState.consecutiveFailures).toBe(1);

      // Bad accuracy, bad comprehension -> Failure
      result = createMockResult(0.4, 0.4);
      nextState = calculateNextProgression(result, state);
      expect(nextState.consecutiveFailures).toBe(1);
    });
  });

  describe("Edge Cases", () => {
    test("Accuracy = 0", () => {
      const state = createInitialState(3);
      const result = createMockResult(0);
      const nextState = calculateNextProgression(result, state);
      expect(nextState.consecutiveFailures).toBe(1);
    });

    test("Accuracy = 1", () => {
      const state = createInitialState(3);
      const result = createMockResult(1);
      const nextState = calculateNextProgression(result, state);
      expect(nextState.consecutiveSuccesses).toBe(1);
    });

    test("Invalid currentLevel (less than min) gets normalized", () => {
      const state = createInitialState(-5);
      const result = createMockResult(0.7); // Neutral
      const nextState = calculateNextProgression(result, state);
      expect(nextState.currentLevel).toBe(MIN_DIFFICULTY as any);
    });

    test("Invalid currentLevel (greater than max) gets normalized", () => {
      const state = createInitialState(15);
      const result = createMockResult(0.7); // Neutral
      const nextState = calculateNextProgression(result, state);
      expect(nextState.currentLevel).toBe(MAX_DIFFICULTY as any);
    });
  });
});
