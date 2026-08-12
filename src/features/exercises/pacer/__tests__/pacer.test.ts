// @ts-ignore
import { expect, test, describe } from 'bun:test';
import { renderHook } from '@testing-library/react-hooks';
import { usePacerEngine } from "@/features/exercises/pacer/usePacerEngine";

// Shared mocks (react-native-mmkv, @amplitude/analytics-react-native)
// are registered in test-setup.ts via bunfig.toml's [test].preload.

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
