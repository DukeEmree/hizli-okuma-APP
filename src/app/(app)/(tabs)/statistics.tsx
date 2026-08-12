import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimeRange } from "@/utils/localStatistics";
import { useLocalHistoryStore } from "@/stores/localHistoryStore";
import { buildLocalStats } from "@/utils/localStatistics";
import { StatisticsDashboard } from "@/components/ui/StatisticsDashboard";

export default function StatisticsTabScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const localSessions = useLocalHistoryStore(state => state.sessions);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const currentStats = buildLocalStats(localSessions, timeRange, undefined, timeZone);
  const hasData = currentStats.totalSessions > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <StatisticsDashboard
        isLoading={false}
        hasData={hasData}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        currentStats={currentStats}
      />
    </SafeAreaView>
  );
}
