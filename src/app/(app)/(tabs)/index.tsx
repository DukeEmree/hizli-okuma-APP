import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, YStack, XStack, H2, H4, ScrollView, useTheme } from 'tamagui';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StreakBadge } from '@/features/streak/StreakBadge';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useTodayMs } from '@/hooks/useTodayMs';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';
import { DailyPlanCard } from '@/features/dailyPlan/DailyPlanCard';
import { WeeklySummaryCard } from '@/features/weeklySummary/WeeklySummaryCard';
import { AppCard } from '@/components/ui/AppCard';
import { contentColumn, TAB_BAR_INSET } from '@/constants/layout';
import { exerciseRegistry } from '@/features/exercises/registry';
import { buildLocalStats } from '@/utils/localStatistics';
import { buildTodaySnapshot, paragraphSeconds, EXAM_PARAGRAPH_WORDS } from '@/utils/todayStats';
import { getLocalDateString } from '@/utils/streak';
import { formatDateTime } from '@/utils/datetime';


/** Keeps a number and its unit on one line at any font scale. */
const STAT_VALUE_PROPS = {
  numberOfLines: 1,
  adjustsFontSizeToFit: true,
  minimumFontScale: 0.6,
} as const;

interface StatTileProps {
  label: string;
  value: string;
  unit?: string;
  accessibilityLabel: string;
  tone?: '$color' | '$green11';
}

