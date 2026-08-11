// @ts-ignore
import { expect, test, describe } from 'bun:test';
import { pickByDifficulty } from "@/features/exercises/contentSelection";

interface Item {
  id: string;
  difficulty: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

const pool: Item[] = [
  { id: 'a', difficulty: 1 },
  { id: 'b', difficulty: 2 },
  { id: 'c', difficulty: 8 },
  { id: 'd', difficulty: 9 },
];

describe('pickByDifficulty', () => {
  test('only picks items within proximity of current difficulty', () => {
    for (let i = 0; i < 20; i++) {
      const picked = pickByDifficulty(pool, 1);
      expect(['a', 'b']).toContain(picked.id);
    }
  });

  test('falls back to full pool when no item is within proximity', () => {
    for (let i = 0; i < 20; i++) {
      const picked = pickByDifficulty(pool, 5);
      expect(['a', 'b', 'c', 'd']).toContain(picked.id);
    }
  });

  test('excludes recently shown ids', () => {
    for (let i = 0; i < 20; i++) {
      const picked = pickByDifficulty(pool, 1, ['a']);
      expect(picked.id).toBe('b');
    }
  });

  test('falls back to candidates when all of them were recently shown', () => {
    for (let i = 0; i < 20; i++) {
      const picked = pickByDifficulty(pool, 1, ['a', 'b']);
      expect(['a', 'b']).toContain(picked.id);
    }
  });
});
