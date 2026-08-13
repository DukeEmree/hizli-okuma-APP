import React from 'react';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, YStack, XStack, Card, H2, H4, Button, ScrollView } from 'tamagui';
import { useRouter } from 'expo-router';
import { StreakBadge } from "@/features/streak/StreakBadge";
import { useRevenueCat } from "@/providers/RevenueCatProvider";
import { useUserProgressStore } from '@/stores/userProgressStore';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { DailyPlanCard } from '@/features/dailyPlan/DailyPlanCard';
import { WeeklySummaryCard } from '@/features/weeklySummary/WeeklySummaryCard';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation('home');
  const { isPremium } = useRevenueCat();

  const bestWpm = useUserProgressStore(state => state.bestWpm);
  const bestComprehension = useUserProgressStore(state => state.bestComprehension);
  const localSessions = useLocalHistoryStore(state => state.sessions);

  let totalWpm = 0, wpmCount = 0;
  let totalComp = 0, compCount = 0;
  for (const s of localSessions) {
    if (s.metrics?.wpm) {
      totalWpm += s.metrics.wpm;
      wpmCount++;
    }
    if (s.metrics?.comprehensionAccuracy !== undefined) {
      totalComp += s.metrics.comprehensionAccuracy;
      compCount++;
    }
  }

  const totalTrainingMs = localSessions.reduce((sum, s) => sum + s.durationMs, 0);

  const data = {
    stats: {
      avgWpm: wpmCount > 0 ? Math.round(totalWpm / wpmCount) : (bestWpm || null),
      avgComp: compCount > 0
        ? Math.round((totalComp / compCount) * 100)
        : (bestComprehension ? Math.round(bestComprehension * 100) : null),
      totalDurationMs: totalTrainingMs
    },
    recentSessions: localSessions.slice().sort((a, b) => b.completedAt - a.completedAt).slice(0, 5).map(s => ({
      _id: s.clientSessionId,
      ...s
    }))
  };

  const { stats, recentSessions } = data;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <ScrollView flex={1} backgroundColor="$background">
        <YStack padding="$4" gap="$5">

          <XStack justifyContent="space-between" alignItems="center">
            <YStack flex={1}>
              <H2>{t('greeting')}</H2>
              <Text color="$color11">{t('greetingSubtitle')}</Text>
            </YStack>
            <StreakBadge />
          </XStack>

          <DailyPlanCard />

          <WeeklySummaryCard />

          <XStack gap="$3" justifyContent="space-between">
            <Card flex={1} padding="$3" borderWidth={1} borderColor="$borderColor" alignItems="center">
              <Text color="$color11" fontSize="$2" marginBottom="$1">{t('stats.avgWpm')}</Text>
              <Text fontSize="$7" fontWeight="bold">{stats.avgWpm || '-'} <Text fontSize="$2">{t('stats.wpmUnit')}</Text></Text>
            </Card>
            <Card flex={1} padding="$3" borderWidth={1} borderColor="$borderColor" alignItems="center">
              <Text color="$color11" fontSize="$2" marginBottom="$1">{t('stats.comprehension')}</Text>
              <Text fontSize="$7" fontWeight="bold">{stats.avgComp ? `${stats.avgComp}%` : '-'}</Text>
            </Card>
            <Card flex={1} padding="$3" borderWidth={1} borderColor="$borderColor" alignItems="center">
              <Text color="$color11" fontSize="$2" marginBottom="$1">{t('stats.trainingTime')}</Text>
              <Text fontSize="$7" fontWeight="bold">{Math.floor((stats.totalDurationMs || 0) / 60000)}<Text fontSize="$2"> {t('stats.minutesUnit')}</Text></Text>
            </Card>
          </XStack>

          {!isPremium && (
            <Card padding="$4" borderWidth={1} backgroundColor="$green3" borderColor="$green7" onPress={() => router.push('/paywall')}>
              <XStack justifyContent="space-between" alignItems="center">
                <YStack flex={1}>
                  <H4 color="$green11">{t('premiumCard.title')}</H4>
                  <Text color="$green11" fontSize="$2">{t('premiumCard.subtitle')}</Text>
                </YStack>
                <Button size="$3" theme="green" onPress={() => router.push('/paywall')}>{t('premiumCard.cta')}</Button>
              </XStack>
            </Card>
          )}

          <YStack gap="$3" marginTop="$2">
            <H4>{t('recentActivity.title')}</H4>
            {recentSessions.length === 0 ? (
              <Text color="$color11">{t('recentActivity.empty')}</Text>
            ) : (
              recentSessions.map((session) => {
                const dateObj = new Date(session.completedAt);
                return (
                  <Card key={session._id} padding="$3" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover">
                    <XStack justifyContent="space-between" alignItems="center">
                      <YStack>
                        <Text fontWeight="bold" textTransform="capitalize">{session.exerciseType}</Text>
                        <Text color="$color11" fontSize="$2">{dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                      </YStack>
                      <YStack alignItems="flex-end">
                        <Text fontWeight="bold" color="$green10">{t('recentActivity.score', { score: session.score })}</Text>
                        {session.metrics?.wpm && (
                          <Text fontSize="$2" color="$color11">{t('recentActivity.wpm', { wpm: session.metrics.wpm })}</Text>
                        )}
                      </YStack>
                    </XStack>
                  </Card>
                )
              })
            )}
          </YStack>

        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
