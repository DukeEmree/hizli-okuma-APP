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
 * "Bitir" unless `exerciseType` is a step of today's daily plan, in which
 * case it chains to the next pending step (or the plan-complete screen on
 * the last one) instead - the single place this decision is made, reused
 * across all exercise screens rather than duplicated per screen.
 */
export function ExerciseCompletionActions({ exerciseType, onFinish }: ExerciseCompletionActionsProps) {
  const router = useRouter();
  const { t } = useTranslation('dailyPlan');
  const { t: tExercises } = useTranslation('exercises');
  const exerciseTypes = useDailyPlanStore((s) => s.exerciseTypes);
  const completedTypes = useDailyPlanStore((s) => s.completedTypes);

  const stepIndex = exerciseTypes.indexOf(exerciseType);
  const isPlanStep = stepIndex !== -1 && completedTypes.includes(exerciseType);

  if (isPlanStep) {
    const nextType = exerciseTypes.slice(stepIndex + 1).find((type) => !completedTypes.includes(type));

    if (nextType) {
      const nextDefinition = exerciseRegistry.getByType(nextType);
      const nextLabel = nextDefinition ? tExercises(nextDefinition.nameKey, nextType) : nextType;
      return (
        <Button size="$5" theme="accent" onPress={() => router.replace(`/(app)/exercises/${nextType}` as Href)}>
          {t('actions.next')}: {nextLabel}
        </Button>
      );
    }

    return (
      <Button size="$5" theme="accent" onPress={() => router.replace('/(app)/daily-plan-complete')}>
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
