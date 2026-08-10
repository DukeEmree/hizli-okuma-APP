/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test';
import { evaluatePerformance, calculateNextDifficulty } from "@/utils/adaptive";
import { ExerciseResult, ProgressionState, DifficultyLevel } from "@/types/exercise";

describe('Adaptive Difficulty Engine', () => {
  describe('evaluatePerformance', () => {
    test('Okuma hızı yüksek ancak anlama oranı düşükse -> failure', () => {
      const result = {
        exerciseType: 'rsvp',
        metrics: {
          wpm: 450,
          comprehensionAccuracy: 0.55 // 55%
        }
      } as unknown as ExerciseResult;
      
      const evalResult = evaluatePerformance(result);
      expect(evalResult).toBe('failure');
    });

    test('Okuma hızı yavaş ancak anlama oranı yüksekse -> success', () => {
      const result = {
        exerciseType: 'rsvp',
        metrics: {
          wpm: 320,
          comprehensionAccuracy: 0.94 // 94%
        }
      } as unknown as ExerciseResult;
      
      const evalResult = evaluatePerformance(result);
      expect(evalResult).toBe('success');
    });

    test('Dikkat egzersizi için çok hata varsa -> failure', () => {
      const result = {
        exerciseType: 'schulte',
        metrics: {
          correctCount: 20,
          errorCount: 15 // Yüksek hata oranı
        }
      } as unknown as ExerciseResult;
      
      const evalResult = evaluatePerformance(result);
      expect(evalResult).toBe('failure'); // 20 / 35 = 57% accuracy
    });

    test('Dikkat egzersizi için az hata varsa -> success', () => {
      const result = {
        exerciseType: 'schulte',
        metrics: {
          correctCount: 25,
          errorCount: 1 
        }
      } as unknown as ExerciseResult;
      
      const evalResult = evaluatePerformance(result);
      expect(evalResult).toBe('success'); // 25 / 26 = 96% accuracy
    });
  });

  describe('calculateNextDifficulty (Hysteresis)', () => {
    test('2 ardışık başarı seviye atlatır ve sayaçları sıfırlar', () => {
      let state = {
        currentLevel: 4 as DifficultyLevel,
        consecutiveSuccesses: 1,
        consecutiveFailures: 0,
        historicalBest: 4,
      } as ProgressionState;
      
      state = calculateNextDifficulty(state, 'success');
      
      expect(state.currentLevel).toBe(5);
      expect(state.consecutiveSuccesses).toBe(0); // Reset
      expect(state.historicalBest).toBe(5);
    });

    test('2 ardışık başarısızlık seviye düşürür ve sayaçları sıfırlar', () => {
      let state = {
        currentLevel: 4 as DifficultyLevel,
        consecutiveSuccesses: 0,
        consecutiveFailures: 1,
        historicalBest: 4,
      } as ProgressionState;
      
      state = calculateNextDifficulty(state, 'failure');
      
      expect(state.currentLevel).toBe(3);
      expect(state.consecutiveFailures).toBe(0); // Reset
    });

    test('Nötr sonuç sayaçları sıfırlar ancak seviyeyi değiştirmez', () => {
      let state = {
        currentLevel: 4 as DifficultyLevel,
        consecutiveSuccesses: 1, // Atlamaya 1 kalmıştı
        consecutiveFailures: 0,
        historicalBest: 4,
      } as ProgressionState;
      
      state = calculateNextDifficulty(state, 'neutral');
      
      expect(state.currentLevel).toBe(4);
      expect(state.consecutiveSuccesses).toBe(0);
    });

    test('Zorluk sınırları (1 ve 10) korunur', () => {
      let stateMin = {
        currentLevel: 1 as DifficultyLevel,
        consecutiveSuccesses: 0,
        consecutiveFailures: 1,
        historicalBest: 1,
      } as ProgressionState;
      
      // 2nd failure shouldn't go below 1
      stateMin = calculateNextDifficulty(stateMin, 'failure');
      expect(stateMin.currentLevel).toBe(1);

      let stateMax = {
        currentLevel: 10 as DifficultyLevel,
        consecutiveSuccesses: 1,
        consecutiveFailures: 0,
        historicalBest: 10,
      } as ProgressionState;
      
      // 2nd success shouldn't go above 10
      stateMax = calculateNextDifficulty(stateMax, 'success');
      expect(stateMax.currentLevel).toBe(10);
    });
  });
});
