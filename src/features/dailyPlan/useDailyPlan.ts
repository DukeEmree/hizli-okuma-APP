import { useEffect, useMemo, useState } from 'react';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';
import {
  selectDailyPlan,
  estimatePlanMinutes,
  medianDurationByType,
  ExercisePerformance,
} from '@/utils/dailyPlan';
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
  const completedIndices = useDailyPlanStore((s) => s.completedIndices);
  const lastPlanTypes = useDailyPlanStore((s) => s.lastPlanTypes);
  const ensureTodayPlan = useDailyPlanStore((s) => s.ensureTodayPlan);
  const setActiveFlowType = useDailyPlanStore((s) => s.setActiveFlowType);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  // eslint-disable-next-line react-hooks/purity
  const [now] = useState(() => Date.now());
  const today = getLocalDateString(now, timeZone);

  const { performanceByType, medianMsByType, todayMinutes } = useMemo(() => {
    const stats = buildLocalStats(localSessions, '30d', now, timeZone);

    const map: Record<string, ExercisePerformance> = {};
    for (const entry of stats.exerciseStats) {
      map[entry.type] = { averageScore: entry.averageScore, attemptCount: entry.attemptCount };
    }
    const todayTrend = stats.dailyTrends.find((d) => d.date === today);
    return {
      performanceByType: map,
      medianMsByType: medianDurationByType(localSessions),
      todayMinutes: Math.round((todayTrend?.durationMs ?? 0) / 60_000),
    };
  }, [localSessions, timeZone, now, today]);

  useEffect(() => {
    ensureTodayPlan(today, () => selectDailyPlan({ dateSeed: today, performanceByType, lastPlanTypes }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const isAllDone = exerciseTypes.length > 0 && completedIndices.length >= exerciseTypes.length;
  const firstPendingIndex = exerciseTypes.findIndex((_, i) => !completedIndices.includes(i));

  return {
    exerciseTypes,
    completedIndices,
    isAllDone,
    firstPendingIndex,
    setActiveFlowType,
    estimatedMinutes: estimatePlanMinutes(exerciseTypes, medianMsByType),
    todayMinutes,
  };
}
