import { Button } from 'tamagui';
import { useRouter, Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';
import { exerciseRegistry } from '@/features/exercises/registry';

interface ExerciseCompletionActionsProps {
  /** `ExerciseDefinition.type` of the exercise that was just completed. */
  exerciseType: string;
  /** Fallback action when this completion isn't part of today's plan. */
  onFinish: () => void;
}

/**
 * Renders the primary action on an exercise's completion screen. Plain
 * "Bitir" unless `exerciseType` is the step of today's daily plan that's
 * actively being run through the chained flow (launched from
 * DailyPlanCard), in which case it chains to the next pending step (or the
 * plan-complete screen once every step is done) instead - the single place
 * this decision is made, reused across all exercise screens rather than
 * duplicated per screen. A standalone completion of the same exercise type
 * from the Egzersizler tab still marks the daily step done (via
 * `markStepCompleted` in each route's `onComplete`) but never matches here,
 * since `activeFlowType` is only set by the daily-plan flow itself.
 */
export function ExerciseCompletionActions({ exerciseType, onFinish }: ExerciseCompletionActionsProps) {
  const router = useRouter();
  const { t } = useTranslation('dailyPlan');
  const { t: tExercises } = useTranslation('exercises');
  const exerciseTypes = useDailyPlanStore((s) => s.exerciseTypes);
  const completedTypes = useDailyPlanStore((s) => s.completedTypes);
  const activeFlowType = useDailyPlanStore((s) => s.activeFlowType);
  const setActiveFlowType = useDailyPlanStore((s) => s.setActiveFlowType);

  const isPlanStep =
    activeFlowType === exerciseType &&
    exerciseTypes.includes(exerciseType) &&
    completedTypes.includes(exerciseType);

  if (isPlanStep) {
    // Scan the whole plan in order, not just forward from this step's
    // index - this step may not be the last *index*, but it can still be
    // the last one *completed* if earlier steps were done out of order.
    const nextType = exerciseTypes.find((type) => !completedTypes.includes(type));

    if (nextType) {
      const nextDefinition = exerciseRegistry.getByType(nextType);
      const nextLabel = nextDefinition ? tExercises(nextDefinition.nameKey, nextType) : nextType;
      return (
        <Button
          size="$5"
          theme="accent"
          onPress={() => {
            setActiveFlowType(nextType);
            router.replace(`/(app)/exercises/${nextType}` as Href);
          }}
        >
          {t('actions.next')}: {nextLabel}
        </Button>
      );
    }

    return (
      <Button
        size="$5"
        theme="accent"
        onPress={() => {
          setActiveFlowType(null);
          router.replace('/(app)/daily-plan-complete');
        }}
      >
        {t('actions.finishPlan')}
      </Button>
    );
  }

  return (
    <Button size="$5" theme="accent" onPress={onFinish}>
      {t('done', { ns: 'common', defaultValue: 'Bitir' })}
    </Button>
  );
}
