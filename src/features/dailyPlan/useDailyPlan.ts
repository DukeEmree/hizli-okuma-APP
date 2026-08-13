import { useEffect, useMemo, useState } from 'react';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';
import { selectDailyPlan, ExercisePerformance } from '@/utils/dailyPlan';
import { getLocalDateString } from '@/utils/streak';
import { buildLocalStats } from '@/utils/localStatistics';

/**
 * Ensures today's plan exists and exposes it. Shared by DailyPlanCard and
 * DailyPlanListScreen so the performance-based selection logic isn't
 * duplicated between the two entry points.
 */
export function useDailyPlan() {
  const localSessions = useLocalHistoryStore((s) => s.sessions);
  const exerciseTypes = useDailyPlanStore((s) => s.exerciseTypes);
  const completedTypes = useDailyPlanStore((s) => s.completedTypes);
  const lastPlanTypes = useDailyPlanStore((s) => s.lastPlanTypes);
  const ensureTodayPlan = useDailyPlanStore((s) => s.ensureTodayPlan);
  const setActiveFlowType = useDailyPlanStore((s) => s.setActiveFlowType);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  // eslint-disable-next-line react-hooks/purity
  const [now] = useState(() => Date.now());
  const today = getLocalDateString(now, timeZone);

  const performanceByType = useMemo(() => {
    const exerciseStats = buildLocalStats(localSessions, '30d', now, timeZone).exerciseStats;

    const map: Record<string, ExercisePerformance> = {};
    for (const entry of exerciseStats) {
      map[entry.type] = { averageScore: entry.averageScore, attemptCount: entry.attemptCount };
    }
    return map;
  }, [localSessions, timeZone, now]);

  useEffect(() => {
    ensureTodayPlan(today, () => selectDailyPlan({ dateSeed: today, performanceByType, lastPlanTypes }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const completedCount = completedTypes.length;
  const isAllDone = exerciseTypes.length > 0 && completedCount >= exerciseTypes.length;
  const firstPendingType = exerciseTypes.find((type) => !completedTypes.includes(type));

  return {
    exerciseTypes,
    completedTypes,
    isAllDone,
    firstPendingType,
    setActiveFlowType,
  };
}
