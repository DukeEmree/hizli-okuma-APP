import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { TimeRange } from "@/convex/statistics";
import { useStatisticsStore } from "@/stores/useStatisticsStore";
import { StatisticsDashboard } from "@/components/ui/StatisticsDashboard";

export default function StatisticsTabScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const rawStats = useQuery(api.statistics.getPerformanceStats, { timeRange });
  const currentStats = useStatisticsStore(state => state.stats[timeRange]);
  const setStats = useStatisticsStore(state => state.setStats);

  useEffect(() => {
    if (rawStats) {
      setStats(timeRange, rawStats);
    }
  }, [rawStats, timeRange, setStats]);

  const isLoading = currentStats === null;
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
