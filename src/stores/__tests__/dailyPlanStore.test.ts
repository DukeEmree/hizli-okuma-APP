import { expect, test, describe, beforeEach } from "bun:test";
import { useDailyPlanStore } from "../dailyPlanStore";

describe("useDailyPlanStore", () => {
  beforeEach(() => {
    useDailyPlanStore.setState({
      date: "",
      exerciseTypes: [],
      completedIndices: [],
      lastPlanTypes: [],
      activeFlowType: null,
    });
  });

  test("markStepCompleted marks a plan step done regardless of activeFlowType", () => {
    useDailyPlanStore.setState({ exerciseTypes: ["rsvp", "schulte"], completedIndices: [] });

    const wasStep = useDailyPlanStore.getState().markStepCompleted("schulte");

    expect(wasStep).toBe(true);
    expect(useDailyPlanStore.getState().completedIndices).toEqual([1]);
  });

  test("markStepCompleted returns false and doesn't touch completion for a non-plan type", () => {
    useDailyPlanStore.setState({ exerciseTypes: ["rsvp"], completedIndices: [] });

    const wasStep = useDailyPlanStore.getState().markStepCompleted("schulte");

    expect(wasStep).toBe(false);
    expect(useDailyPlanStore.getState().completedIndices).toEqual([]);
  });

  test("a repeated step completes one row at a time", () => {
    useDailyPlanStore.setState({ exerciseTypes: ["pacer", "pacer", "rsvp"], completedIndices: [] });

    expect(useDailyPlanStore.getState().markStepCompleted("pacer")).toBe(true);
    expect(useDailyPlanStore.getState().completedIndices).toEqual([0]);

    expect(useDailyPlanStore.getState().markStepCompleted("pacer")).toBe(true);
    expect(useDailyPlanStore.getState().completedIndices).toEqual([0, 1]);

    // Both rows are done now - a third completion must not invent an index.
    expect(useDailyPlanStore.getState().markStepCompleted("pacer")).toBe(true);
    expect(useDailyPlanStore.getState().completedIndices).toEqual([0, 1]);
  });

  test("ensureTodayPlan resets activeFlowType when regenerating a new day's plan", () => {
    useDailyPlanStore.setState({ date: "2026-08-12", exerciseTypes: ["rsvp"], activeFlowType: "rsvp" });

    useDailyPlanStore.getState().ensureTodayPlan("2026-08-13", () => ["schulte", "scanning"]);

    const state = useDailyPlanStore.getState();
    expect(state.exerciseTypes).toEqual(["schulte", "scanning"]);
    expect(state.activeFlowType).toBeNull();
  });

  test("ensureTodayPlan keeps today's plan and its progress", () => {
    useDailyPlanStore.setState({
      date: "2026-08-13",
      exerciseTypes: ["rsvp", "schulte"],
      completedIndices: [0],
    });

    useDailyPlanStore.getState().ensureTodayPlan("2026-08-13", () => ["pacer", "keyword"]);

    const state = useDailyPlanStore.getState();
    expect(state.exerciseTypes).toEqual(["rsvp", "schulte"]);
    expect(state.completedIndices).toEqual([0]);
  });

  test("ensureTodayPlan regenerates a persisted plan that contains a duplicate step", () => {
    // What an older build wrote to MMKV: the generator was fixed, the stored
    // plan wasn't, and same-day plans are otherwise never recomputed.
    useDailyPlanStore.setState({
      date: "2026-08-13",
      exerciseTypes: ["peripheral", "pacer", "pacer", "keyword"],
      completedIndices: [1],
    });

    useDailyPlanStore
      .getState()
      .ensureTodayPlan("2026-08-13", () => ["peripheral", "rsvp", "pacer", "keyword"]);

    const state = useDailyPlanStore.getState();
    expect(state.exerciseTypes).toEqual(["peripheral", "rsvp", "pacer", "keyword"]);
    expect(state.completedIndices).toEqual([]);
  });

  test("setActiveFlowType stores the step currently running through the daily-plan flow", () => {
    useDailyPlanStore.getState().setActiveFlowType("rsvp");
    expect(useDailyPlanStore.getState().activeFlowType).toBe("rsvp");

    useDailyPlanStore.getState().setActiveFlowType(null);
    expect(useDailyPlanStore.getState().activeFlowType).toBeNull();
  });
});
