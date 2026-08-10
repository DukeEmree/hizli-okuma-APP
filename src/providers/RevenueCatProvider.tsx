import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo } from 'react-native-purchases';
import { useAuth } from '@clerk/clerk-expo';
import { SUBSCRIPTION_CONSTANTS } from "@/constants/subscription";

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
    
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey });

    const customerInfoUpdateListener = (info: CustomerInfo) => {
      setCustomerInfo(info);
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdateListener);

    // Fetch initial customer info and set isConfigured asynchronously
    Purchases.getCustomerInfo()
      .then((info) => {
        setCustomerInfo(info);
        setIsConfigured(true);
      })
      .catch(() => {
        setIsConfigured(true);
      });

    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdateListener);
    };
  }, []);

  useEffect(() => {
    if (isConfigured && isLoaded) {
      const syncUser = async () => {
        try {
          if (isSignedIn && userId) {
            // Identify user in RevenueCat with Clerk ID
            const { customerInfo: info } = await Purchases.logIn(userId);
            setCustomerInfo(info);
          } else {
            // Log out from RevenueCat if not anonymous
            const isAnonymous = await Purchases.isAnonymous();
            if (!isAnonymous) {
              await Purchases.logOut();
            }
            const info = await Purchases.getCustomerInfo();
            setCustomerInfo(info);
          }
        } catch (error) {
          console.error('Failed to sync RevenueCat user', error);
        }
      };

      syncUser();
    }
  }, [isConfigured, isLoaded, isSignedIn, userId]);

  const isPremium = customerInfo?.entitlements.active[SUBSCRIPTION_CONSTANTS.ENTITLEMENT_ID] !== undefined;

  return (
    <RevenueCatContext.Provider value={{ isPremium, customerInfo, isConfigured }}>
      {children}
    </RevenueCatContext.Provider>
  );
}

