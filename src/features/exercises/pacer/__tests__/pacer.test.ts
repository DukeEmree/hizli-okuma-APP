// @ts-ignore
import { expect, test, describe, mock } from 'bun:test';
import { renderHook } from '@testing-library/react-hooks';
import { usePacerEngine } from "@/features/exercises/pacer/usePacerEngine";

mock.module('convex/react', () => {
  return {
    useMutation: () => () => Promise.resolve(),
  };
});

describe('PacerEngine', () => {
  test('should initialize and hold words', () => {
    const { result } = renderHook(() => usePacerEngine({
      wpm: 200,
      text: 'Görsel yönlendirici testi'
    }));

    expect(result.current.words).toEqual(['Görsel', 'yönlendirici', 'testi']);
    expect(result.current.highlightIndex).toBe(0);
  });
});
