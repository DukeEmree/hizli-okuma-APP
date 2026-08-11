export const SUBSCRIPTION_CONSTANTS = {
  ENTITLEMENT_ID: 'hizli-okuma Pro',
  REVENUECAT_API_KEY_ANDROID: process.env.EXPO_PUBLIC_RC_ANDROID_KEY || 'api_key_android_here',
  REVENUECAT_API_KEY_IOS: process.env.EXPO_PUBLIC_RC_IOS_KEY || 'api_key_ios_here',
  
  // Free tier limits
  FREE_TIER: {
    MAX_DAILY_EXERCISES: 6,
    HAS_ADVANCED_STATS: false,
    ALLOWED_EXERCISES: ['rsvp', 'pacer'], // Others might be premium
  },
  
  // Premium limits (basically unlimited)
  PREMIUM_TIER: {
    MAX_DAILY_EXERCISES: Infinity,
    HAS_ADVANCED_STATS: true,
    ALLOWED_EXERCISES: ['rsvp', 'pacer', 'chunking', 'schulte', 'scanning', 'comprehension'],
  }
};
