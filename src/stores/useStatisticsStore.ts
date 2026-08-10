import { create } from 'zustand';
import { TimeRange } from "@/convex/statistics";

export interface DailyTrend {
  date: string;
  avgWpm: number | null;
  avgComprehension: number | null;
  avgAccuracy: number | null;
  avgScore: number | null;
  durationMs: number;
  sessionCount: number;
}

export interface ExerciseStat {
  type: string;
  bestScore: number;
  averageScore: number;
  bestWpm: number;
  averageWpm: number | null;
  attemptCount: number;
}

export interface PerformanceStats {
  totalTrainingTimeMs: number;
  totalSessions: number;
  dailyTrends: DailyTrend[];
  exerciseStats: ExerciseStat[];
}

interface StatisticsStore {
  stats: Record<TimeRange, PerformanceStats | null>;
  setStats: (range: TimeRange, data: PerformanceStats) => void;
  invalidate: () => void;
}

export const useStatisticsStore = create<StatisticsStore>((set) => ({
  stats: {
    '7d': null,
    '30d': null,
    '90d': null,
    'all': null,
  },
  setStats: (range, data) => set((state) => ({
    stats: {
      ...state.stats,
      [range]: data,
    }
  })),
  invalidate: () => set({
    stats: {
      '7d': null,
      '30d': null,
      '90d': null,
      'all': null,
    }
  })
}));
