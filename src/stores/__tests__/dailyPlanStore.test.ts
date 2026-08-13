import { expect, test, describe, beforeEach } from "bun:test";
import { useDailyPlanStore } from "../dailyPlanStore";

describe("useDailyPlanStore", () => {
  beforeEach(() => {
    useDailyPlanStore.setState({
      date: "",
      exerciseTypes: [],
      completedTypes: [],
      lastPlanTypes: [],
      activeFlowType: null,
    });
  });

  test("markStepCompleted marks a plan step done regardless of activeFlowType", () => {
    useDailyPlanStore.setState({ exerciseTypes: ["rsvp", "schulte"], completedTypes: [] });

    const wasStep = useDailyPlanStore.getState().markStepCompleted("schulte");

    expect(wasStep).toBe(true);
    expect(useDailyPlanStore.getState().completedTypes).toEqual(["schulte"]);
  });

  test("markStepCompleted returns false and doesn't touch completedTypes for a non-plan type", () => {
    useDailyPlanStore.setState({ exerciseTypes: ["rsvp"], completedTypes: [] });

    const wasStep = useDailyPlanStore.getState().markStepCompleted("schulte");

    expect(wasStep).toBe(false);
    expect(useDailyPlanStore.getState().completedTypes).toEqual([]);
  });

  test("ensureTodayPlan resets activeFlowType when regenerating a new day's plan", () => {
    useDailyPlanStore.setState({ date: "2026-08-12", exerciseTypes: ["rsvp"], activeFlowType: "rsvp" });

    useDailyPlanStore.getState().ensureTodayPlan("2026-08-13", () => ["schulte", "scanning"]);

    const state = useDailyPlanStore.getState();
    expect(state.exerciseTypes).toEqual(["schulte", "scanning"]);
    expect(state.activeFlowType).toBeNull();
  });

  test("setActiveFlowType stores the step currently running through the daily-plan flow", () => {
    useDailyPlanStore.getState().setActiveFlowType("rsvp");
    expect(useDailyPlanStore.getState().activeFlowType).toBe("rsvp");

    useDailyPlanStore.getState().setActiveFlowType(null);
    expect(useDailyPlanStore.getState().activeFlowType).toBeNull();
  });
});
