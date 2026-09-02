import { useEffect, useMemo, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, Text, H2, Button, ScrollView } from 'tamagui';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useStreakCacheStore } from '@/stores/streakCacheStore';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { usePaywallPromptStore } from '@/stores/paywallPromptStore';
import { INTERSTITIAL_DELAY_MS, shouldShowInterstitialPaywall } from '@/utils/paywall';
import { useManagedTimeout } from '@/hooks/useManagedTimeout';
import { XP_SOURCES } from '@/constants/gamification';
import { analytics } from '@/lib/analytics';
import { AppCard } from '@/components/ui/AppCard';
import { contentColumn } from '@/constants/layout';


const DAILY_PLAN_COMPLETE_TRIGGER = 'daily_plan_complete';

export function DailyPlanCompleteScreen() {
  const router = useRouter();
  const { t } = useTranslation('dailyPlan');
  const { isPremium } = useRevenueCat();
  const currentStreak = useStreakCacheStore((s) => s.currentStreak);
  const exerciseTypes = useDailyPlanStore((s) => s.exerciseTypes);
  const localSessions = useLocalHistoryStore((s) => s.sessions);
  const promptedRef = useRef(false);
  const trackedRef = useRef(false);
  // Set when the user opens the paywall themselves, so the queued prompt does
  // not then stack a second copy on top of the one they are already looking at.
  const supersededRef = useRef(false);
  const schedule = useManagedTimeout();

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    analytics.track('daily_plan_completed', { stepCount: exerciseTypes.length });
  }, [exerciseTypes.length]);

  useEffect(() => {
    if (promptedRef.current || isPremium) return;
    const { lastShownAt } = usePaywallPromptStore.getState();
    if (!shouldShowInterstitialPaywall({ lastShownAt, lastTrigger: null }, isPremium, Date.now())) return;

    // Claim the slot now so a re-render cannot queue a second timer, but leave
    // the store untouched until the paywall actually opens. `useManagedTimeout`
    // cancels on unmount, so leaving the celebration early - "Ana ekrana dön",
    // back gesture, anything - means no paywall and no spent silence window.
    promptedRef.current = true;
    schedule(() => {
      if (supersededRef.current) return;
      usePaywallPromptStore.getState().markShown(DAILY_PLAN_COMPLETE_TRIGGER, Date.now());
      router.push({ pathname: '/paywall', params: { trigger: DAILY_PLAN_COMPLETE_TRIGGER } });
    }, INTERSTITIAL_DELAY_MS);
  }, [isPremium, router, schedule]);

  const openPaywall = () => {
    supersededRef.current = true;
    router.push('/paywall');
  };

  const todaysMinutes = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const durationMs = localSessions
      .filter((s) => s.completedAt >= todayStart.getTime() && exerciseTypes.includes(s.exerciseType))
      .reduce((sum, s) => sum + s.durationMs, 0);
    return Math.round(durationMs / 60000);
  }, [localSessions, exerciseTypes]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top', 'bottom']}>
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}
      >
        <YStack w="100%" gap="$4" ai="center" {...contentColumn}>
          <H2 textAlign="center">{t('complete.title')}</H2>

          {isPremium ? (
            <YStack ai="center" gap="$1">
              <Text fontSize="$6" fontWeight="bold" color="$green10">
                {t('complete.premiumSummary', { xp: XP_SOURCES.DAILY_GOAL_COMPLETED })}
              </Text>
              {currentStreak > 0 && (
                <Text color="$color11">{t('complete.streakLabel', { days: currentStreak })}</Text>
              )}
            </YStack>
          ) : (
            <Text color="$color11" textAlign="center">
              {t('complete.freeSummary', { minutes: todaysMinutes, count: exerciseTypes.length })}
            </Text>
          )}

          {!isPremium && (
            <AppCard backgroundColor="$green3" borderColor="$green7" onPress={openPaywall}>
              <YStack gap="$2" ai="center">
                <Text color="$green11" textAlign="center">{t('complete.premiumTeaser')}</Text>
                <Button size="$4.5" theme="accent" onPress={openPaywall}>
                  {t('complete.premiumTeaserCta')}
                </Button>
              </YStack>
            </AppCard>
          )}

          <Button size="$5" theme="accent" onPress={() => router.replace('/(app)/(tabs)')}>
            {t('complete.backHome')}
          </Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

