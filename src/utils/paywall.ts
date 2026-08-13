export interface PaywallPromptState {
  lastShownAt: number;
  lastTrigger: string | null;
}

/** Minimum silence period between interstitial paywall prompts. */
export const INTERSTITIAL_MIN_INTERVAL_MS = 4 * 24 * 60 * 60 * 1000;

/**
 * Decides whether an interstitial (unprompted) paywall may be shown right
 * now. Premium users never see it; everyone else is rate-limited so the
 * prompt can't fire back-to-back or annoy on every session.
 */
export function shouldShowInterstitialPaywall(
  state: PaywallPromptState,
  isPremium: boolean,
  now: number
): boolean {
  if (isPremium) return false;
  if (state.lastShownAt === 0) return true;
  return now - state.lastShownAt >= INTERSTITIAL_MIN_INTERVAL_MS;
}
