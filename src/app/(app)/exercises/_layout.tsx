import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'tamagui';
import { useExerciseLimits } from '@/hooks/useExerciseLimits';

export default function ExercisesLayout() {
  const theme = useTheme();
  const router = useRouter();
  // [exerciseId].tsx already gates its own "Başla" button on this, but that
  // only protects users who go through that screen - a direct deep link
  // into /(app)/exercises/<type> skips it entirely. Gating here too closes
  // that bypass for every route under this group in one place.
  const { canStartExercise, isLoading } = useExerciseLimits();

  useEffect(() => {
    if (!isLoading && !canStartExercise) {
      router.replace('/paywall');
    }
  }, [isLoading, canStartExercise, router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val as string }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />
    </SafeAreaView>
  );
}