function StatTile({ label, value, unit, accessibilityLabel, tone = '$color' }: StatTileProps) {
  return (
    <AppCard
      flex={1}
      padding="$3"
      alignItems="center"
      minHeight={84}
      justifyContent="center"
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
    >
      <Text color="$color11" fontSize="$2" marginBottom="$1" {...STAT_VALUE_PROPS}>
        {label}
      </Text>
      <Text fontSize="$7" fontWeight="bold" color={tone} {...STAT_VALUE_PROPS}>
        {value}
        {unit ? <Text fontSize="$2"> {unit}</Text> : null}
      </Text>
    </AppCard>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation('home');
  const { t: tExercises } = useTranslation('exercises');
  const { isPremium } = useRevenueCat();
  const theme = useTheme();

  const localSessions = useLocalHistoryStore((state) => state.sessions);
  const dailyGoalMinutes = useSettingsStore((state) => state.dailyGoalMinutes);
  const planLength = useDailyPlanStore((state) => state.exerciseTypes.length);
  const planCompleted = useDailyPlanStore((state) => state.completedIndices.length);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const now = useTodayMs(timeZone);
  const today = getLocalDateString(now, timeZone);

  // Every number on this screen is today's. All-time averages moved to the
  // Statistics tab: on the home screen they moved by 1/200 after a session,
  // which answered "am I good?" instead of "did today count?".
  const todayStats = useMemo(
    () => buildTodaySnapshot(buildLocalStats(localSessions, '7d', now, timeZone).dailyTrends, today),
    [localSessions, now, timeZone, today],
  );

  const recentSessions = useMemo(
    () =>
      localSessions
        .slice()
        .sort((a, b) => b.completedAt - a.completedAt)
        .slice(0, 5),
    [localSessions],
  );

  const statusHeadline =
    todayStats.sessionCount === 0
      ? t('today.notStarted')
      : planLength > 0 && planCompleted < planLength
        ? t('today.inProgress', { done: planCompleted, total: planLength })
        : t('today.counted', { minutes: todayStats.minutes });

  const wpmValue = todayStats.wpm === null ? '–' : String(todayStats.wpm);
  const comprehensionValue =
    todayStats.comprehension === null ? '–' : `%${Math.round(todayStats.comprehension * 100)}`;

  // A WPM with nothing to compare it to is noise. The reference is always on
  // screen: today's speed when there is one, otherwise the recent average with
  // its window named, otherwise just what a paragraph question costs.
  const referenceWpm = todayStats.wpm ?? todayStats.baselineWpm;
  const examReference =
    referenceWpm === null
      ? t('today.examReferenceEmpty', { words: EXAM_PARAGRAPH_WORDS })
      : t(todayStats.wpm === null ? 'today.examReferenceRecent' : 'today.examReference', {
          words: EXAM_PARAGRAPH_WORDS,
          seconds: paragraphSeconds(referenceWpm),
          wpm: referenceWpm,
          days: todayStats.baselineDays,
        });

  const deltaLabel =
    todayStats.wpmDelta === null
      ? null
      : t(todayStats.wpmDelta >= 0 ? 'today.deltaUp' : 'today.deltaDown', {
          delta: Math.abs(todayStats.wpmDelta),
          days: todayStats.baselineDays,
        });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <ScrollView
        flex={1}
        backgroundColor="$background"
        contentContainerStyle={{ paddingBottom: TAB_BAR_INSET }}
      >
        <YStack padding="$4" gap="$5" {...contentColumn}>

          <XStack justifyContent="space-between" alignItems="center" gap="$3">
            <YStack flex={1}>
              <Text color="$color11" fontSize="$2">{t('greeting')}</Text>
              <H2>{statusHeadline}</H2>
            </YStack>
            <StreakBadge />
          </XStack>

          <YStack gap="$2">
            <Text color="$color11" fontSize="$1" fontWeight="bold" letterSpacing={0.6}>
              {t('today.sectionLabel')}
            </Text>
            <XStack gap="$3" justifyContent="space-between">
              <StatTile
                label={t('today.wpmLabel')}
                value={wpmValue}
                unit={t('stats.wpmUnit')}
                accessibilityLabel={
                  todayStats.wpm === null
                    ? `${t('today.wpmLabel')}: ${t('today.noData')}`
                    : `${t('today.wpmLabel')}: ${todayStats.wpm} ${t('stats.wpmUnit')}${deltaLabel ? `, ${deltaLabel}` : ''}`
                }
              />
              <StatTile
                label={t('today.comprehensionLabel')}
                value={comprehensionValue}
                accessibilityLabel={
                  todayStats.comprehension === null
                    ? `${t('today.comprehensionLabel')}: ${t('today.noData')}`
                    : `${t('today.comprehensionLabel')}: ${comprehensionValue}`
                }
              />
              <StatTile
                label={t('today.goalLabel')}
                value={`${todayStats.minutes}/${dailyGoalMinutes}`}
                unit={t('stats.minutesUnit')}
                tone={todayStats.minutes >= dailyGoalMinutes ? '$green11' : '$color'}
                accessibilityLabel={t('today.goalA11y', {
                  minutes: todayStats.minutes,
                  goal: dailyGoalMinutes,
                })}
              />
            </XStack>
            <Text color="$color11" fontSize="$2">
              {examReference}
              {deltaLabel ? ` · ${deltaLabel}` : ''}
            </Text>
          </YStack>

          <DailyPlanCard />

          <WeeklySummaryCard />

          {!isPremium && (
            <AppCard
              onPress={() => router.push('/paywall')}
              accessibilityRole="button"
              accessibilityLabel={`${t('premiumCard.title')}. ${t('premiumCard.subtitle')}`}
            >
              <XStack justifyContent="space-between" alignItems="center" gap="$3">
                <YStack flex={1}>
                  <H4 color="$green11">{t('premiumCard.title')}</H4>
                  <Text color="$color11" fontSize="$2">{t('premiumCard.subtitle')}</Text>
                </YStack>
                <ChevronRight size={22} color={theme.green11?.val as string} />
              </XStack>
            </AppCard>
          )}

          <YStack gap="$3" marginTop="$2">
            <H4>{t('recentActivity.title')}</H4>
            {recentSessions.length === 0 ? (
              <Text color="$color11">{t('recentActivity.empty')}</Text>
            ) : (
              recentSessions.map((session) => {
                const definition = exerciseRegistry.getByType(session.exerciseType);
                const name = definition
                  ? tExercises(definition.nameKey, session.exerciseType)
                  : session.exerciseType;
                return (
                  <AppCard key={session.clientSessionId} padding="$3">
                    <XStack justifyContent="space-between" alignItems="center" gap="$3">
                      <YStack flex={1}>
                        <Text fontWeight="bold">{name}</Text>
                        <Text color="$color11" fontSize="$2">{formatDateTime(session.completedAt)}</Text>
                      </YStack>
                      <YStack alignItems="flex-end">
                        <Text fontWeight="bold" color="$green10">{t('recentActivity.score', { score: session.score })}</Text>
                        {session.metrics?.wpm && (
                          <Text fontSize="$2" color="$color11">{t('recentActivity.wpm', { wpm: session.metrics.wpm })}</Text>
                        )}
                      </YStack>
                    </XStack>
                  </AppCard>
                );
              })
            )}
          </YStack>

        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
