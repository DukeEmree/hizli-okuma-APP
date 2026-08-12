// @ts-ignore
import { expect, test, describe } from 'bun:test';
import { renderHook } from '@testing-library/react-hooks';
import { useChunkingEngine } from "@/features/exercises/chunking/useChunkingEngine";

// Shared mocks (react-native-mmkv, @amplitude/analytics-react-native)
// are registered in test-setup.ts via bunfig.toml's [test].preload.

describe('ChunkingEngine', () => {
  test('should parse chunks correctly', () => {
    const { result } = renderHook(() => useChunkingEngine({
      wpm: 300,
      chunkSize: 2,
      text: 'A B C D E'
    }));

    // Kelimeler: A, B, C, D, E
    // Chunk size 2: "A B", "C D", "E"
    expect(result.current.chunks).toEqual(['A B', 'C D', 'E']);
    expect(result.current.chunkIndex).toBe(0);
    expect(result.current.currentChunk).toBe('A B');
  });

  test('should parse chunks of size 3', () => {
    const { result } = renderHook(() => useChunkingEngine({
      wpm: 300,
      chunkSize: 3,
      text: 'Bir iki üç dört beş altı'
    }));

    expect(result.current.chunks).toEqual(['Bir iki üç', 'dört beş altı']);
  });
});
