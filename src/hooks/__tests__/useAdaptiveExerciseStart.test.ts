import { expect, test, describe, mock, beforeEach } from "bun:test";
import { renderHook } from '@testing-library/react-hooks';
import { useAdaptiveExerciseStart } from "../useAdaptiveExerciseStart";
import { ExerciseDefinition } from "@/types/exercise";

const mockGetExerciseMetrics = mock(() => ({
  currentDifficulty: 1,
  consecutiveSuccesses: 0,
  consecutiveFailures: 0,
  historicalBestLevel: 1,
}));

mock.module("@/stores/exerciseProgressStore", () => ({
  useExerciseProgressStore: mock((selector) => selector({ getExerciseMetrics: mockGetExerciseMetrics })),
}));

mock.module("@/utils/difficultyMapper", () => ({
  getAdaptiveConfig: mock((type, level) => {
    if (type === 'rsvp') return { wpm: 100 + (level * 50) };
    if (type === 'pacer') return { wpm: 100 + (level * 50) };
    return {};
  }),
  CROSS_EXERCISE_METRICS_SOURCE: { pacer: 'rsvp-reading' },
}));

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
    mockGetExerciseMetrics.mockClear();
    mockGetExerciseMetrics.mockReturnValue({
      currentDifficulty: 1,
      consecutiveSuccesses: 0,
      consecutiveFailures: 0,
      historicalBestLevel: 1,
    });
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
    expect((result.current.config as any)?.wpm).toBe(150); // 100 + (1 * 50)
  });

  test("Uses local progression at a higher level", () => {
    mockGetExerciseMetrics.mockReturnValue({
      currentDifficulty: 3,
      consecutiveSuccesses: 1,
      consecutiveFailures: 0,
      historicalBestLevel: 3,
    });
    const { result } = renderHook(() => useAdaptiveExerciseStart(dummyDef));
    expect(result.current.isReady).toBe(true);
    expect(result.current.progressionState?.currentLevel).toBe(3);
    expect((result.current.config as any)?.wpm).toBe(250); // 100 + (3 * 50)
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
    mockGetExerciseMetrics.mockReturnValue({
      currentDifficulty: 7,
      consecutiveSuccesses: 0,
      consecutiveFailures: 0,
      historicalBestLevel: 7,
    });

    const { result } = renderHook(() => useAdaptiveExerciseStart(pacerDef));

    expect(mockGetExerciseMetrics).toHaveBeenCalledWith('rsvp-reading');
    expect(result.current.progressionState?.currentLevel).toBe(7);
    expect((result.current.config as any)?.wpm).toBe(450); // 100 + (7 * 50)
  });
});
