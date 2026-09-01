/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test';
import { calculateReadingScore, calculateAttentionScore, calculateExerciseScore } from "@/utils/scoring";

describe('Scoring Utilities', () => {
  describe('calculateReadingScore', () => {
    test('Temel okuma skoru hesaplanmalı (wpm=250, süre=60s, zorluk=1)', () => {
      // (250 / 10) * (60000 / 60000) = 25
      // 25 * 100 = 2500
      const score = calculateReadingScore({ wpm: 250 }, 60000, 1);
      expect(score.rawScore).toBe(2500);
      expect(score.finalScore).toBe(2500);
      expect(score.accuracy).toBe(1);
    });

    test('Anlama oranı (comprehension) skoru çarpan olarak etkilemeli', () => {
      // (300 / 10) * (120000 / 60000) = 60
      // 60 * 100 = 6000 base
      // %50 accuracy -> final = 3000
      const score = calculateReadingScore({ wpm: 300, comprehensionAccuracy: 0.5 }, 120000, 1);
      expect(score.rawScore).toBe(6000);
      expect(score.accuracy).toBe(0.5);
      expect(score.finalScore).toBe(3000);
    });

    test('Zorluk seviyesi skoru artırmalı (Seviye 5 = 1.4x çarpan)', () => {
      // (200 / 10) * 1 dk = 20 -> 2000 base
      // Zorluk 5 -> 1 + (4 * 0.1) = 1.4
      // Final: 2000 * 1.4 = 2800
      const score = calculateReadingScore({ wpm: 200 }, 60000, 5);
      expect(score.rawScore).toBe(2000);
      expect(score.difficultyMultiplier).toBe(1.4);
      expect(score.finalScore).toBe(2800);
    });

    test('Çok kısa sürelerde negatif puan üretilmemeli', () => {
      const score = calculateReadingScore({ wpm: 0 }, 500, 1);
      expect(score.rawScore).toBe(0);
      expect(score.finalScore).toBe(0);
    });
  });

  describe('calculateAttentionScore', () => {
    test('Mükemmel doğruluk ve hızlı tepki ile yüksek puan (250ms, %100, seviye 1)', () => {
      // Avg RT: 250
      // 1000 / 250 = 4 -> raw = 400
      const score = calculateAttentionScore({ reactionTimeMs: [200, 300], correctCount: 5, errorCount: 0 }, 1);
      expect(score.rawScore).toBe(400);
      expect(score.accuracy).toBe(1);
      expect(score.finalScore).toBe(400);
    });

    test('Hatalar puanı doğrusal (accuracy) düşürmeli', () => {
      // RT = 500ms
      // 1000 / 500 = 2 -> raw = 200
      // 1 doğru, 1 yanlış = %50 accuracy -> final = 100
      const score = calculateAttentionScore({ reactionTimeMs: [500, 500], correctCount: 1, errorCount: 1 }, 1);
      expect(score.rawScore).toBe(200);
      expect(score.accuracy).toBe(0.5);
      expect(score.finalScore).toBe(100);
    });

    test('Sıfır veya çok düşük tepki süresi (imkansız) sınırlanmalı (min 100ms)', () => {
      // Normalde 1000/10 = 100 ama 100ms limite takılıp 1000/100 = 10 olacak (1000)
      const score = calculateAttentionScore({ reactionTimeMs: [10], correctCount: 1, errorCount: 0 }, 1);
      expect(score.rawScore).toBe(1000); // Max possible base score with 100ms is 1000
    });
  });

  describe('calculateExerciseScore (Router)', () => {
    test('Kategoriye göre doğru fonksiyonu seçmeli', () => {
      const reading = calculateExerciseScore('reading', { wpm: 250 }, 60000, 1);
      expect(reading.rawScore).toBe(2500);

      const attention = calculateExerciseScore('focus', { reactionTimeMs: [250], correctCount: 1, errorCount: 0 }, 0, 1);
      expect(attention.rawScore).toBe(400);
    });

    test('Kavrama (comprehension) WPM içeriyorsa okuma skoru hesaplanmalı', () => {
      const comprehensionWithWpm = calculateExerciseScore('comprehension', { wpm: 300, comprehensionAccuracy: 0.8 }, 60000, 2);
      // (300 / 10) * 1 dk = 30 -> 3000 base
      // accuracy 0.8 -> 2400
      // diff 2 (1.1x) -> 2640
      expect(comprehensionWithWpm.rawScore).toBe(3000);
      expect(comprehensionWithWpm.finalScore).toBe(2640);
    });

    test('Kavrama (comprehension) WPM içermiyorsa (örn. main-idea) doğruluk skoru hesaplanmalı', () => {
      const comprehensionNoWpm = calculateExerciseScore('comprehension', { correctCount: 3, errorCount: 1 }, 30000, 1);
      // RT safe limit 100ms -> raw = 1000
      // accuracy 3/4 = 0.75
      // diff 1 -> final = 750
      expect(comprehensionNoWpm.rawScore).toBe(1000);
      expect(comprehensionNoWpm.accuracy).toBe(0.75);
      expect(comprehensionNoWpm.finalScore).toBe(750);
    });
  });
});
