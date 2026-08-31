export interface PaywallPromptState {
  lastShownAt: number;
  lastTrigger: string | null;
}

/** Minimum silence period between interstitial paywall prompts. */
export const INTERSTITIAL_MIN_INTERVAL_MS = 4 * 24 * 60 * 60 * 1000;

/**
 * How long the celebration gets to itself before an interstitial paywall
 * opens over it.
 *
 * Both interstitial triggers fire on the best moment the app has - the day's
 * plan finished, or a streak milestone reached - and both used to push the
 * paywall in a mount effect with no delay, so the modal covered the
 * congratulation before it could be read. The user saw the offer instead of
 * the reward, which weakens both.
 *
 * Leaving the screen inside this window cancels the prompt entirely, and it
 * is only recorded as shown once it actually opens, so an unseen prompt never
 * spends the four-day silence above.
 */
export const INTERSTITIAL_DELAY_MS = 2000;

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
