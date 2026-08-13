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

  test('chunks never span a sentence/clause boundary', () => {
    const { result } = renderHook(() => useChunkingEngine({
      wpm: 300,
      chunkSize: 2,
      // "artırır." ends a sentence right before "Gözleriniz" starts the
      // next one - a naive fixed-size window would glue them into one
      // chunk ("artırır. Gözleriniz"), which reads as two unrelated words.
      text: 'Kelime gruplama tekniği okuma hızınızı önemli ölçüde artırır. Gözleriniz her kelime için ayrı ayrı duraklamak yerine, birkaç kelimeyi tek bir bakışta kavrar.'
    }));

    for (const chunk of result.current.chunks) {
      // A chunk may end with sentence/clause punctuation, but must never
      // contain one in the middle (i.e. straddle a boundary).
      expect(chunk.slice(0, -1)).not.toMatch(/[,;:.!?…]/);
    }
    expect(result.current.chunks).toContain('ölçüde artırır.');
    expect(result.current.chunks).toContain('Gözleriniz her');
  });
});
