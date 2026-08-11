import { DifficultyLevel } from "@/types/exercise";

export function pickByDifficulty<T extends { id: string; difficulty: DifficultyLevel }>(
  pool: T[],
  currentDifficulty: DifficultyLevel,
  recentIds: string[] = [],
  proximity = 2
): T {
  const nearby = pool.filter(item => Math.abs(item.difficulty - currentDifficulty) <= proximity);
  const candidates = nearby.length > 0 ? nearby : pool;

  const fresh = candidates.filter(item => !recentIds.includes(item.id));
  const finalCandidates = fresh.length > 0 ? fresh : candidates;

  return finalCandidates[Math.floor(Math.random() * finalCandidates.length)];
}
