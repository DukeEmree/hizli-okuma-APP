// @ts-ignore
import { expect, test, describe } from 'bun:test';
import { renderHook, act } from '@testing-library/react-hooks';
import { useSchulteEngine, generateSchulteGrid } from "@/features/exercises/schulte/useSchulteEngine";

// Shared mocks (react-native-mmkv, @amplitude/analytics-react-native)
// are registered in test-setup.ts via bunfig.toml's [test].preload.

describe('SchulteEngine', () => {
  test('should generate grid with correct size', () => {
    const grid = generateSchulteGrid(3); // 3x3 = 9
    expect(grid.length).toBe(9);
    expect(grid.includes(1)).toBe(true);
    expect(grid.includes(9)).toBe(true);
  });

  test('should initialize and handle correct clicks', () => {
    // Deterministic random
    let i = 0;
    const mockRng = () => { i++; return (i % 10) / 10; };

    const { result } = renderHook(() => useSchulteEngine({
      gridSize: 3, // 1 to 9
      timeLimitMs: 60000,
      rng: mockRng,
    }));

    expect(result.current.expectedNumber).toBe(1);

    act(() => {
      result.current.start();
    });
    act(() => {
      result.current.handleNumberPress(1);
    });

    expect(result.current.expectedNumber).toBe(2);
    expect(result.current.errors).toBe(0);
  });

  test('should handle incorrect clicks and log errors', () => {
    const { result } = renderHook(() => useSchulteEngine({
      gridSize: 3,
      timeLimitMs: 60000,
    }));

    act(() => {
      result.current.start();
    });
    act(() => {
      result.current.handleNumberPress(5); // Wrong, expected 1
    });

    expect(result.current.expectedNumber).toBe(1);
    expect(result.current.errors).toBe(1);
  });
});
