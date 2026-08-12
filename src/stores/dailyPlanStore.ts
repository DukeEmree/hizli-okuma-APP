import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userScopedStorageAdapter } from "./storage";

interface DailyPlanState {
  date: string;
  exerciseTypes: string[];
  completedTypes: string[];
  lastPlanTypes: string[];
  /**
   * Regenerates today's plan if the stored one is for a different day (or
   * doesn't exist yet). `computePlan` is only called on that transition -
   * the plan is derived once per day and then cached here, so it doesn't
   * drift mid-day as the user's stats change from unrelated sessions.
   */
  ensureTodayPlan: (today: string, computePlan: () => string[]) => void;
  /**
   * Marks a step done if it belongs to today's plan. Idempotent. Returns
   * whether `type` is (or was) a step of today's plan, so callers can tell
   * plan-relevant completions apart from ad-hoc exercise runs.
   */
  markStepCompleted: (type: string) => boolean;
}

export const useDailyPlanStore = create<DailyPlanState>()(
  persist(
    (set, get) => ({
      date: "",
      exerciseTypes: [],
      completedTypes: [],
      lastPlanTypes: [],
      ensureTodayPlan: (today, computePlan) => {
        const state = get();
        if (state.date === today && state.exerciseTypes.length > 0) return;
        set({
          date: today,
          exerciseTypes: computePlan(),
          completedTypes: [],
          lastPlanTypes: state.date ? state.exerciseTypes : state.lastPlanTypes,
        });
      },
      markStepCompleted: (type) => {
        const state = get();
        if (!state.exerciseTypes.includes(type)) return false;
        if (!state.completedTypes.includes(type)) {
          set({ completedTypes: [...state.completedTypes, type] });
        }
        return true;
      },
    }),
    {
      name: "daily-plan-store",
      storage: createJSONStorage(() => userScopedStorageAdapter),
      version: 1,
    },
  ),
);
