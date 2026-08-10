import { expect, test, describe, mock, beforeEach } from "bun:test";
import { renderHook } from '@testing-library/react-hooks';
import { useAdaptiveExerciseStart } from "../useAdaptiveExerciseStart";
import { ExerciseDefinition } from "@/types/exercise";

// Mock dependencies
const mockUseAuth = mock(() => ({ isSignedIn: true, isLoaded: true }));
const mockUseQuery = mock((query?: any, args?: any): any => null);
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
    return {};
  }),
}));

mock.module("@clerk/clerk-expo", () => ({
  useAuth: mockUseAuth,
}));

mock.module("convex/react", () => ({
  useQuery: mockUseQuery,
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
    mockUseAuth.mockClear();
    mockUseQuery.mockClear();
    mockGetExerciseMetrics.mockClear();
  });

  test("Returns not ready if auth is not loaded", () => {
    mockUseAuth.mockReturnValue({ isSignedIn: false, isLoaded: false });
    mockUseQuery.mockReturnValue(undefined);
    
    const { result } = renderHook(() => useAdaptiveExerciseStart(dummyDef));
    
    expect(result.current.isReady).toBe(false);
    expect(result.current.config).toBeNull();
  });

  test("Returns not ready if definition is undefined", () => {
    mockUseAuth.mockReturnValue({ isSignedIn: true, isLoaded: true });
    
    const { result } = renderHook(() => useAdaptiveExerciseStart(undefined));
    
    expect(result.current.isReady).toBe(false);
  });

  test("Guest user uses local progression", () => {
    mockUseAuth.mockReturnValue({ isSignedIn: false, isLoaded: true });
    // Local metrics will return currentDifficulty = 1
    
    const { result } = renderHook(() => useAdaptiveExerciseStart(dummyDef));
    
    expect(result.current.isReady).toBe(true);
    expect(result.current.progressionState?.currentLevel).toBe(1);
    expect((result.current.config as any)?.wpm).toBe(150); // 100 + (1 * 50)
  });

  test("Authenticated user fetches remote progression and applies adaptive difficulty", () => {
    mockUseAuth.mockReturnValue({ isSignedIn: true, isLoaded: true });
    
    // Simulate remote progression at level 3
    mockUseQuery.mockReturnValue({
      currentLevel: 3,
      consecutiveSuccesses: 1,
      consecutiveFailures: 0,
      historicalBest: 3
    });
    
    const { result } = renderHook(() => useAdaptiveExerciseStart(dummyDef));
    
    expect(result.current.isReady).toBe(true);
    expect(result.current.progressionState?.currentLevel).toBe(3);
    // Level 3 RSVP -> 100 + (3 * 50) = 250 WPM
    expect((result.current.config as any)?.wpm).toBe(250); 
  });

  test("Authenticated user falls back to local if remote is null (e.g. backend sync delay)", () => {
    mockUseAuth.mockReturnValue({ isSignedIn: true, isLoaded: true });
    
    // Return null from remote to trigger local fallback
    mockUseQuery.mockReturnValue(null);
    mockGetExerciseMetrics.mockReturnValue({
      currentDifficulty: 2,
      consecutiveSuccesses: 0,
      consecutiveFailures: 0,
      historicalBestLevel: 2,
    });
    
    const { result } = renderHook(() => useAdaptiveExerciseStart(dummyDef));
    
    expect(result.current.isReady).toBe(true);
    expect(result.current.progressionState?.currentLevel).toBe(2);
    expect((result.current.config as any)?.wpm).toBe(200); 
  });

});
