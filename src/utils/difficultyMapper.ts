import { DifficultyLevel } from "@/types/exercise";
import { RSVPConfig } from "@/features/exercises/rsvp/useRSVPEngine";
import { ChunkingConfig } from "@/features/exercises/chunking/useChunkingEngine";
import { PacerConfig } from "@/features/exercises/pacer/usePacerEngine";
import { SchulteConfig } from "@/features/exercises/schulte/useSchulteEngine";
import { ScanningConfig } from "@/features/exercises/scanning/useScanningEngine";

/**
 * RSVP: Level 1 = 150 WPM
 * Level 10 = 600 WPM
 * Increment: 50 WPM per level
 */
export function getRSVPConfig(level: DifficultyLevel): Partial<RSVPConfig> {
  const wpm = 100 + (level * 50);
  return {
    wpm,
  };
}

/**
 * Chunking: 
 * Level 1 = 150 WPM, Chunk Size 1
 * Level 10 = 600 WPM, Chunk Size 4
 */
export function getChunkingConfig(level: DifficultyLevel): Partial<ChunkingConfig> {
  const wpm = 100 + (level * 50);
  let chunkSize = 2;
  if (level <= 3) chunkSize = 1;
  else if (level <= 6) chunkSize = 2;
  else if (level <= 8) chunkSize = 3;
  else chunkSize = 4;

  return {
    wpm,
    chunkSize
  };
}

/**
 * Pacer:
 * Level 1 = 150 WPM, Line Mode
 * Level 10 = 600 WPM, Word Mode
 */
export function getPacerConfig(level: DifficultyLevel): Partial<PacerConfig> {
  const wpm = 100 + (level * 50);
  const highlightMode = level > 5 ? 'word' : 'line';

  return {
    wpm,
    highlightMode
  };
}

/**
 * Schulte:
 * Level 1-2 = 3x3
 * Level 3-5 = 4x4
 * Level 6-8 = 5x5
 * Level 9-10 = 6x6
 */
export function getSchulteConfig(level: DifficultyLevel): Partial<SchulteConfig> {
  let gridSize = 4;
  if (level <= 2) gridSize = 3;
  else if (level <= 5) gridSize = 4;
  else if (level <= 8) gridSize = 5;
  else gridSize = 6;

  return {
    gridSize,
    numberRange: gridSize * gridSize
  };
}

/**
 * Scanning:
 * Grid Size increases, distractor count increases.
 */
export function getScanningConfig(level: DifficultyLevel): Partial<ScanningConfig> {
  let gridSize = 4;
  if (level <= 3) gridSize = 4;
  else if (level <= 6) gridSize = 5;
  else if (level <= 8) gridSize = 6;
  else gridSize = 7;

  const targetCount = Math.min(3 + Math.floor(level / 2), 7);
  const totalCells = gridSize * gridSize;
  const distractorCount = totalCells - targetCount;

  return {
    gridSize,
    targetCount,
    distractorCount
  };
}

export function getAdaptiveConfig(type: string, level: DifficultyLevel): any {
  switch (type) {
    case 'rsvp': return getRSVPConfig(level);
    case 'chunking': return getChunkingConfig(level);
    case 'pacer': return getPacerConfig(level);
    case 'schulte': return getSchulteConfig(level);
    case 'scanning': return getScanningConfig(level);
    default: return {};
  }
}
