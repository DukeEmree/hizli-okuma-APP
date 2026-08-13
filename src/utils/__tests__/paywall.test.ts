import { describe, expect, test } from 'bun:test';
import { INTERSTITIAL_MIN_INTERVAL_MS, shouldShowInterstitialPaywall } from '@/utils/paywall';

describe('shouldShowInterstitialPaywall', () => {
  test('never shows to premium users', () => {
    expect(shouldShowInterstitialPaywall({ lastShownAt: 0, lastTrigger: null }, true, Date.now())).toBe(false);
  });

  test('shows on first prompt for a free user', () => {
    expect(shouldShowInterstitialPaywall({ lastShownAt: 0, lastTrigger: null }, false, Date.now())).toBe(true);
  });

  test('stays silent before the minimum interval has passed', () => {
    const now = 1_000_000_000_000;
    const state = { lastShownAt: now - INTERSTITIAL_MIN_INTERVAL_MS + 1000, lastTrigger: 'daily_plan_complete' };
    expect(shouldShowInterstitialPaywall(state, false, now)).toBe(false);
  });

  test('shows again once the minimum interval has passed', () => {
    const now = 1_000_000_000_000;
    const state = { lastShownAt: now - INTERSTITIAL_MIN_INTERVAL_MS, lastTrigger: 'daily_plan_complete' };
    expect(shouldShowInterstitialPaywall(state, false, now)).toBe(true);
  });
});
