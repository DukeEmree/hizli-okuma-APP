import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, H2, H4, Text, Button, Card } from 'tamagui';
import { Check, Lock, ChevronLeft } from 'lucide-react-native';
import { useRouter, Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useDailyPlan } from '@/features/dailyPlan/useDailyPlan';
import { exerciseRegistry } from '@/features/exercises/registry';

const ESTIMATED_MINUTES_PER_EXERCISE = 3;

export function DailyPlanListScreen() {
  const router = useRouter();
  const { t } = useTranslation('dailyPlan');
  const { t: tCommon } = useTranslation('common');
  const { t: tExercises } = useTranslation('exercises');
  const { isPremium } = useRevenueCat();

  const { exerciseTypes, completedTypes, isAllDone, firstPendingType, setActiveFlowType } = useDailyPlan();

  const handlePress = (type: string, isDone: boolean) => {
    const isUnlocked = isPremium || isDone || type === firstPendingType;
    if (!isUnlocked) {
      router.push('/paywall');
      return;
    }
    const definition = exerciseRegistry.getByType(type);
    setActiveFlowType(type);
    router.push(`/exercise/${definition ? definition.id : type}` as Href);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top', 'bottom']}>
      <YStack flex={1} backgroundColor="$background" padding="$4" gap="$5">
        <Button
          size="$3"
          circular
          chromeless
          alignSelf="flex-start"
          icon={<ChevronLeft size={22} />}
          onPress={() => router.back()}
          accessibilityLabel={tCommon('back')}
        />

        <YStack>
          <H2>{isAllDone ? t('card.completedTitle') : t('card.title')}</H2>
          {!isAllDone && (
            <Text color="$color11" fontSize="$3">
              {t('card.subtitle', {
                count: exerciseTypes.length,
                minutes: exerciseTypes.length * ESTIMATED_MINUTES_PER_EXERCISE,
              })}
            </Text>
          )}
        </YStack>

        <YStack gap="$3">
          {exerciseTypes.map((type) => {
            const definition = exerciseRegistry.getByType(type);
            const isDone = completedTypes.includes(type);
            const isUnlocked = isPremium || isDone || type === firstPendingType;

            return (
              <Card
                key={type}
                padding="$4"
                borderWidth={1}
                borderColor="$borderColor"
                backgroundColor="$backgroundHover"
                elevation={1}
                opacity={isUnlocked ? 1 : 0.6}
                onPress={() => handlePress(type, isDone)}
                pressStyle={{ scale: 0.98 }}
              >
                <XStack alignItems="center" gap="$3">
                  <YStack
                    width={24}
                    height={24}
                    borderRadius={12}
                    borderWidth={1}
                    borderColor={isDone ? '$green8' : '$borderColor'}
                    backgroundColor={isDone ? '$green8' : 'transparent'}
                    alignItems="center"
                    justifyContent="center"
                  >
                    {isDone && <Check size={14} color="white" />}
                  </YStack>
                  <YStack flex={1}>
                    <H4
                      textDecorationLine={isDone ? 'line-through' : 'none'}
                      color={isDone ? '$color11' : '$color'}
                    >
                      {definition ? tExercises(definition.nameKey, type) : type}
                    </H4>
                  </YStack>
                  {!isUnlocked && <Lock size={18} color="$color11" />}
                </XStack>
              </Card>
            );
          })}
        </YStack>

        {isAllDone && (
          <Button size="$5" theme="accent" fontWeight="bold" onPress={() => router.push('/(app)/daily-plan-complete')}>
            {t('card.viewSummary')}
          </Button>
        )}
      </YStack>
    </SafeAreaView>
  );
}
