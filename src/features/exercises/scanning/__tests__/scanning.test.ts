// @ts-ignore
import { expect, test, describe } from 'bun:test';
import { renderHook, act } from '@testing-library/react-hooks';
import { useScanningEngine, generateScanningGrid } from "@/features/exercises/scanning/useScanningEngine";

// Shared mocks (react-native-mmkv, @amplitude/analytics-react-native)
// are registered in test-setup.ts via bunfig.toml's [test].preload.

describe('ScanningEngine', () => {
  test('should generate grid with specific target count', () => {
    // 3x3 = 9 cells, 2 targets
    const grid = generateScanningGrid(3, 2, 'B', 'A'); 
    
    expect(grid.length).toBe(9);
    
    const targetCount = grid.filter(c => c.isTarget).length;
    expect(targetCount).toBe(2);
    
    const distractorCount = grid.filter(c => !c.isTarget).length;
    expect(distractorCount).toBe(7);
  });

  test('should handle target clicks correctly', () => {
    // Deterministic random
    let i = 0;
    const mockRng = () => { i++; return (i % 9) / 9; };

    const { result } = renderHook(() => useScanningEngine({
      gridSize: 3, 
      targetCount: 2,
      targetSymbol: 'B',
      distractorSymbol: 'A',
      timeLimitMs: 60000,
      rng: mockRng,
    }));

    act(() => {
      result.current.start();
    });

    const targetIdx = result.current.grid.findIndex(c => c.isTarget);
    expect(targetIdx).toBeGreaterThanOrEqual(0);

    act(() => {
      result.current.handleCellPress(targetIdx);
    });

    expect(result.current.foundCount).toBe(1);
    expect(result.current.errors).toBe(0);
    expect(result.current.grid[targetIdx].isFound).toBe(true);
  });

  test('should increment errors on distractor click', () => {
    let i = 0;
    const mockRng = () => { i++; return (i % 9) / 9; };

    const { result } = renderHook(() => useScanningEngine({
      gridSize: 3,
      targetCount: 1,
      timeLimitMs: 60000,
      rng: mockRng,
    }));

    act(() => {
      result.current.start();
    });

    const distractorIdx = result.current.grid.findIndex(c => !c.isTarget);
    
    act(() => {
      result.current.handleCellPress(distractorIdx);
    });

    expect(result.current.errors).toBe(1);
    expect(result.current.foundCount).toBe(0);
  });

  test('reaching the round target starts a new round instead of ending the exercise', () => {
    let i = 0;
    const mockRng = () => { i++; return (i % 9) / 9; };

    const { result } = renderHook(() => useScanningEngine({
      gridSize: 3,
      targetCount: 1,
      timeLimitMs: 60000,
      rng: mockRng,
    }));

    act(() => {
      result.current.start();
    });

    const targetIdx = result.current.grid.findIndex(c => c.isTarget);
    act(() => {
      result.current.handleCellPress(targetIdx);
    });

    // Round target (1) reached: exercise keeps running with a fresh grid
    // instead of completing, and the difficulty ramp raises next round's target.
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.session.state).toBe('running');
    expect(result.current.roundsCompleted).toBe(1);
    expect(result.current.roundTargetCount).toBe(2);
    expect(result.current.foundCount).toBe(1);
    expect(result.current.grid.some(c => c.isFound)).toBe(false);
  });
});
