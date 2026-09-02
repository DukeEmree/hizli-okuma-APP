import { expect, test, describe, beforeEach } from "bun:test";
import { renderHook } from '@testing-library/react-hooks';
import { useAdaptiveExerciseStart } from "../useAdaptiveExerciseStart";
import { ExerciseDefinition } from "@/types/exercise";
import { useExerciseProgressStore } from "@/stores/exerciseProgressStore";

describe("useAdaptiveExerciseStart", () => {
  const dummyDef: ExerciseDefinition = {
    id: "ex-1",
    type: "rsvp",
    category: "reading",
    nameKey: "rsvp.name",
    descriptionKey: "rsvp.description",
    defaultConfig: { wpm: 150 },
    isPremium: false,
  };

  beforeEach(() => {
    useExerciseProgressStore.setState({ exercises: {} });
  });

  test("Returns not ready if definition is undefined", () => {
    const { result } = renderHook(() => useAdaptiveExerciseStart(undefined));
    expect(result.current.isReady).toBe(false);
    expect(result.current.config).toBeNull();
  });

  test("Uses local progression at the default level", () => {
    const { result } = renderHook(() => useAdaptiveExerciseStart(dummyDef));
    expect(result.current.isReady).toBe(true);
    expect(result.current.progressionState?.currentLevel).toBe(1);
    expect((result.current.config as any)?.wpm).toBeGreaterThanOrEqual(150);
  });

  test("Uses local progression at a higher level", () => {
    useExerciseProgressStore.getState().updateExerciseMetrics("ex-1", {
      currentDifficulty: 3,
      consecutiveSuccesses: 1,
      consecutiveFailures: 0,
      historicalBestLevel: 3,
    });
    const { result } = renderHook(() => useAdaptiveExerciseStart(dummyDef));
    expect(result.current.isReady).toBe(true);
    expect(result.current.progressionState?.currentLevel).toBe(3);
    expect((result.current.config as any)?.wpm).toBeGreaterThan(150);
  });

  test("Pacer borrows RSVP's progression instead of its own (can't self-measure accuracy)", () => {
    const pacerDef: ExerciseDefinition = {
      id: "pacer-reading",
      type: "pacer",
      category: "reading",
      nameKey: "pacer.name",
      descriptionKey: "pacer.description",
      defaultConfig: { wpm: 150 },
      isPremium: true,
    };
    useExerciseProgressStore.getState().updateExerciseMetrics("rsvp-reading", {
      currentDifficulty: 7,
      consecutiveSuccesses: 0,
      consecutiveFailures: 0,
      historicalBestLevel: 7,
    });

    const { result } = renderHook(() => useAdaptiveExerciseStart(pacerDef));

    expect(result.current.progressionState?.currentLevel).toBe(7);
    expect((result.current.config as any)?.wpm).toBeGreaterThan(300);
  });
});
