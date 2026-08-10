import React from 'react';
import { View } from 'react-native';
import { H1, H4, Text, XStack, YStack, Button, Spinner, ScrollView } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { TimeRange } from "@/convex/statistics";
import { CartesianChart, Line } from 'victory-native';
import { StreakBadge } from "@/features/streak/StreakBadge";
import { StreakWeeklyCalendar } from "@/features/streak/StreakWeeklyCalendar";
import { HEADER_RIGHT_SPACING } from "@/constants/layout";

export function formatTime(ms: number) {
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins} dk`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours} sa ${remainingMins} dk`;
}

interface StatisticsDashboardProps {
  isLoading: boolean;
  hasData: boolean;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  currentStats: any;
}

export function StatisticsDashboard({
  isLoading,
  hasData,
  timeRange,
  onTimeRangeChange,
  currentStats
}: StatisticsDashboardProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="large" color="$blue10" />
      </View>
    );
  }

  const chartDataWpm: Array<{x: number, y: number}> = hasData && currentStats.dailyTrends.length > 1 
    ? currentStats.dailyTrends.map((d: any, i: number) => ({ x: i, y: d.avgWpm || 0 }))
    : [];

  const chartDataComp: Array<{x: number, y: number}> = hasData && currentStats.dailyTrends.length > 1
    ? currentStats.dailyTrends.map((d: any, i: number) => ({ x: i, y: (d.avgComprehension || 0) * 100 }))
    : [];

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        <XStack justifyContent="space-between" alignItems="center" paddingRight={HEADER_RIGHT_SPACING}>
          <H1 fontSize="$8">{t('progress.title', 'Gelişim & İstatistikler')}</H1>
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
              {t(`progress.ranges.${range}`, range.toUpperCase())}
            </Button>
          ))}
        </XStack>

        {!hasData ? (
          <YStack flex={1} justifyContent="center" alignItems="center" padding="$6" gap="$3">
            <H4>{t('progress.emptyTitle', 'Henüz Yeterli Veri Yok')}</H4>
            <Text textAlign="center" color="$color11">
              {t('progress.emptyMessage', 'İstatistiklerinizi görebilmek için egzersizleri tamamlamanız gerekmektedir.')}
            </Text>
          </YStack>
        ) : (
          <YStack gap="$6">
            {/* Toplam Özet */}
            <XStack flexWrap="wrap" justifyContent="space-between" marginVertical="$4">
              <YStack width="48%" backgroundColor="$backgroundHover" padding="$3" borderRadius="$4" marginBottom="$3">
                <Text color="$color11" fontSize="$4">Toplam Süre</Text>
                <H4>{formatTime(currentStats.totalTrainingTimeMs)}</H4>
              </YStack>
              <YStack width="48%" backgroundColor="$backgroundHover" padding="$3" borderRadius="$4" marginBottom="$3">
                <Text color="$color11" fontSize="$4">Tamamlanan Seans</Text>
                <H4>{currentStats.totalSessions}</H4>
              </YStack>
            </XStack>

            {/* WPM Trend Chart */}
            <YStack gap="$2">
              <H4>Okuma Hızı (WPM) Trendi</H4>
              <View style={{ height: 250, width: '100%' }}>
                {currentStats.dailyTrends.length > 1 ? (
                  <CartesianChart
                    data={chartDataWpm}
                    xKey="x"
                    yKeys={["y"]}
                    domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
                  >
                    {({ points }) => (
                      <Line points={points.y} color="blue" strokeWidth={3} animate={{ type: "timing", duration: 500 }} />
                    )}
                  </CartesianChart>
                ) : (
                  <Text padding="$4" textAlign="center" color="$color11">Trend oluşturmak için daha fazla gün egzersiz yapmalısınız.</Text>
                )}
              </View>
            </YStack>

            {/* Comprehension Chart */}
            <YStack gap="$2">
              <H4>Anlama Oranı (%)</H4>
              <View style={{ height: 250, width: '100%' }}>
                {currentStats.dailyTrends.length > 1 ? (
                  <CartesianChart
                    data={chartDataComp}
                    xKey="x"
                    yKeys={["y"]}
                    domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
                  >
                    {({ points }) => (
                      <Line points={points.y} color="green" strokeWidth={3} animate={{ type: "timing", duration: 500 }} />
                    )}
                  </CartesianChart>
                ) : (
                  <Text padding="$4" textAlign="center" color="$color11">Trend oluşturmak için daha fazla gün egzersiz yapmalısınız.</Text>
                )}
              </View>
            </YStack>

            {/* Per-Exercise Breakdown */}
            <YStack gap="$3" marginTop="$4">
              <H4>Egzersiz İstatistikleri</H4>
              {currentStats.exerciseStats.map((ex: any) => (
                <XStack key={ex.type} backgroundColor="$backgroundHover" padding="$3" borderRadius="$4" justifyContent="space-between" alignItems="center">
                  <YStack>
                    <Text fontWeight="bold" textTransform="capitalize">{ex.type}</Text>
                    <Text color="$color11" fontSize="$2">{ex.attemptCount} Seans</Text>
                  </YStack>
                  <YStack alignItems="flex-end">
                    <Text fontWeight="bold">En İyi Skor: {ex.bestScore}</Text>
                    {ex.bestWpm > 0 && <Text fontSize="$2">Max WPM: {ex.bestWpm}</Text>}
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
