import { SUBSCRIPTION_CONSTANTS } from "@/constants/subscription";
import { api } from "@/convex/_generated/api";
import { useRevenueCat } from "@/providers/RevenueCatProvider";
import { getLocalDateString } from "@/utils/streak";
import { useQuery } from "convex/react";
import { useMemo, useState, useEffect } from "react";
import { useAppState } from "@/hooks/useAppState";
import { useSyncStore } from "@/stores/syncStore";

export function useExerciseLimits() {
  const { isPremium, isConfigured } = useRevenueCat();
  const appState = useAppState();

  const [todayStr, setTodayStr] = useState(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    return getLocalDateString(Date.now(), timeZone);
  });

  useEffect(() => {
    if (appState === 'active') {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTodayStr(getLocalDateString(Date.now(), timeZone));
    }
  }, [appState]);

  // To avoid hitting API limits unnecessarily, we reuse getPerformanceStats for '7d'
  // and check today's count.
  const stats = useQuery(api.statistics.getPerformanceStats, {
    timeRange: "7d",
  });
  
  const pendingSessions = useSyncStore(s => s.pendingSessions);

  return useMemo(() => {
    if (!isConfigured || stats === undefined) {
      return {
        canStartExercise: false,
        isLoading: true,
        remainingExercises: 0,
        isPremium,
      };
    }

    if (isPremium) {
      return {
        canStartExercise: true,
        isLoading: false,
        remainingExercises: Infinity,
        isPremium,
      };
    }

    // `stats` is null or empty if guest
    const todayStats = stats?.dailyTrends?.find((d) => d.date === todayStr);
    const serverSessionsToday = todayStats?.sessionCount || 0;
    
    // Count pending sessions that belong to today
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const pendingSessionsToday = pendingSessions.filter(
      (s) => getLocalDateString(s.completedAt, timeZone) === todayStr
    ).length;
    
    const sessionsToday = serverSessionsToday + pendingSessionsToday;

    const max = SUBSCRIPTION_CONSTANTS.FREE_TIER.MAX_DAILY_EXERCISES;
    const remaining = Math.max(0, max - sessionsToday);

    return {
      canStartExercise: remaining > 0,
      isLoading: false,
      remainingExercises: remaining,
      isPremium,
    };
  }, [isPremium, isConfigured, stats, todayStr, pendingSessions]);
}
