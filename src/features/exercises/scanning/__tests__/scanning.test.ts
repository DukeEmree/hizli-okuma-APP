// @ts-ignore
import { expect, test, describe, mock } from 'bun:test';
import { renderHook, act } from '@testing-library/react-hooks';
import { useScanningEngine, generateScanningGrid } from "@/features/exercises/scanning/useScanningEngine";

mock.module('convex/react', () => {
  return {
    useMutation: () => () => Promise.resolve(),
  };
});

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
});
