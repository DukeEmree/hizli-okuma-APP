import { init, track } from '@amplitude/analytics-react-native';

/**
 * Every event the app actually emits. Kept in sync with the call sites
 * deliberately: an event name that exists here but is never tracked shows up
 * as an empty chart in Amplitude and is worse than no entry at all.
 *
 * There is no authentication and no backend, so there is no user identity to
 * set (Amplitude's own device id is the only identifier) and no sync events.
 */
type EventName =
  | 'app_opened'
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'exercise_started'
  | 'exercise_completed'
  | 'exercise_abandoned'
  | 'achievement_unlocked'
  | 'daily_plan_started'
  | 'daily_plan_completed'
  | 'paywall_viewed'
  | 'subscription_started'
  | 'subscription_restored';

/**
 * Property names that must never leave the device. Matched exactly rather
 * than by substring: a substring match on "name" would also silently drop
 * legitimate properties like `exerciseName`, which is the kind of hole that
 * only shows up as missing data weeks later.
 */
const BLOCKED_PROPERTY_KEYS = new Set([
  'email',
  'password',
  'secret',
  'token',
  'apikey',
  'api_key',
  'username',
  'fullname',
  'full_name',
  'phone',
]);

export const analytics = {
  init: () => {
    if (__DEV__) {
      console.log('Amplitude disabled in DEV mode.');
      return;
    }

    const apiKey = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY;
    if (!apiKey) {
      console.warn('No Amplitude API Key provided. Amplitude disabled.');
      return;
    }

    init(apiKey);
  },

  track: (eventName: EventName, properties?: Record<string, string | number | boolean | undefined>) => {
    const sanitizedProps: Record<string, string | number | boolean> = {};

    for (const [key, value] of Object.entries(properties ?? {})) {
      // Undefined values are dropped rather than sent: Amplitude records them
      // as a present-but-empty property, which is indistinguishable from a
      // real value in charts.
      if (value === undefined) continue;
      if (BLOCKED_PROPERTY_KEYS.has(key.toLowerCase())) continue;
      sanitizedProps[key] = value;
    }

    if (__DEV__) {
      console.log(`[Analytics Track] ${eventName}`, sanitizedProps);
      return;
    }

    track(eventName, sanitizedProps);
  },
};
