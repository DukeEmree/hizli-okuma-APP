import { expect, test, describe, mock, spyOn, beforeEach, afterAll } from "bun:test";
import { renderHook } from '@testing-library/react-hooks';
import { useExerciseLimits } from "../useExerciseLimits";
import { SUBSCRIPTION_CONSTANTS } from "@/constants/subscription";
import * as streakUtils from "@/utils/streak";

// Mock dependencies
const mockUseRevenueCat = mock(() => ({ isPremium: false, isConfigured: true }));
const mockUseLocalHistoryStore = mock((selector) => selector({ sessions: [] }));

mock.module("@/hooks/useAppState", () => ({
  useAppState: mock(() => 'active')
}));
mock.module("@/providers/RevenueCatProvider", () => ({
  useRevenueCat: mockUseRevenueCat,
}));

mock.module("@/stores/localHistoryStore", () => ({
  useLocalHistoryStore: mockUseLocalHistoryStore,
}));

// Spy on getLocalDateString (rather than mock.module the whole "@/utils/streak"
// module) so this only patches the one export on the shared module object and
// can be restored in afterAll - mock.module() replaces the module process-wide
// for the rest of the bun test run, which previously leaked '2023-01-01' into
// unrelated streak.test.ts assertions running later in the same process.
const getLocalDateStringSpy = spyOn(streakUtils, "getLocalDateString").mockReturnValue('2023-01-01');

describe("useExerciseLimits", () => {

  beforeEach(() => {
    mockUseRevenueCat.mockClear();
    mockUseLocalHistoryStore.mockClear();
  });

  afterAll(() => {
    getLocalDateStringSpy.mockRestore();
  });

  test("Returns loading state when not configured", () => {
    mockUseRevenueCat.mockReturnValue({ isPremium: false, isConfigured: false });

    const { result } = renderHook(() => useExerciseLimits());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.canStartExercise).toBe(false);
  });

  test("Premium user can always start exercise, ignores limits", () => {
    mockUseRevenueCat.mockReturnValue({ isPremium: true, isConfigured: true });
    mockUseLocalHistoryStore.mockImplementation((selector) => selector({ sessions: [] }));

    const { result } = renderHook(() => useExerciseLimits());

    expect(result.current.isPremium).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.canStartExercise).toBe(true);
    expect(result.current.remainingExercises).toBe(Infinity);
  });

  test("Free user with no usage can start exercise", () => {
    mockUseRevenueCat.mockReturnValue({ isPremium: false, isConfigured: true });
    mockUseLocalHistoryStore.mockImplementation((selector) => selector({ sessions: [] }));

    const { result } = renderHook(() => useExerciseLimits());

    expect(result.current.isPremium).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.canStartExercise).toBe(true);
    expect(result.current.remainingExercises).toBe(SUBSCRIPTION_CONSTANTS.FREE_TIER.MAX_DAILY_EXERCISES);
  });

  test("Free user at limit cannot start exercise", () => {
    // Free tier never queries Convex (cloud sync is premium-only), so the
    // daily count comes entirely from the on-device history.
    mockUseRevenueCat.mockReturnValue({ isPremium: false, isConfigured: true });
    const max = SUBSCRIPTION_CONSTANTS.FREE_TIER.MAX_DAILY_EXERCISES;
    mockUseLocalHistoryStore.mockImplementation((selector) => selector({
      sessions: Array.from({ length: max }, () => ({ completedAt: Date.now() })),
    }));

    const { result } = renderHook(() => useExerciseLimits());

    expect(result.current.canStartExercise).toBe(false);
    expect(result.current.remainingExercises).toBe(0);
  });

  test("Guest user with no pending sessions can start", () => {
    mockUseRevenueCat.mockReturnValue({ isPremium: false, isConfigured: true });
    mockUseLocalHistoryStore.mockImplementation((selector) => selector({ sessions: [] }));

    const { result } = renderHook(() => useExerciseLimits());

    expect(result.current.canStartExercise).toBe(true);
    expect(result.current.remainingExercises).toBe(SUBSCRIPTION_CONSTANTS.FREE_TIER.MAX_DAILY_EXERCISES);
  });

  test("Guest user with pending sessions respects limits", () => {
    mockUseRevenueCat.mockReturnValue({ isPremium: false, isConfigured: true });

    // Simulate pending sessions today
    mockUseLocalHistoryStore.mockImplementation((selector) => selector({
      sessions: [
        { completedAt: Date.now() },
        { completedAt: Date.now() }
      ]
    }));

    // getLocalDateString is mocked to return '2023-01-01' for everything
    const { result } = renderHook(() => useExerciseLimits());

    const max = SUBSCRIPTION_CONSTANTS.FREE_TIER.MAX_DAILY_EXERCISES;
    expect(result.current.remainingExercises).toBe(Math.max(0, max - 2));
    expect(result.current.canStartExercise).toBe(max > 2);
  });

  test("Free user only counts local history", () => {
    mockUseRevenueCat.mockReturnValue({ isPremium: false, isConfigured: true });

    // 2 pending from local
    mockUseLocalHistoryStore.mockImplementation((selector) => selector({
      sessions: [
        { completedAt: Date.now() },
        { completedAt: Date.now() }
      ]
    }));

    const { result } = renderHook(() => useExerciseLimits());

    const max = SUBSCRIPTION_CONSTANTS.FREE_TIER.MAX_DAILY_EXERCISES;
    expect(result.current.remainingExercises).toBe(Math.max(0, max - 2));
  });

});
