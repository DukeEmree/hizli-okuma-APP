import { useEffect, useRef } from 'react';
import { Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';
import { useStreakCacheStore, STREAK_MILESTONES } from '@/stores/streakCacheStore';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { usePaywallPromptStore } from '@/stores/paywallPromptStore';
import { shouldShowInterstitialPaywall } from '@/utils/paywall';

const STREAK_MILESTONE_TRIGGER = 'streak_milestone';

interface ExerciseCompletionActionsProps {
  /** `ExerciseDefinition.type` of the exercise that was just completed. */
  exerciseType: string;
  /** Fallback action when this completion isn't part of today's plan. */
  onFinish: () => void;
}

/**
 * Streak values only equal a milestone on the single day they're reached
 * (the next session either keeps the same calendar day, which doesn't
 * change `currentStreak`, or moves to the next day, which increments past
 * it), so this alone is enough to catch "just reached" without extra state.
 */
function useStreakMilestonePaywallTrigger() {
  const router = useRouter();
  const currentStreak = useStreakCacheStore((s) => s.currentStreak);
  const { isPremium } = useRevenueCat();
  const promptedRef = useRef(false);

  useEffect(() => {
    if (promptedRef.current || isPremium || !STREAK_MILESTONES.includes(currentStreak)) return;
    const { lastShownAt, markShown } = usePaywallPromptStore.getState();
    const now = Date.now();
    if (!shouldShowInterstitialPaywall({ lastShownAt, lastTrigger: null }, isPremium, now)) return;

    promptedRef.current = true;
    markShown(STREAK_MILESTONE_TRIGGER, now);
    router.push({ pathname: '/paywall', params: { trigger: STREAK_MILESTONE_TRIGGER } });
  }, [isPremium, currentStreak, router]);
}

/**
 * Renders the primary action on an exercise's completion screen. Plain
 * "Bitir" unless `exerciseType` is the step of today's daily plan that's
 * actively being run through the flow (launched from the daily-plan list),
 * in which case it returns to that list instead - the list screen is what
 * decides whether to show the next step or the plan-complete CTA, so this
 * component doesn't duplicate that logic. A standalone completion of the
 * same exercise type from the Egzersizler tab still marks the daily step
 * done but never matches here, since `activeFlowType` is only set by the
 * daily-plan flow itself.
 *
 * Marks the step done itself, on mount, rather than relying on each
 * exercise route to call `markStepCompleted` before rendering this
 * component - several routes only called it from their own "Bitir" handler
 * (i.e. `onFinish` below), which meant the plain "Bitir" button briefly
 * showed and only turned into "Listeye dön" *after* being pressed once.
 * `markStepCompleted` is idempotent, so routes that already call it earlier
 * (e.g. to decide their own non-plan follow-up) are unaffected.
 */
export function ExerciseCompletionActions({ exerciseType, onFinish }: ExerciseCompletionActionsProps) {
  const router = useRouter();
  useStreakMilestonePaywallTrigger();
  const { t } = useTranslation('dailyPlan');
  const exerciseTypes = useDailyPlanStore((s) => s.exerciseTypes);
  const completedTypes = useDailyPlanStore((s) => s.completedTypes);
  const activeFlowType = useDailyPlanStore((s) => s.activeFlowType);
  const setActiveFlowType = useDailyPlanStore((s) => s.setActiveFlowType);
  const markStepCompleted = useDailyPlanStore((s) => s.markStepCompleted);

  useEffect(() => {
    markStepCompleted(exerciseType);
  }, [exerciseType, markStepCompleted]);

  const isPlanStep =
    activeFlowType === exerciseType &&
    exerciseTypes.includes(exerciseType) &&
    completedTypes.includes(exerciseType);

  if (isPlanStep) {
    return (
      <Button
        size="$5"
        theme="accent"
        onPress={() => {
          setActiveFlowType(null);
          router.replace('/(app)/daily-plan');
        }}
      >
        {t('actions.backToList')}
      </Button>
    );
  }

  return (
    <Button size="$5" theme="accent" onPress={onFinish}>
      {t('done', { ns: 'common', defaultValue: 'Bitir' })}
    </Button>
  );
}
