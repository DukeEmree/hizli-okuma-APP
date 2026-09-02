import React from 'react';
import { View } from 'react-native';
import { H2, H4, Text, XStack, YStack, Button, Spinner, ScrollView, useTheme } from 'tamagui';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { PerformanceStats, TimeRange } from "@/utils/localStatistics";
import { SafeLineChart, SafeBarChart } from '@/components/ui/charts/SafeCharts';
import { StreakBadge } from "@/features/streak/StreakBadge";
import { StreakWeeklyCalendar } from "@/features/streak/StreakWeeklyCalendar";
import { exerciseRegistry } from "@/features/exercises/registry";
import { contentColumn, TAB_BAR_INSET } from '@/constants/layout';


export function formatTime(ms: number, t: TFunction<'progress'>) {
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return t('time.minutes', { minutes: mins });
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return t('time.hoursMinutes', { hours, minutes: remainingMins });
}

interface StatisticsDashboardProps {
  isLoading: boolean;
  hasData: boolean;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  currentStats: PerformanceStats;
}

export function StatisticsDashboard({
  isLoading,
  hasData,
  timeRange,
  onTimeRangeChange,
  currentStats
}: StatisticsDashboardProps) {
  const { t } = useTranslation('progress');
  const { t: tExercises } = useTranslation('exercises');
  // The breakdown listed the raw `exerciseType` slug ("Comprehension-Speed")
  // next to the Turkish names the rest of the app shows for the same thing.
  const exerciseName = (type: string) => {
    const definition = exerciseRegistry.getByType(type);
    return definition ? tExercises(definition.nameKey, type) : type;
  };
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="large" color="$green10" />
      </View>
    );
  }

  const chartDataWpm: {x: number, y: number}[] = hasData && currentStats.dailyTrends.length > 1
    ? currentStats.dailyTrends.map((d, i) => ({ x: i, y: d.avgWpm || 0 }))
    : [];

  const chartDataComp: {x: number, y: number}[] = hasData && currentStats.dailyTrends.length > 1
    ? currentStats.dailyTrends.map((d, i) => ({ x: i, y: (d.avgComprehension || 0) * 100 }))
    : [];

  const chartDataAcc: {x: number, y: number}[] = hasData && currentStats.dailyTrends.length > 1
    ? currentStats.dailyTrends.map((d, i) => ({ x: i, y: (d.avgAccuracy || 0) * 100 }))
    : [];

  const chartDataExercise: {x: number, y: number}[] = hasData
    ? currentStats.exerciseStats.map((ex, i) => ({ x: i, y: ex.bestScore }))
    : [];

  const overallAverageScore = hasData && currentStats.exerciseStats.length > 0
    ? Math.round(
        currentStats.exerciseStats.reduce((sum, ex) => sum + ex.averageScore, 0) /
          currentStats.exerciseStats.length,
      )
    : 0;

  return (
    <ScrollView flex={1} backgroundColor="$background" contentContainerStyle={{ paddingBottom: TAB_BAR_INSET }}>
      <YStack padding="$4" gap="$4" {...contentColumn}>

        <XStack justifyContent="space-between" alignItems="center">
          <H2>{t('title')}</H2>
          <StreakBadge />
        </XStack>

        <StreakWeeklyCalendar />

        {/* Time Range Selector */}
        <XStack gap="$2" justifyContent="space-between">
          {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              size="$4.5"
              flex={1}
              theme={timeRange === range ? 'accent' : undefined}
              variant={timeRange === range ? undefined : 'outlined'}
              onPress={() => onTimeRangeChange(range)}
              accessibilityRole="radio"
              accessibilityState={{ selected: timeRange === range, checked: timeRange === range }}
            >
              {t(`ranges.${range}`)}
            </Button>
          ))}
        </XStack>

        {!hasData ? (
          <YStack flex={1} justifyContent="center" alignItems="center" padding="$6" gap="$3">
            <H4>{t('emptyTitle')}</H4>
            <Text textAlign="center" color="$color11">
              {t('emptyMessage')}
            </Text>
          </YStack>
        ) : (
          <YStack gap="$6">
            {/* Toplam Özet */}
            <XStack flexWrap="wrap" justifyContent="space-between" marginVertical="$4">
              <YStack width="48%" backgroundColor="$backgroundHover" padding="$3" borderRadius="$4" marginBottom="$3">
                <Text color="$color11" fontSize="$4">{t('summary.totalTime')}</Text>
                <H4>{formatTime(currentStats.totalTrainingTimeMs, t)}</H4>
              </YStack>
              <YStack width="48%" backgroundColor="$backgroundHover" padding="$3" borderRadius="$4" marginBottom="$3">
                <Text color="$color11" fontSize="$4">{t('summary.totalSessions')}</Text>
                <H4>{currentStats.totalSessions}</H4>
              </YStack>
              <YStack width="48%" backgroundColor="$backgroundHover" padding="$3" borderRadius="$4">
                <Text color="$color11" fontSize="$4">{t('summary.averageScore')}</Text>
                <H4>{overallAverageScore}</H4>
              </YStack>
              <YStack width="48%" backgroundColor="$backgroundHover" padding="$3" borderRadius="$4">
                <Text color="$color11" fontSize="$4">{t('summary.exerciseTypeCount')}</Text>
                <H4>{currentStats.exerciseStats.length}</H4>
              </YStack>
            </XStack>

            {/* WPM Trend Chart */}
            <YStack gap="$2">
              <H4>{t('charts.wpmTitle')}</H4>
              <View
                style={{ height: 250, width: '100%' }}
                accessible
                accessibilityRole="image"
                accessibilityLabel={t('charts.wpmTitle')}
              >
                {currentStats.dailyTrends.length > 1 ? (
                  <SafeLineChart
                    data={chartDataWpm}
                    color={theme.green10?.val as string}
                    height={250}
                    emptyText={t('charts.needMoreDays')}
                  />
                ) : (
                  <Text padding="$4" textAlign="center" color="$color11">{t('charts.needMoreDays')}</Text>
                )}
              </View>
            </YStack>

            {/* Comprehension Chart */}
            <YStack gap="$2">
              <H4>{t('charts.comprehensionTitle')}</H4>
              <View
                style={{ height: 250, width: '100%' }}
                accessible
                accessibilityRole="image"
                accessibilityLabel={t('charts.comprehensionTitle')}
              >
                {currentStats.dailyTrends.length > 1 ? (
                  <SafeLineChart
                    data={chartDataComp}
                    color={theme.green10?.val as string}
                    height={250}
                    emptyText={t('charts.needMoreDays')}
                  />
                ) : (
                  <Text padding="$4" textAlign="center" color="$color11">{t('charts.needMoreDays')}</Text>
                )}
              </View>
            </YStack>

            {/* Accuracy Trend Chart */}
            <YStack gap="$2">
              <H4>{t('charts.accuracyTitle')}</H4>
              <View
                style={{ height: 250, width: '100%' }}
                accessible
                accessibilityRole="image"
                accessibilityLabel={t('charts.accuracyTitle')}
              >
                {currentStats.dailyTrends.length > 1 ? (
                  <SafeLineChart
                    data={chartDataAcc}
                    color={theme.green10?.val as string}
                    height={250}
                    emptyText={t('charts.needMoreDays')}
                  />
                ) : (
                  <Text padding="$4" textAlign="center" color="$color11">{t('charts.needMoreDays')}</Text>
                )}
              </View>
            </YStack>

            {/* Per-Exercise Best Score Bar Chart */}
            <YStack gap="$2">
              <H4>{t('charts.exerciseScoreTitle')}</H4>
              <View
                style={{ height: 220, width: '100%' }}
                accessible
                accessibilityRole="image"
                accessibilityLabel={t('charts.exerciseScoreTitle')}
              >
                {currentStats.exerciseStats.length > 0 ? (
                  <SafeBarChart
                    data={chartDataExercise}
                    color={theme.green9?.val as string}
                    height={220}
                    emptyText={t('charts.noExerciseStats')}
                  />
                ) : (
                  <Text padding="$4" textAlign="center" color="$color11">{t('charts.noExerciseStats')}</Text>
                )}
              </View>
            </YStack>


            {/* Per-Exercise Breakdown */}
            <YStack gap="$3" marginTop="$4">
              <H4>{t('breakdown.title')}</H4>
              {currentStats.exerciseStats.map((ex) => (
                <XStack key={ex.type} backgroundColor="$backgroundHover" padding="$3" borderRadius="$4" justifyContent="space-between" alignItems="center">
                  <YStack>
                    <Text fontWeight="bold">{exerciseName(ex.type)}</Text>
                    <Text color="$color11" fontSize="$2">{t('breakdown.sessions', { count: ex.attemptCount })}</Text>
                  </YStack>
                  <YStack alignItems="flex-end">
                    <Text fontWeight="bold">{t('breakdown.bestScore', { score: ex.bestScore })}</Text>
                    {ex.bestWpm > 0 && <Text fontSize="$2">{t('breakdown.maxWpm', { wpm: ex.bestWpm })}</Text>}
                  </YStack>
                </XStack>
              ))}
            </YStack>

          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}
