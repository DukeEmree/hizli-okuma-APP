import { H4, Text, YStack, XStack, Button, useTheme } from 'tamagui';
import { Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useDailyPlan } from '@/features/dailyPlan/useDailyPlan';
import { exerciseRegistry } from '@/features/exercises/registry';
import { AppCard } from '@/components/ui/AppCard';

export function DailyPlanCard() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation('dailyPlan');
  const { t: tExercises } = useTranslation('exercises');

  const { exerciseTypes, completedIndices, isAllDone, estimatedMinutes, todayMinutes } = useDailyPlan();

  if (exerciseTypes.length === 0) return null;

  const completedCount = completedIndices.length;

  // Navigates to the daily-plan list screen rather than straight into an
  // exercise - the list is where sequencing/locking and the info-screen
  // hop for the tapped step are handled.
  const handlePress = () => router.push('/(app)/daily-plan');
  const handleSummaryPress = () => router.push('/(app)/daily-plan-complete');

  const steps = (
    <YStack gap="$2">
      {exerciseTypes.map((type, index) => {
        const definition = exerciseRegistry.getByType(type);
        const isDone = completedIndices.includes(index);
        const name = definition ? tExercises(definition.nameKey, type) : type;
        return (
          <XStack
            key={`${type}-${index}`}
            alignItems="center"
            gap="$2"
            accessible
            accessibilityLabel={t(isDone ? 'card.stepDone' : 'card.stepPending', { name })}
          >
            <YStack
              width={20}
              height={20}
              flexShrink={0}
              borderRadius={10}
              borderWidth={1}
              borderColor={isDone ? '$green9' : '$borderColor'}
              backgroundColor={isDone ? '$green9' : '$background'}
              alignItems="center"
              justifyContent="center"
            >
              {isDone && <Check size={12} color={theme.green1?.val as string} />}
            </YStack>
            <Text
              flex={1}
              textDecorationLine={isDone ? 'line-through' : 'none'}
              color={isDone ? '$color11' : '$color'}
            >
              {name}
            </Text>
          </XStack>
        );
      })}
    </YStack>
  );

  // Finishing the plan is the day's peak, so the card grows into a summary
  // instead of quietly losing its button - the old "all done" state was
  // strictly smaller than the unfinished one.
  if (isAllDone) {
    return (
      <AppCard
        lift="raised"
        onPress={handleSummaryPress}
        pressStyle={{ scale: 0.99 }}
        accessibilityRole="button"
        accessibilityLabel={`${t('card.completedTitle')} ${t('card.viewSummary')}`}
      >
        <YStack gap="$3">
          <YStack>
            <H4>{t('card.completedTitle')}</H4>
            <Text color="$color11" fontSize="$2">
              {t('card.completedSummary', { minutes: todayMinutes, count: exerciseTypes.length })}
            </Text>
          </YStack>
          {steps}
          <Text color="$green11" fontSize="$3" fontWeight="bold">
            {t('card.viewSummary')}
          </Text>
        </YStack>
      </AppCard>
    );
  }

  // `raised` because this is the home screen's primary action - the one card
  // the user should touch next.
  return (
    <AppCard lift="raised">
      <YStack gap="$3">
        <YStack>
          <H4>{t('card.title')}</H4>
          <Text color="$color11" fontSize="$2">
            {t('card.subtitle', { count: exerciseTypes.length, minutes: estimatedMinutes })}
          </Text>
        </YStack>

        {steps}

        <Button
          size="$5"
          theme="accent"
          fontWeight="bold"
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={completedCount === 0 ? t('card.start') : t('card.continue')}
        >
          {completedCount === 0 ? t('card.start') : t('card.continue')}
        </Button>

      </YStack>
    </AppCard>
  );
}
