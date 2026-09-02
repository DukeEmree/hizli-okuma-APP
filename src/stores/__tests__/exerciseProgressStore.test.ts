/// <reference types="bun-types" />
import { describe, expect, test, beforeEach } from 'bun:test';
import { useExerciseProgressStore } from '@/stores/exerciseProgressStore';

describe('useExerciseProgressStore', () => {
  beforeEach(() => {
    useExerciseProgressStore.getState().resetAll();
  });

  test('kayıtsız bir egzersiz için varsayılan metrikleri dönmeli', () => {
    const metrics = useExerciseProgressStore.getState().getExerciseMetrics('schulte');
    expect(metrics.currentDifficulty).toBe(1);
    expect(metrics.bestScore).toBe(0);
    expect(metrics.bestWpm).toBe(0);
    expect(metrics.attemptCount).toBe(0);
  });

  test('updateExerciseMetrics en yüksek skor ve WPM değerlerini otomatik korumalı', () => {
    const store = useExerciseProgressStore.getState();
    store.updateExerciseMetrics('schulte', {
      currentDifficulty: 2,
      bestScore: 2500,
      bestWpm: 300,
      bestAccuracy: 0.9,
    });

    let metrics = useExerciseProgressStore.getState().getExerciseMetrics('schulte');
    expect(metrics.currentDifficulty).toBe(2);
    expect(metrics.bestScore).toBe(2500);
    expect(metrics.bestWpm).toBe(300);

    // Daha düşük skor gönderildiğinde bestScore düşmemeli
    store.updateExerciseMetrics('schulte', {
      currentDifficulty: 3,
      bestScore: 1800,
      bestWpm: 250,
    });

    metrics = useExerciseProgressStore.getState().getExerciseMetrics('schulte');
    expect(metrics.currentDifficulty).toBe(3);
    expect(metrics.bestScore).toBe(2500);
    expect(metrics.bestWpm).toBe(300);
  });

  test('incrementAttempt deneme sayısını 1 artırmalı', () => {
    const store = useExerciseProgressStore.getState();
    expect(store.getExerciseMetrics('rsvp').attemptCount).toBe(0);

    store.incrementAttempt('rsvp');
    expect(useExerciseProgressStore.getState().getExerciseMetrics('rsvp').attemptCount).toBe(1);

    store.incrementAttempt('rsvp');
    expect(useExerciseProgressStore.getState().getExerciseMetrics('rsvp').attemptCount).toBe(2);
  });

  test('resetAll tüm egzersiz ilerlemelerini temizlemeli', () => {
    const store = useExerciseProgressStore.getState();
    store.updateExerciseMetrics('pacer', { bestScore: 5000 });
    expect(store.getExerciseMetrics('pacer').bestScore).toBe(5000);

    store.resetAll();
    expect(useExerciseProgressStore.getState().exercises).toEqual({});
    expect(useExerciseProgressStore.getState().getExerciseMetrics('pacer').bestScore).toBe(0);
  });
});
