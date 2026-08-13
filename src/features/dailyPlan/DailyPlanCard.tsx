import { Card, H4, Text, YStack, XStack, Button } from 'tamagui';
import { Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useDailyPlan } from '@/features/dailyPlan/useDailyPlan';
import { exerciseRegistry } from '@/features/exercises/registry';

const ESTIMATED_MINUTES_PER_EXERCISE = 3;

export function DailyPlanCard() {
  const router = useRouter();
  const { t } = useTranslation('dailyPlan');
  const { t: tExercises } = useTranslation('exercises');

  const { exerciseTypes, completedTypes, isAllDone } = useDailyPlan();

  if (exerciseTypes.length === 0) return null;

  const completedCount = completedTypes.length;

  // Navigates to the daily-plan list screen rather than straight into an
  // exercise - the list is where sequencing/locking and the info-screen
  // hop for the tapped step are handled.
  const handlePress = () => router.push('/(app)/daily-plan');

  return (
    <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover" elevation="$1">
      <YStack gap="$3">
        <YStack>
          <H4>{isAllDone ? t('card.completedTitle') : t('card.title')}</H4>
          {!isAllDone && (
            <Text color="$color11" fontSize="$2">
              {t('card.subtitle', {
                count: exerciseTypes.length,
                minutes: exerciseTypes.length * ESTIMATED_MINUTES_PER_EXERCISE,
              })}
            </Text>
          )}
        </YStack>

        <YStack gap="$2">
          {exerciseTypes.map((type) => {
            const definition = exerciseRegistry.getByType(type);
            const isDone = completedTypes.includes(type);
            return (
              <XStack key={type} alignItems="center" gap="$2">
                <YStack
                  width={20}
                  height={20}
                  borderRadius={10}
                  borderWidth={1}
                  borderColor={isDone ? '$green8' : '$borderColor'}
                  backgroundColor={isDone ? '$green8' : 'transparent'}
                  alignItems="center"
                  justifyContent="center"
                >
                  {isDone && <Check size={12} color="white" />}
                </YStack>
                <Text
                  textDecorationLine={isDone ? 'line-through' : 'none'}
                  color={isDone ? '$color11' : '$color'}
                >
                  {definition ? tExercises(definition.nameKey, type) : type}
                </Text>
              </XStack>
            );
          })}
        </YStack>

        {!isAllDone && (
          <Button size="$5" theme="accent" fontWeight="bold" onPress={handlePress}>
            {completedCount === 0 ? t('card.start') : t('card.continue')}
          </Button>
        )}
      </YStack>
    </Card>
  );
}
