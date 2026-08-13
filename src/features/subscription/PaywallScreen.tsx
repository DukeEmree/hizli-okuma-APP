import React, { useEffect } from 'react';
import { View } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { analytics } from "@/lib/analytics";
import { useTheme } from 'tamagui';
import { SUBSCRIPTION_CONSTANTS } from '@/constants/subscription';

export default function PaywallScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { trigger } = useLocalSearchParams<{ trigger?: string }>();

  useEffect(() => {
    analytics.track('paywall_viewed', trigger ? { trigger } : undefined);
  }, [trigger]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background?.val }}>
      <RevenueCatUI.Paywall
        onPurchaseCompleted={({ customerInfo }) => {
          if (typeof customerInfo.entitlements.active[SUBSCRIPTION_CONSTANTS.ENTITLEMENT_ID] !== 'undefined') {
            analytics.track('subscription_started');
            router.back();
          }
        }}
        onRestoreCompleted={({ customerInfo }) => {
          if (typeof customerInfo.entitlements.active[SUBSCRIPTION_CONSTANTS.ENTITLEMENT_ID] !== 'undefined') {
            analytics.track('subscription_restored');
            router.back();
          }
        }}
        onDismiss={() => {
          router.back();
        }}
      />
    </View>
  );
}
