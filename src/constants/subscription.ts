export const SUBSCRIPTION_CONSTANTS = {
  ENTITLEMENT_ID: 'hizli-okuma Pro',
  // Empty string (not a placeholder like 'api_key_android_here') when the
  // build-time variable is missing, so RevenueCatProvider can tell "not
  // configured for this platform" apart from a real key instead of handing
  // the SDK a string that is guaranteed to fail authentication.
  REVENUECAT_API_KEY_ANDROID: process.env.EXPO_PUBLIC_RC_ANDROID_KEY ?? '',
  REVENUECAT_API_KEY_IOS: process.env.EXPO_PUBLIC_RC_IOS_KEY ?? '',
};
