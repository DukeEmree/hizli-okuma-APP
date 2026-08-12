import { useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { useAuth } from '@clerk/clerk-expo';
import { api } from '@/convex/_generated/api';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { useStreakCacheStore } from '@/stores/streakCacheStore';
import { getLocalDateString } from '@/utils/streak';
import { buildLocalStats, type PerformanceStats } from '@/utils/localStatistics';
import { buildWeeklySummary, type DailyStatInput, type WeeklySummary } from '@/utils/weeklySummary';

/**
 * Single source of the weekly summary for both the home card and the full
 * screen: decides premium (server) vs free/guest (local) data source once,
 * so the two surfaces can never disagree on the numbers.
 */
export function useWeeklySummary(): {
  summary: WeeklySummary | null;
  /** The same per-day series the summary was built from — e.g. for a track/chart. */
  dailyTrends: PerformanceStats['dailyTrends'] | null;
  /** The same "now" and timezone the summary was computed with, so a caller building its own date labels stays in sync. */
  now: number;
  timeZone: string;
  isLoading: boolean;
} {
  const { isPremium } = useRevenueCat();
  const { isLoaded, isSignedIn } = useAuth();
  const currentStreak = useStreakCacheStore((s) => s.currentStreak);
  const localSessions = useLocalHistoryStore((s) => s.sessions);

  const shouldFetch = isLoaded && isSignedIn && isPremium;
  const stats = useQuery(api.statistics.getPerformanceStats, shouldFetch ? { timeRange: '30d' } : 'skip');

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  // eslint-disable-next-line react-hooks/purity
  const [now] = useState(() => Date.now());
  const today = getLocalDateString(now, timeZone);

  const dailyTrends = useMemo<PerformanceStats['dailyTrends'] | null>(() => {
    if (shouldFetch) return stats?.dailyTrends ?? null;
    return buildLocalStats(localSessions, '30d', now, timeZone).dailyTrends;
  }, [shouldFetch, stats, localSessions, now, timeZone]);

  const summary = useMemo(() => {
    if (!dailyTrends) return null;

    const dailyStats: DailyStatInput[] = dailyTrends.map((d) => ({
      date: d.date,
      durationMs: d.durationMs,
      avgWpm: d.avgWpm,
      sessionCount: d.sessionCount,
    }));

    return buildWeeklySummary(dailyStats, today, currentStreak);
  }, [dailyTrends, today, currentStreak]);

  return { summary, dailyTrends, now, timeZone, isLoading: shouldFetch && stats === undefined };
}
