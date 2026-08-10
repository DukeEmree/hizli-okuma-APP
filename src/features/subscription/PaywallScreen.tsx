import React, { useEffect } from 'react';
import { View } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { analytics } from "@/lib/analytics";
import { AuthPromptSheet } from "@/components/auth/AuthPromptSheet";
import { useTheme } from 'tamagui';

export default function PaywallScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const theme = useTheme();
  
  useEffect(() => {
    analytics.track('paywall_viewed');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background?.val || '#fff' }}>
      {isSignedIn ? (
        <RevenueCatUI.Paywall
          onPurchaseCompleted={({ customerInfo }) => {
            if (typeof customerInfo.entitlements.active['premium'] !== 'undefined') {
              analytics.track('subscription_started');
              router.back();
            }
          }}
          onRestoreCompleted={({ customerInfo }) => {
             if (typeof customerInfo.entitlements.active['premium'] !== 'undefined') {
                router.back();
             }
          }}
          onDismiss={() => {
            router.back();
          }}
        />
      ) : (
        isLoaded && !isSignedIn && (
          <AuthPromptSheet 
            open={true} 
            onOpenChange={(isOpen) => {
              // If user closes the sheet without signing in, go back
              if (!isOpen && !isSignedIn) {
                router.back();
              }
            }} 
            title={t('paywall.auth_required_title', 'Premium İçin Giriş Yapın')}
            description={t('paywall.auth_required_desc', 'Premium özellikler hesabınıza tanımlanır ve cihazlarınız arasında senkronize edilir.')}
          />
        )
      )}
    </View>
  );
}
