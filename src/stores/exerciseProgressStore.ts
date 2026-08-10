import { DifficultyLevel } from "@/types/exercise";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userScopedStorageAdapter } from "./storage";

export interface ExerciseMetrics {
  currentDifficulty: DifficultyLevel;
  bestScore: number;
  bestWpm: number;
  bestAccuracy: number;
  bestComprehension: number;
  attemptCount: number;
  consecutiveSuccesses: number;
  consecutiveFailures: number;
  historicalBestLevel: number;
}

export interface ExerciseProgressState {
  exercises: Record<string, ExerciseMetrics>;

  getExerciseMetrics: (exerciseId: string) => ExerciseMetrics;
  updateExerciseMetrics: (
    exerciseId: string,
    metrics: Partial<ExerciseMetrics>,
  ) => void;
  incrementAttempt: (exerciseId: string) => void;
  resetAll: () => void;
}

const defaultExerciseMetrics: ExerciseMetrics = {
  currentDifficulty: 1,
  bestScore: 0,
  bestWpm: 0,
  bestAccuracy: 0,
  bestComprehension: 0,
  attemptCount: 0,
  consecutiveSuccesses: 0,
  consecutiveFailures: 0,
  historicalBestLevel: 1,
};

export const useExerciseProgressStore = create<ExerciseProgressState>()(
  persist(
    (set, get) => ({
      exercises: {},

      getExerciseMetrics: (exerciseId) => {
        return get().exercises[exerciseId] || { ...defaultExerciseMetrics };
      },

      updateExerciseMetrics: (exerciseId, metrics) =>
        set((state) => {
          const current = state.exercises[exerciseId] || {
            ...defaultExerciseMetrics,
          };
          return {
            exercises: {
              ...state.exercises,
              [exerciseId]: {
                ...current,
                ...metrics,
                // Update bests automatically if provided values are higher
                bestScore: Math.max(current.bestScore, metrics.bestScore ?? 0),
                bestWpm: Math.max(current.bestWpm, metrics.bestWpm ?? 0),
                bestAccuracy: Math.max(
                  current.bestAccuracy,
                  metrics.bestAccuracy ?? 0,
                ),
                bestComprehension: Math.max(
                  current.bestComprehension,
                  metrics.bestComprehension ?? 0,
                ),
              },
            },
          };
        }),

      incrementAttempt: (exerciseId) =>
        set((state) => {
          const current = state.exercises[exerciseId] || {
            ...defaultExerciseMetrics,
          };
          return {
            exercises: {
              ...state.exercises,
              [exerciseId]: {
                ...current,
                attemptCount: current.attemptCount + 1,
              },
            },
          };
        }),

      resetAll: () => set({ exercises: {} }),
    }),
    {
      name: "exercise-progress-store",
      storage: createJSONStorage(() => userScopedStorageAdapter),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        return persistedState as ExerciseProgressState;
      },
    },
  ),
);
