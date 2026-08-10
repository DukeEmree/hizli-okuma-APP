import { expect, test, describe, mock, beforeEach } from "bun:test";
import { renderHook } from '@testing-library/react-hooks';
import { useExerciseLimits } from "../useExerciseLimits";
import { SUBSCRIPTION_CONSTANTS } from "@/constants/subscription";

// Mock dependencies
const mockUseRevenueCat = mock(() => ({ isPremium: false, isConfigured: true }));
const mockUseQuery = mock((query?: any, args?: any): any => null);
const mockUseSyncStore = mock((selector) => selector({ pendingSessions: [] }));

mock.module("@/hooks/useAppState", () => ({
  useAppState: mock(() => 'active')
}));
mock.module("@/providers/RevenueCatProvider", () => ({
  useRevenueCat: mockUseRevenueCat,
}));

mock.module("convex/react", () => ({
  useQuery: mockUseQuery,
}));

mock.module("@/stores/syncStore", () => ({
  useSyncStore: mockUseSyncStore,
}));

// Provide a mock for getLocalDateString that just returns '2023-01-01' for testing
mock.module("@/utils/streak", () => ({
  getLocalDateString: () => '2023-01-01',
}));

describe("useExerciseLimits", () => {
  
  beforeEach(() => {
    mockUseRevenueCat.mockClear();
    mockUseQuery.mockClear();
    mockUseSyncStore.mockClear();
  });

  test("Returns loading state when not configured or stats are undefined", () => {
    mockUseRevenueCat.mockReturnValue({ isPremium: false, isConfigured: false });
    mockUseQuery.mockReturnValue(undefined);
    
    const { result } = renderHook(() => useExerciseLimits());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.canStartExercise).toBe(false);
  });

  test("Premium user can always start exercise, ignores limits", () => {
    mockUseRevenueCat.mockReturnValue({ isPremium: true, isConfigured: true });
    // Even if they have 100 sessions today, premium ignores it
    mockUseQuery.mockReturnValue({
      dailyTrends: [{ date: '2023-01-01', sessionCount: 100 }]
    });
    mockUseSyncStore.mockImplementation((selector) => selector({ pendingSessions: [] }));
    
    const { result } = renderHook(() => useExerciseLimits());
    
    expect(result.current.isPremium).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.canStartExercise).toBe(true);
    expect(result.current.remainingExercises).toBe(Infinity);
  });

  test("Free user with no usage can start exercise", () => {
    mockUseRevenueCat.mockReturnValue({ isPremium: false, isConfigured: true });
    mockUseQuery.mockReturnValue({
      dailyTrends: [{ date: '2023-01-01', sessionCount: 0 }]
    });
    mockUseSyncStore.mockImplementation((selector) => selector({ pendingSessions: [] }));
    
    const { result } = renderHook(() => useExerciseLimits());
    
    expect(result.current.isPremium).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.canStartExercise).toBe(true);
    expect(result.current.remainingExercises).toBe(SUBSCRIPTION_CONSTANTS.FREE_TIER.MAX_DAILY_EXERCISES);
  });

  test("Free user at limit cannot start exercise", () => {
    mockUseRevenueCat.mockReturnValue({ isPremium: false, isConfigured: true });
    mockUseQuery.mockReturnValue({
      dailyTrends: [{ date: '2023-01-01', sessionCount: SUBSCRIPTION_CONSTANTS.FREE_TIER.MAX_DAILY_EXERCISES }]
    });
    mockUseSyncStore.mockImplementation((selector) => selector({ pendingSessions: [] }));
    
    const { result } = renderHook(() => useExerciseLimits());
    
    expect(result.current.canStartExercise).toBe(false);
    expect(result.current.remainingExercises).toBe(0);
  });

  test("Guest user (null stats) with no pending sessions can start", () => {
    mockUseRevenueCat.mockReturnValue({ isPremium: false, isConfigured: true });
    mockUseQuery.mockReturnValue(null); // Guest behavior
    mockUseSyncStore.mockImplementation((selector) => selector({ pendingSessions: [] }));
    
    const { result } = renderHook(() => useExerciseLimits());
    
    expect(result.current.canStartExercise).toBe(true);
    expect(result.current.remainingExercises).toBe(SUBSCRIPTION_CONSTANTS.FREE_TIER.MAX_DAILY_EXERCISES);
  });

  test("Guest user (null stats) with pending sessions respects limits", () => {
    mockUseRevenueCat.mockReturnValue({ isPremium: false, isConfigured: true });
    mockUseQuery.mockReturnValue(null); // Guest behavior
    
    // Simulate pending sessions today
    mockUseSyncStore.mockImplementation((selector) => selector({ 
      pendingSessions: [
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

  test("Combines server sessions and pending sessions correctly", () => {
    mockUseRevenueCat.mockReturnValue({ isPremium: false, isConfigured: true });
    mockUseQuery.mockReturnValue({
      dailyTrends: [{ date: '2023-01-01', sessionCount: 2 }] // 2 from server
    });
    
    // 2 pending from local
    mockUseSyncStore.mockImplementation((selector) => selector({ 
      pendingSessions: [
        { completedAt: Date.now() },
        { completedAt: Date.now() }
      ] 
    }));
    
    const { result } = renderHook(() => useExerciseLimits());
    
    const max = SUBSCRIPTION_CONSTANTS.FREE_TIER.MAX_DAILY_EXERCISES;
    expect(result.current.remainingExercises).toBe(Math.max(0, max - 4));
  });

});
