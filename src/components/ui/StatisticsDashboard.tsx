import React from 'react';
import { View } from 'react-native';
import { H1, H4, Text, XStack, YStack, Button, Spinner, ScrollView, useTheme } from 'tamagui';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { PerformanceStats, TimeRange } from "@/utils/localStatistics";
import { CartesianChart, Line, Bar } from 'victory-native';
import { StreakBadge } from "@/features/streak/StreakBadge";
import { StreakWeeklyCalendar } from "@/features/streak/StreakWeeklyCalendar";

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
    <ScrollView flex={1} backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        <XStack justifyContent="space-between" alignItems="center">
          <H1 fontSize="$8">{t('title')}</H1>
          <StreakBadge />
        </XStack>

        <StreakWeeklyCalendar />

        {/* Time Range Selector */}
        <XStack gap="$2" justifyContent="space-between">
          {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              size="$3"
              flex={1}
              theme={timeRange === range ? 'accent' : undefined}
              onPress={() => onTimeRangeChange(range)}
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
              <View style={{ height: 250, width: '100%' }}>
                {currentStats.dailyTrends.length > 1 ? (
                  <CartesianChart
                    data={chartDataWpm}
                    xKey="x"
                    yKeys={["y"]}
                    domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
                  >
                    {({ points }) => (
                      <Line points={points.y} color={theme.green10?.val as string} strokeWidth={3} animate={{ type: "timing", duration: 500 }} />
                    )}
                  </CartesianChart>
                ) : (
                  <Text padding="$4" textAlign="center" color="$color11">{t('charts.needMoreDays')}</Text>
                )}
              </View>
            </YStack>

            {/* Comprehension Chart */}
            <YStack gap="$2">
              <H4>{t('charts.comprehensionTitle')}</H4>
              <View style={{ height: 250, width: '100%' }}>
                {currentStats.dailyTrends.length > 1 ? (
                  <CartesianChart
                    data={chartDataComp}
                    xKey="x"
                    yKeys={["y"]}
                    domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
                  >
                    {({ points }) => (
                      <Line points={points.y} color={theme.green10?.val as string} strokeWidth={3} animate={{ type: "timing", duration: 500 }} />
                    )}
                  </CartesianChart>
                ) : (
                  <Text padding="$4" textAlign="center" color="$color11">{t('charts.needMoreDays')}</Text>
                )}
              </View>
            </YStack>

            {/* Accuracy Trend Chart */}
            <YStack gap="$2">
              <H4>{t('charts.accuracyTitle')}</H4>
              <View style={{ height: 250, width: '100%' }}>
                {currentStats.dailyTrends.length > 1 ? (
                  <CartesianChart
                    data={chartDataAcc}
                    xKey="x"
                    yKeys={["y"]}
                    domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
                  >
                    {({ points }) => (
                      <Line points={points.y} color={theme.orange10?.val as string} strokeWidth={3} animate={{ type: "timing", duration: 500 }} />
                    )}
                  </CartesianChart>
                ) : (
                  <Text padding="$4" textAlign="center" color="$color11">{t('charts.needMoreDays')}</Text>
                )}
              </View>
            </YStack>

            {/* Per-Exercise Best Score Bar Chart */}
            <YStack gap="$2">
              <H4>{t('charts.exerciseScoreTitle')}</H4>
              <View style={{ height: 220, width: '100%' }}>
                {currentStats.exerciseStats.length > 0 ? (
                  <CartesianChart
                    data={chartDataExercise}
                    xKey="x"
                    yKeys={["y"]}
                    domainPadding={{ left: 30, right: 30, top: 20, bottom: 20 }}
                    axisOptions={{
                      formatXLabel: (v) => currentStats.exerciseStats[v as number]?.type ?? '',
                    }}
                  >
                    {({ points, chartBounds }) => (
                      <Bar
                        points={points.y}
                        chartBounds={chartBounds}
                        color={theme.accent10?.val as string}
                        roundedCorners={{ topLeft: 4, topRight: 4 }}
                        animate={{ type: "timing", duration: 500 }}
                      />
                    )}
                  </CartesianChart>
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
                    <Text fontWeight="bold" textTransform="capitalize">{ex.type}</Text>
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
