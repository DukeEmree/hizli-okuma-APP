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

  // gridSize N means an N x N table (N*N numbers), not N numbers - each
  // "solve" below presses every number from 1 to the table's current size
  // squared, one per act() so state (expectedNumber, level) commits between
  // presses like real taps would.
  function solveTable(result: { current: { handleNumberPress: (n: number) => void; gridSize: number } }) {
    const total = result.current.gridSize * result.current.gridSize;
    for (let n = 1; n <= total; n++) {
      act(() => { result.current.handleNumberPress(n); });
    }
  }

  test('solving a table starts the next one instead of ending the session', () => {
    const { result } = renderHook(() => useSchulteEngine({
      gridSize: 2,
      timeLimitMs: 60000,
      rng: () => 0,
    }));

    act(() => { result.current.start(); });
    solveTable(result);

    expect(result.current.isCompleted).toBe(false);
    expect(result.current.roundsCompleted).toBe(1);
    expect(result.current.expectedNumber).toBe(1);
    expect(result.current.totalCorrect).toBe(4);
  });

  test('two clean tables in a row raise the grid size, a single one does not', () => {
    const { result } = renderHook(() => useSchulteEngine({
      gridSize: 3,
      timeLimitMs: 60000,
      rng: () => 0,
    }));

    act(() => { result.current.start(); });
    solveTable(result);
    expect(result.current.gridSize).toBe(3);

    solveTable(result);
    expect(result.current.gridSize).toBe(4);
  });

  test('two tables with an error in a row lower the grid size', () => {
    const { result } = renderHook(() => useSchulteEngine({
      gridSize: 4,
      timeLimitMs: 60000,
      rng: () => 0,
    }));

    act(() => { result.current.start(); });
    for (let round = 0; round < 2; round++) {
      act(() => { result.current.handleNumberPress(99); }); // wrong tap, expected 1
      solveTable(result);
    }

    expect(result.current.gridSize).toBe(3);
    expect(result.current.errors).toBe(2);
  });

  test('a wrong tap mid-table restarts that table from 1 instead of carrying progress over', () => {
    const { result } = renderHook(() => useSchulteEngine({
      gridSize: 3,
      timeLimitMs: 60000,
      rng: () => 0,
    }));

    act(() => { result.current.start(); });
    act(() => { result.current.handleNumberPress(1); });
    act(() => { result.current.handleNumberPress(2); });
    act(() => { result.current.handleNumberPress(3); });
    expect(result.current.expectedNumber).toBe(4);

    act(() => { result.current.handleNumberPress(5); }); // wrong, expected 4

    expect(result.current.expectedNumber).toBe(1);
    expect(result.current.errors).toBe(1);
    expect(result.current.roundsCompleted).toBe(0);
  });
});
