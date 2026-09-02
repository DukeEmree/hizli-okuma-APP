/// <reference types="bun-types" />
import { describe, expect, test, beforeEach } from 'bun:test';
import { useStreakCacheStore } from '@/stores/streakCacheStore';

describe('useStreakCacheStore', () => {
  beforeEach(() => {
    useStreakCacheStore.getState().resetCache();
  });

  test('başlangıç değerleri sıfır olmalı', () => {
    const state = useStreakCacheStore.getState();
    expect(state.currentStreak).toBe(0);
    expect(state.longestStreak).toBe(0);
    expect(state.lastActivityAt).toBe(0);
    expect(state.freezesAvailable).toBe(0);
  });

  test('updateCache önbelleği güncellemeli', () => {
    const store = useStreakCacheStore.getState();
    store.updateCache({
      currentStreak: 5,
      longestStreak: 12,
      lastActivityAt: 1700000000000,
      freezesAvailable: 2,
    });

    const state = useStreakCacheStore.getState();
    expect(state.currentStreak).toBe(5);
    expect(state.longestStreak).toBe(12);
    expect(state.lastActivityAt).toBe(1700000000000);
    expect(state.freezesAvailable).toBe(2);
  });

  test('resetCache tüm seriyi sıfırlamalı', () => {
    const store = useStreakCacheStore.getState();
    store.updateCache({
      currentStreak: 10,
      longestStreak: 20,
      lastActivityAt: 1700000000000,
      freezesAvailable: 1,
    });

    store.resetCache();
    const state = useStreakCacheStore.getState();
    expect(state.currentStreak).toBe(0);
    expect(state.longestStreak).toBe(0);
    expect(state.lastActivityAt).toBe(0);
    expect(state.freezesAvailable).toBe(0);
  });
});
