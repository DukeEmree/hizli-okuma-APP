import { useEffect, useMemo, useState } from 'react';
import { Card, H4, Text, YStack, XStack, Button } from 'tamagui';
import { Check } from 'lucide-react-native';
import { useRouter, Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';
import { selectDailyPlan, ExercisePerformance } from '@/utils/dailyPlan';
import { getLocalDateString } from '@/utils/streak';
import { buildLocalStats } from '@/utils/localStatistics';
import { exerciseRegistry } from '@/features/exercises/registry';

const ESTIMATED_MINUTES_PER_EXERCISE = 3;

export function DailyPlanCard() {
  const router = useRouter();
  const { t } = useTranslation('dailyPlan');
  const { t: tExercises } = useTranslation('exercises');

  const localSessions = useLocalHistoryStore((s) => s.sessions);
  const exerciseTypes = useDailyPlanStore((s) => s.exerciseTypes);
  const completedTypes = useDailyPlanStore((s) => s.completedTypes);
  const lastPlanTypes = useDailyPlanStore((s) => s.lastPlanTypes);
  const ensureTodayPlan = useDailyPlanStore((s) => s.ensureTodayPlan);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  // eslint-disable-next-line react-hooks/purity
  const [now] = useState(() => Date.now());
  const today = getLocalDateString(now, timeZone);

  const performanceByType = useMemo(() => {
    const exerciseStats = buildLocalStats(localSessions, '30d', now, timeZone).exerciseStats;

    const map: Record<string, ExercisePerformance> = {};
    for (const entry of exerciseStats) {
      map[entry.type] = { averageScore: entry.averageScore, attemptCount: entry.attemptCount };
    }
    return map;
  }, [localSessions, timeZone, now]);

  useEffect(() => {
    ensureTodayPlan(today, () => selectDailyPlan({ dateSeed: today, performanceByType, lastPlanTypes }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  if (exerciseTypes.length === 0) return null;

  const completedCount = completedTypes.length;
  const isAllDone = completedCount >= exerciseTypes.length;
  const firstPendingType = exerciseTypes.find((type) => !completedTypes.includes(type));

  const handlePress = () => {
    if (firstPendingType) {
      router.push(`/(app)/exercises/${firstPendingType}` as Href);
    }
  };

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
