import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userScopedStorageAdapter } from "./storage";

interface DailyPlanState {
  date: string;
  exerciseTypes: string[];
  /**
   * Indices into `exerciseTypes`, not types. A plan can legitimately list the
   * same exercise twice; keying completion by type made finishing it once tick
   * both rows and fire `isAllDone` early.
   */
  completedIndices: number[];
  lastPlanTypes: string[];
  /**
   * The plan step type currently being run through the daily-plan flow
   * (set when launched from DailyPlanCard, cleared on finish/plan-complete).
   * Lets completion screens tell "this run is part of today's chained
   * flow" apart from "user started this same exercise type standalone
   * from the Egzersizler tab" - both mark the step done, but only the
   * former should auto-chain to the next step.
   */
  activeFlowType: string | null;
  /**
   * Regenerates today's plan if the stored one is for a different day, doesn't
   * exist yet, or contains a duplicated step. `computePlan` is only called on
   * that transition - the plan is derived once per day and then cached here,
   * so it doesn't drift mid-day as the user's stats change from unrelated
   * sessions.
   *
   * The duplicate check is a self-heal for plans an older build already wrote
   * to MMKV: the generator was fixed, the stored data wasn't, and a persisted
   * plan otherwise survives untouched until midnight.
   */
  ensureTodayPlan: (today: string, computePlan: () => string[]) => void;
  /**
   * Marks the first not-yet-completed step of `type` done. Idempotent per
   * step. Returns whether `type` is (or was) a step of today's plan, so
   * callers can tell plan-relevant completions apart from ad-hoc runs.
   */
  markStepCompleted: (type: string) => boolean;
  setActiveFlowType: (type: string | null) => void;
  resetPlan: () => void;
}

function hasDuplicate(types: string[]): boolean {
  return new Set(types).size !== types.length;
}

export const useDailyPlanStore = create<DailyPlanState>()(
  persist(
    (set, get) => ({
      date: "",
      exerciseTypes: [],
      completedIndices: [],
      lastPlanTypes: [],
      activeFlowType: null,
      ensureTodayPlan: (today, computePlan) => {
        const state = get();
        const isUsable =
          state.date === today &&
          state.exerciseTypes.length > 0 &&
          !hasDuplicate(state.exerciseTypes);
        if (isUsable) return;
        set({
          date: today,
          exerciseTypes: computePlan(),
          completedIndices: [],
          lastPlanTypes: state.date ? state.exerciseTypes : state.lastPlanTypes,
          activeFlowType: null,
        });
      },
      markStepCompleted: (type) => {
        const state = get();
        const pendingIndex = state.exerciseTypes.findIndex(
          (t, i) => t === type && !state.completedIndices.includes(i),
        );
        if (pendingIndex === -1) return state.exerciseTypes.includes(type);
        set({ completedIndices: [...state.completedIndices, pendingIndex] });
        return true;
      },
      setActiveFlowType: (type) => set({ activeFlowType: type }),
      resetPlan: () => set({ date: "", exerciseTypes: [], completedIndices: [], activeFlowType: null, lastPlanTypes: [] }),
    }),
    {
      name: "daily-plan-store",
      storage: createJSONStorage(() => userScopedStorageAdapter),
      version: 2,
      migrate: (persisted, version) => {
        const state = persisted as Partial<DailyPlanState> & { completedTypes?: string[] };
        if (version >= 2) return state as DailyPlanState;
        // v1 keyed completion by type; map each completed type onto its first
        // occurrence so a mid-day upgrade doesn't lose today's progress.
        const types = state.exerciseTypes ?? [];
        const completedIndices = (state.completedTypes ?? [])
          .map((t) => types.indexOf(t))
          .filter((i) => i >= 0);
        const { completedTypes: _dropped, ...rest } = state;
        return { ...rest, completedIndices } as DailyPlanState;
      },
      partialize: (state) => {
        const { activeFlowType: _activeFlowType, ...persisted } = state;
        return persisted;
      },
    },
  ),
);
