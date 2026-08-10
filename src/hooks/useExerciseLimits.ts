import { SUBSCRIPTION_CONSTANTS } from "@/constants/subscription";
import { api } from "@/convex/_generated/api";
import { useRevenueCat } from "@/providers/RevenueCatProvider";
import { getLocalDateString } from "@/utils/streak";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";

export function useExerciseLimits() {
  const { isPremium, isConfigured } = useRevenueCat();

  const [todayStr] = useState(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    return getLocalDateString(Date.now(), timeZone);
  });

  // To avoid hitting API limits unnecessarily, we reuse getPerformanceStats for '7d'
  // and check today's count.
  const stats = useQuery(api.statistics.getPerformanceStats, {
    timeRange: "7d",
  });

  return useMemo(() => {
    if (!isConfigured || !stats) {
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

    const todayStats = stats.dailyTrends.find((d) => d.date === todayStr);
    const sessionsToday = todayStats?.sessionCount || 0;

    const max = SUBSCRIPTION_CONSTANTS.FREE_TIER.MAX_DAILY_EXERCISES;
    const remaining = Math.max(0, max - sessionsToday);

    return {
      canStartExercise: remaining > 0,
      isLoading: false,
      remainingExercises: remaining,
      isPremium,
    };
  }, [isPremium, isConfigured, stats, todayStr]);
}
