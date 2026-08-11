import React, { useState, useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { TimeRange } from "@/convex/statistics";
import { useStatisticsStore } from "@/stores/useStatisticsStore";
import { useLocalHistoryStore } from "@/stores/localHistoryStore";
import { buildLocalStats } from "@/utils/localStatistics";
import { StatisticsDashboard } from "@/components/ui/StatisticsDashboard";
import { useRevenueCat } from "@/providers/RevenueCatProvider";

export default function StatisticsTabScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const { isPremium } = useRevenueCat();

  // Cloud statistics are premium-only (no retention limit, survives a
  // reinstall). Free users get the same dashboard built from the 6 months of
  // history kept on the device - same shape, so the component can't tell.
  const rawStats = useQuery(api.statistics.getPerformanceStats, isPremium ? { timeRange } : "skip");
  const cachedStats = useStatisticsStore(state => state.stats[timeRange]);
  const setStats = useStatisticsStore(state => state.setStats);
  const localSessions = useLocalHistoryStore(state => state.sessions);

  useEffect(() => {
    if (rawStats) {
      setStats(timeRange, rawStats);
    }
  }, [rawStats, timeRange, setStats]);

  const localStats = useMemo(() => {
    if (isPremium) return null;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    // `now` is left to the helper's default rather than read here: reading the
    // clock during render is impure, and the range boundary only matters at
    // day granularity anyway.
    return buildLocalStats(localSessions, timeRange, undefined, timeZone);
  }, [isPremium, localSessions, timeRange]);

  const currentStats = isPremium ? cachedStats : localStats;

  // Only the cloud path can be "loading" - the local one is computed inline.
  const isLoading = isPremium && cachedStats === null;
  const hasData = (currentStats?.totalSessions ?? 0) > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <StatisticsDashboard
        isLoading={isLoading}
        hasData={hasData}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        currentStats={currentStats}
      />
    </SafeAreaView>
  );
}
