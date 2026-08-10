import { init, track } from '@amplitude/analytics-react-native';

type EventName = 
  | 'app_opened'
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'exercise_started'
  | 'exercise_completed'
  | 'exercise_abandoned'
  | 'streak_achieved'
  | 'paywall_viewed'
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'achievement_unlocked'
  | 'sync_started'
  | 'sync_completed'
  | 'sync_failed';

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

  track: (eventName: EventName, properties?: Record<string, string | number | boolean>) => {
    // Basic PII sanitization - don't allow email, password, etc.
    const sanitizedProps = { ...properties };
    const piiKeys = ['email', 'password', 'secret', 'token', 'name'];
    
    Object.keys(sanitizedProps).forEach(key => {
      if (piiKeys.some(pii => key.toLowerCase().includes(pii))) {
        delete sanitizedProps[key];
      }
    });

    if (__DEV__) {
      console.log(`[Analytics Track] ${eventName}`, sanitizedProps);
      return;
    }

    track(eventName, sanitizedProps);
  }
};
