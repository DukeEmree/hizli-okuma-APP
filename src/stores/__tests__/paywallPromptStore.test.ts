/// <reference types="bun-types" />
import { describe, expect, test, beforeEach } from 'bun:test';
import { usePaywallPromptStore } from '@/stores/paywallPromptStore';

describe('usePaywallPromptStore', () => {
  beforeEach(() => {
    usePaywallPromptStore.getState().resetPrompts();
  });

  test('başlangıçta prompt geçmişi boş olmalı', () => {
    const state = usePaywallPromptStore.getState();
    expect(state.lastShownAt).toBe(0);
    expect(state.lastTrigger).toBeNull();
  });

  test('markShown tetikleyici ve zamanı kaydetmeli', () => {
    const timestamp = 1700000000000;
    usePaywallPromptStore.getState().markShown('streak_milestone', timestamp);

    const state = usePaywallPromptStore.getState();
    expect(state.lastShownAt).toBe(timestamp);
    expect(state.lastTrigger).toBe('streak_milestone');
  });

  test('resetPrompts tüm prompt durumunu sıfırlamalı', () => {
    usePaywallPromptStore.getState().markShown('daily_plan_complete', 1700000000000);
    expect(usePaywallPromptStore.getState().lastShownAt).toBe(1700000000000);

    usePaywallPromptStore.getState().resetPrompts();
    const state = usePaywallPromptStore.getState();
    expect(state.lastShownAt).toBe(0);
    expect(state.lastTrigger).toBeNull();
  });
});
