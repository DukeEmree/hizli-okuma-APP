import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, H2, H4, Text, Button, ScrollView, useTheme } from 'tamagui';

import { Check, Lock, ChevronLeft } from 'lucide-react-native';
import { useRouter, Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useDailyPlan } from '@/features/dailyPlan/useDailyPlan';
import { exerciseRegistry } from '@/features/exercises/registry';
import { analytics } from '@/lib/analytics';
import { AppCard } from '@/components/ui/AppCard';
import { contentColumn } from '@/constants/layout';

export function DailyPlanListScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation('dailyPlan');
  const { t: tCommon } = useTranslation('common');
  const { t: tExercises } = useTranslation('exercises');
  const { isPremium } = useRevenueCat();

  const { exerciseTypes, completedIndices, isAllDone, firstPendingIndex, estimatedMinutes, setActiveFlowType } =
    useDailyPlan();

  const handlePress = (type: string, index: number) => {
    const isUnlocked = isPremium || completedIndices.includes(index) || index === firstPendingIndex;
    if (!isUnlocked) {
      router.push('/paywall');
      return;
    }
    // Only the first step of the day opens the funnel; later steps are
    // continuations, and firing on each would make the plan look four times
    // more popular than it is.
    if (completedIndices.length === 0) {
      analytics.track('daily_plan_started', { stepCount: exerciseTypes.length });
    }

    const definition = exerciseRegistry.getByType(type);
    setActiveFlowType(type);
    router.push(`/exercise/${definition ? definition.id : type}` as Href);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top', 'bottom']}>
      <ScrollView flex={1} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <YStack flex={1} backgroundColor="$background" padding="$4" gap="$5" {...contentColumn}>
          <Button
            size="$4.5"
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
                  minutes: estimatedMinutes,
                })}
              </Text>
            )}
          </YStack>

          <YStack gap="$3">
            {exerciseTypes.map((type, index) => {
              const definition = exerciseRegistry.getByType(type);
              const isDone = completedIndices.includes(index);
              const isUnlocked = isPremium || isDone || index === firstPendingIndex;

              return (
                <AppCard
                  key={`${type}-${index}`}
                  opacity={isUnlocked ? 1 : 0.6}
                  onPress={() => handlePress(type, index)}
                  pressStyle={{ scale: 0.98 }}
                >
                  <XStack alignItems="center" gap="$3">
                    <YStack
                      width={24}
                      height={24}
                      borderRadius={12}
                      borderWidth={1}
                      borderColor={isDone ? '$green9' : '$borderColor'}
                      backgroundColor={isDone ? '$green9' : '$background'}
                      alignItems="center"
                      justifyContent="center"
                    >
                      {isDone && <Check size={14} color={theme.green1?.val as string} />}
                    </YStack>
                    <YStack flex={1}>
                      <H4
                        textDecorationLine={isDone ? 'line-through' : 'none'}
                        color={isDone ? '$color11' : '$color'}
                      >
                        {definition ? tExercises(definition.nameKey, type) : type}
                      </H4>
                    </YStack>
                    {!isUnlocked && <Lock size={18} color={theme.color11?.val as string} />}
                  </XStack>
                </AppCard>
              );
            })}
          </YStack>

          {isAllDone && (
            <Button size="$5" theme="accent" fontWeight="bold" onPress={() => router.push('/(app)/daily-plan-complete')}>
              {t('card.viewSummary')}
            </Button>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

