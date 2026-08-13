import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo } from 'react-native-purchases';
import { SUBSCRIPTION_CONSTANTS } from "@/constants/subscription";
import { captureException, captureMessage } from "@/lib/sentry";

interface RevenueCatContextState {
  isPremium: boolean;
  customerInfo: CustomerInfo | null;
  isConfigured: boolean;
  /**
   * Whether `isPremium` reflects an answer RevenueCat actually gave.
   *
   * `isConfigured` only means "we stopped waiting" - it is also set after the
   * retry fails, and after a build with no API key skips configuration
   * entirely. In both of those cases `isPremium` is false because we don't
   * know, not because the user isn't subscribed.
   *
   * Anything that *revokes* access on `!isPremium` (the exercise-route gate)
   * must check this first, or a paying user whose cold start hit a network
   * error gets bounced to the paywall. Anything that merely *offers* an
   * upgrade can read `isPremium` directly - showing an upsell to a subscriber
   * for one render is a far cheaper mistake than locking one out.
   */
  isEntitlementKnown: boolean;
}

const RevenueCatContext = createContext<RevenueCatContextState>({
  isPremium: false,
  customerInfo: null,
  isConfigured: false,
  isEntitlementKnown: false,
});

export const useRevenueCat = () => useContext(RevenueCatContext);

/**
 * The platform's RevenueCat key, resolved once from build-time env vars.
 * Empty means purchases are not available on this build at all - see the
 * `isConfigured` initialiser below for why that is treated as "settled"
 * rather than "still loading".
 */
const PLATFORM_API_KEY =
  Platform.OS === 'ios'
    ? SUBSCRIPTION_CONSTANTS.REVENUECAT_API_KEY_IOS
    : SUBSCRIPTION_CONSTANTS.REVENUECAT_API_KEY_ANDROID;

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  // With no key there is nothing to wait for: configure() would reject every
  // later call and leave this stuck at false, which spins the paywall/exercise
  // gates forever. Start settled and fail open to the free tier instead.
  const [isConfigured, setIsConfigured] = useState(!PLATFORM_API_KEY);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    const apiKey = PLATFORM_API_KEY;

    if (!apiKey) {
      // A production build reaching this branch is a release-configuration
      // mistake (missing EXPO_PUBLIC_RC_*_KEY), not a user-facing error.
      captureMessage('RevenueCat API key missing for platform; purchases disabled', {
        platform: Platform.OS,
      });
      return;
    }

    Purchases.setLogLevel(__DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.WARN);
    Purchases.configure({ apiKey });

    const customerInfoUpdateListener = (info: CustomerInfo) => {
      setCustomerInfo(info);
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdateListener);

    let retryTimeout: ReturnType<typeof setTimeout> | undefined;

    // Fetch initial customer info and set isConfigured asynchronously.
    // A transient network hiccup on cold start must not strand isPremium at
    // false for the whole session, so failures get one retry before giving up.
    const fetchCustomerInfo = (isRetry: boolean) => {
      Purchases.getCustomerInfo()
        .then((info) => {
          setCustomerInfo(info);
          setIsConfigured(true);
        })
        .catch((error) => {
          if (isRetry) {
            captureException(error, { context: 'RevenueCatProvider.getCustomerInfo' });
            setIsConfigured(true);
          } else {
            retryTimeout = setTimeout(() => fetchCustomerInfo(true), 2000);
          }
        });
    };

    fetchCustomerInfo(false);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdateListener);
      clearTimeout(retryTimeout);
    };
  }, []);

  const isPremium = customerInfo?.entitlements.active[SUBSCRIPTION_CONSTANTS.ENTITLEMENT_ID] !== undefined;
  // A CustomerInfo in hand is the only proof we have either way; the SDK
  // serves a cached one offline, so this stays true across a dropped
  // connection once the first fetch has succeeded.
  const isEntitlementKnown = customerInfo !== null;

  return (
    <RevenueCatContext.Provider value={{ isPremium, customerInfo, isConfigured, isEntitlementKnown }}>
      {children}
    </RevenueCatContext.Provider>
  );
}

