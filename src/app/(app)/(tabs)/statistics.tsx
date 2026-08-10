import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H1, H4, Text, XStack, YStack, Button, Spinner, ScrollView } from 'tamagui';
import { useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useTranslation } from 'react-i18next';
import { TimeRange } from "@/convex/statistics";
import { useStatisticsStore } from "@/stores/useStatisticsStore";

import { CartesianChart, Line } from 'victory-native';
import { StreakBadge } from "@/features/streak/StreakBadge";
import { StreakWeeklyCalendar } from "@/features/streak/StreakWeeklyCalendar";

function formatTime(ms: number) {
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins} dk`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours} sa ${remainingMins} dk`;
}

export default function StatisticsTabScreen() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  
  const rawStats = useQuery(api.statistics.getPerformanceStats, { timeRange });
  const { stats, setStats } = useStatisticsStore();

  const currentStats = stats[timeRange];

  useEffect(() => {
    if (rawStats) {
      setStats(timeRange, rawStats);
    }
  }, [rawStats, timeRange, setStats]);

  const isLoading = currentStats === null;

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size="large" color="$blue10" />
        </View>
      </SafeAreaView>
    );
  }

  const hasData = currentStats.totalSessions > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <ScrollView flex={1} backgroundColor="$background">
        <YStack padding="$4" gap="$4">
          <XStack justifyContent="space-between" alignItems="center" paddingRight={48}>
            <H1 fontSize={24}>{t('progress.title', 'Gelişim & İstatistikler')}</H1>
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
                theme={timeRange === range ? 'active' : undefined}
                onPress={() => setTimeRange(range)}
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
                  <Text color="$color11" fontSize={14}>Toplam Süre</Text>
                  <H4>{formatTime(currentStats.totalTrainingTimeMs)}</H4>
                </YStack>
                <YStack width="48%" backgroundColor="$backgroundHover" padding="$3" borderRadius="$4" marginBottom="$3">
                  <Text color="$color11" fontSize={14}>Tamamlanan Seans</Text>
                  <H4>{currentStats.totalSessions}</H4>
                </YStack>
              </XStack>

              {/* WPM Trend Chart */}
              <YStack gap="$2">
                <H4>Okuma Hızı (WPM) Trendi</H4>
                <View style={{ height: 250, width: '100%' }}>
                  {currentStats.dailyTrends.length > 1 ? (
                    <CartesianChart 
                      data={currentStats.dailyTrends.map((d, i) => ({ x: i, y: d.avgWpm || 0 }))} 
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
                      data={currentStats.dailyTrends.map((d, i) => ({ x: i, y: (d.avgComprehension || 0) * 100 }))} 
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
                {currentStats.exerciseStats.map(ex => (
                  <XStack key={ex.type} backgroundColor="$backgroundHover" padding="$3" borderRadius="$4" justifyContent="space-between" alignItems="center">
                    <YStack>
                      <Text fontWeight="bold" textTransform="capitalize">{ex.type}</Text>
                      <Text color="$color11" fontSize={12}>{ex.attemptCount} Seans</Text>
                    </YStack>
                    <YStack alignItems="flex-end">
                      <Text fontWeight="bold">En İyi Skor: {ex.bestScore}</Text>
                      {ex.bestWpm > 0 && <Text fontSize={12}>Max WPM: {ex.bestWpm}</Text>}
                    </YStack>
                  </XStack>
                ))}
              </YStack>

            </YStack>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
