import { SUBSCRIPTION_CONSTANTS } from "@/constants/subscription";
import { useRevenueCat } from "@/providers/RevenueCatProvider";
import { getLocalDateString } from "@/utils/streak";
import { useMemo, useState, useEffect } from "react";
import { useAppState } from "@/hooks/useAppState";
import { useLocalHistoryStore } from "@/stores/localHistoryStore";

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

  const localSessions = useLocalHistoryStore(s => s.sessions);

  return useMemo(() => {
    if (!isConfigured) {
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

    // Free/guest: the count comes from the on-device history (no backend to query).
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const sessionsToday = localSessions.filter(
      (s) => getLocalDateString(s.completedAt, timeZone) === todayStr
    ).length;

    const max = SUBSCRIPTION_CONSTANTS.FREE_TIER.MAX_DAILY_EXERCISES;
    const remaining = Math.max(0, max - sessionsToday);

    return {
      canStartExercise: remaining > 0,
      isLoading: false,
      remainingExercises: remaining,
      isPremium,
    };
  }, [isPremium, isConfigured, todayStr, localSessions]);
}
