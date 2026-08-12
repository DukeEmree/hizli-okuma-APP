import { useMemo } from 'react';
import { YStack, Text, H2, Button, Card } from 'tamagui';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useStreakCacheStore } from '@/stores/streakCacheStore';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { XP_SOURCES } from '@/constants/gamification';

export function DailyPlanCompleteScreen() {
  const router = useRouter();
  const { t } = useTranslation('dailyPlan');
  const { isPremium } = useRevenueCat();
  const currentStreak = useStreakCacheStore((s) => s.currentStreak);
  const exerciseTypes = useDailyPlanStore((s) => s.exerciseTypes);
  const localSessions = useLocalHistoryStore((s) => s.sessions);

  const todaysMinutes = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const durationMs = localSessions
      .filter((s) => s.completedAt >= todayStart.getTime() && exerciseTypes.includes(s.exerciseType))
      .reduce((sum, s) => sum + s.durationMs, 0);
    return Math.round(durationMs / 60000);
  }, [localSessions, exerciseTypes]);

  return (
    <YStack f={1} bg="$background" jc="center" ai="center" p="$4" gap="$4">
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
        <Card padding="$4" borderWidth={1} backgroundColor="$green3" borderColor="$green7" onPress={() => router.push('/paywall')}>
          <YStack gap="$2" ai="center">
            <Text color="$green11" textAlign="center">{t('complete.premiumTeaser')}</Text>
            <Button size="$3" theme="green" onPress={() => router.push('/paywall')}>
              {t('complete.premiumTeaserCta')}
            </Button>
          </YStack>
        </Card>
      )}

      <Button size="$5" theme="accent" onPress={() => router.replace('/(app)/(tabs)')}>
        {t('complete.backHome')}
      </Button>
    </YStack>
  );
}
