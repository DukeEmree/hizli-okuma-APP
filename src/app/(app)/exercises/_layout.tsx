import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'tamagui';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';

export default function ExercisesLayout() {
  // Every route in this group is a timed exercise the user watches without
  // touching the screen - RSVP and Pacer present words for minutes with zero
  // input. On default display-timeout settings the screen dims, locks, and
  // backgrounds the app, which trips the engine's auto-pause and costs the
  // user their run. Held here rather than in each of the 15 runner screens:
  // this layout is the single gate every one of them already passes through,
  // and the hook releases the lock on unmount, so leaving the group by any
  // route - exit button, Back gesture, completion - restores normal timeout.
  useKeepAwake();

  const theme = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const currentType = segments[segments.length - 1];
  const { isPremium, isConfigured, isEntitlementKnown } = useRevenueCat();
  const activeFlowType = useDailyPlanStore((s) => s.activeFlowType);

  // Free users may only enter an exercise engine route as the step they
  // just launched from the daily-plan list (activeFlowType is set right
  // before that navigation); premium always passes. [exerciseId].tsx
  // already gates its own "Başla" button the same way, but that only
  // protects users who go through that screen - a direct deep link into
  // /(app)/exercises/<type> skips it entirely. Gating here too closes that
  // bypass for every route under this group in one place.
  //
  // `isEntitlementKnown` is required before *revoking* access: without it, a
  // subscriber whose cold-start entitlement fetch failed (both attempts) has
  // isPremium === false and would be thrown out of an exercise they paid
  // for. Letting an unverified user through is the cheaper error - premium
  // is client-side either way, since there is no backend to ask.
  const isAllowed = isPremium || !isEntitlementKnown || activeFlowType === currentType;

  useEffect(() => {
    if (isConfigured && !isAllowed) {
      router.replace('/paywall');
    }
  }, [isConfigured, isAllowed, router]);

  // Leaving this step before it's marked done (exit button, back gesture,
  // or any other navigation away) must release the flow lock - otherwise
  // it stays set to `currentType` until the app restarts (it's in-memory
  // only), letting a free user re-enter this one exercise indefinitely
  // from the Egzersizler tab, which only reads `activeFlowType` and never
  // sets it. A normal completion already clears it itself before
  // navigating away, so this is a no-op on that path.
  useEffect(() => {
    return () => {
      const store = useDailyPlanStore.getState();
      if (store.activeFlowType === currentType) {
        store.setActiveFlowType(null);
      }
    };
  }, [currentType]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val as string }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />
    </SafeAreaView>
  );
}
