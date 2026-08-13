import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'tamagui';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';

export default function ExercisesLayout() {
  const theme = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const currentType = segments[segments.length - 1];
  const { isPremium, isConfigured } = useRevenueCat();
  const activeFlowType = useDailyPlanStore((s) => s.activeFlowType);

  // Free users may only enter an exercise engine route as the step they
  // just launched from the daily-plan list (activeFlowType is set right
  // before that navigation); premium always passes. [exerciseId].tsx
  // already gates its own "Başla" button the same way, but that only
  // protects users who go through that screen - a direct deep link into
  // /(app)/exercises/<type> skips it entirely. Gating here too closes that
  // bypass for every route under this group in one place.
  const isAllowed = isPremium || activeFlowType === currentType;

  useEffect(() => {
    if (isConfigured && !isAllowed) {
      router.replace('/paywall');
    }
  }, [isConfigured, isAllowed, router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val as string }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />
    </SafeAreaView>
  );
}
