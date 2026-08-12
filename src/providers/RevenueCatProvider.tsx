import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo } from 'react-native-purchases';
import { useAuth } from '@clerk/clerk-expo';
import { SUBSCRIPTION_CONSTANTS } from "@/constants/subscription";
import { captureException } from "@/lib/sentry";

interface RevenueCatContextState {
  isPremium: boolean;
  customerInfo: CustomerInfo | null;
  isConfigured: boolean;
}

const RevenueCatContext = createContext<RevenueCatContextState>({
  isPremium: false,
  customerInfo: null,
  isConfigured: false,
});

export const useRevenueCat = () => useContext(RevenueCatContext);

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [isConfigured, setIsConfigured] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    // Configure RevenueCat on mount
    const apiKey = Platform.OS === 'ios' ? SUBSCRIPTION_CONSTANTS.REVENUECAT_API_KEY_IOS : SUBSCRIPTION_CONSTANTS.REVENUECAT_API_KEY_ANDROID;
    
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

  useEffect(() => {
    if (isConfigured && isLoaded) {
      // Guards against an older logIn/logOut call resolving after a newer
      // one (e.g. rapid account switch): only the latest run is allowed to
      // apply its result, otherwise a slower call for the previous user can
      // overwrite the next user's customerInfo with the wrong entitlements.
      let isCurrent = true;
      let retryTimeout: ReturnType<typeof setTimeout> | undefined;

      const syncUser = async (isRetry: boolean) => {
        try {
          if (isSignedIn && userId) {
            // Identify user in RevenueCat with Clerk ID
            const { customerInfo: info } = await Purchases.logIn(userId);
            if (isCurrent) setCustomerInfo(info);
          } else {
            // Log out from RevenueCat if not anonymous
            const isAnonymous = await Purchases.isAnonymous();
            if (!isAnonymous) {
              await Purchases.logOut();
            }
            const info = await Purchases.getCustomerInfo();
            if (isCurrent) setCustomerInfo(info);
          }
        } catch (error) {
          if (isRetry) {
            captureException(error, { context: 'RevenueCatProvider.syncUser', isSignedIn, userId });
          } else if (isCurrent) {
            retryTimeout = setTimeout(() => syncUser(true), 2000);
          }
        }
      };

      syncUser(false);

      return () => {
        isCurrent = false;
        clearTimeout(retryTimeout);
      };
    }
  }, [isConfigured, isLoaded, isSignedIn, userId]);

  const isPremium = customerInfo?.entitlements.active[SUBSCRIPTION_CONSTANTS.ENTITLEMENT_ID] !== undefined;

  return (
    <RevenueCatContext.Provider value={{ isPremium, customerInfo, isConfigured }}>
      {children}
    </RevenueCatContext.Provider>
  );
}

