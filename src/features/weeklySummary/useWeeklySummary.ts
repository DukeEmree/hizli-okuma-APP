import { useMemo, useState } from 'react';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { useStreakCacheStore } from '@/stores/streakCacheStore';
import { getLocalDateString } from '@/utils/streak';
import { buildLocalStats, type PerformanceStats } from '@/utils/localStatistics';
import { buildWeeklySummary, type DailyStatInput, type WeeklySummary } from '@/utils/weeklySummary';

export function useWeeklySummary(): {
  summary: WeeklySummary | null;
  dailyTrends: PerformanceStats['dailyTrends'] | null;
  now: number;
  timeZone: string;
  isLoading: boolean;
} {
  const currentStreak = useStreakCacheStore((s) => s.currentStreak);
  const localSessions = useLocalHistoryStore((s) => s.sessions);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  // eslint-disable-next-line react-hooks/purity
  const [now] = useState(() => Date.now());
  const today = getLocalDateString(now, timeZone);

  const dailyTrends = useMemo<PerformanceStats['dailyTrends']>(
    () => buildLocalStats(localSessions, '30d', now, timeZone).dailyTrends,
    [localSessions, now, timeZone],
  );

  const summary = useMemo(() => {
    const dailyStats: DailyStatInput[] = dailyTrends.map((d) => ({
      date: d.date,
      durationMs: d.durationMs,
      avgWpm: d.avgWpm,
      sessionCount: d.sessionCount,
    }));

    return buildWeeklySummary(dailyStats, today, currentStreak);
  }, [dailyTrends, today, currentStreak]);

  return { summary, dailyTrends, now, timeZone, isLoading: false };
}
