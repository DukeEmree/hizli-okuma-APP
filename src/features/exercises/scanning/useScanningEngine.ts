import { useState, useCallback, useEffect } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { scanningDefinition } from '.';
import { ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";

export interface ScanningConfig extends Partial<ExerciseConfig> {
  gridSize: number;
  timeLimitMs: number;
  targetSymbol?: string;
  distractorSymbol?: string;
  targetCount?: number;
  rng?: () => number;
}

export interface ScanningCell {
  id: number;
  isTarget: boolean;
  isFound: boolean;
  symbol: string;
}

export function generateScanningGrid(
  size: number, 
  targetCount: number, 
  targetSymbol: string, 
  distractorSymbol: string,
  rng: () => number = Math.random
): ScanningCell[] {
  const total = size * size;
  const cells: ScanningCell[] = Array.from({ length: total }, (_, i) => ({
    id: i,
    isTarget: false,
    isFound: false,
    symbol: distractorSymbol,
  }));

  let placed = 0;
  while (placed < targetCount && placed < total) {
    const idx = Math.floor(rng() * total);
    if (!cells[idx].isTarget) {
      cells[idx].isTarget = true;
      cells[idx].symbol = targetSymbol;
      placed++;
    }
  }

  return cells;
}

export function useScanningEngine(config: ScanningConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();
  
  const targetSymbol = config.targetSymbol || 'B';
  const distractorSymbol = config.distractorSymbol || 'A';
  const targetCount = config.targetCount || 3;

  const [grid, setGrid] = useState<ScanningCell[]>([]);
  const [foundCount, setFoundCount] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [lastCorrectTime, setLastCorrectTime] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGrid(generateScanningGrid(config.gridSize, targetCount, targetSymbol, distractorSymbol, config.rng));
  }, [config.gridSize, targetCount, targetSymbol, distractorSymbol, config.rng]);

  const handleComplete = useCallback((result: ExerciseResult) => {
    const totalClicks = foundCount + errors;
    const _accuracy = totalClicks > 0 ? foundCount / totalClicks : 0;
    const _avgReactionTime = reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 0;

    createSession({
      clientSessionId: result.exerciseId + '-' + Date.now(),
      exerciseId: result.exerciseId,
      exerciseType: result.exerciseType,
      startedAt: result.startedAt,
      completedAt: result.completedAt,
      durationMs: result.durationMs,
      difficulty: result.difficulty,
      score: result.score.finalScore,
      metrics: {
        ...result.metrics,
        reactionTimeMs: reactionTimes,
        errorCount: errors,
        correctCount: foundCount,
      },
      algorithmVersion: CURRENT_ALGORITHM_VERSION,
    }).catch(err => {console.error(err);});

    if (onCompleteCallback) {
      onCompleteCallback(result);
    }
  }, [createSession, foundCount, errors, reactionTimes, onCompleteCallback]);

  const engine = useExerciseEngine(scanningDefinition, config, handleComplete);

  useEffect(() => {
    if (!isCompleted && !isTimeUp && engine.elapsedMs >= config.timeLimitMs) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTimeUp(true);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCompleted(true);
      engine.updateMetrics({ completionRate: foundCount / targetCount });
      engine.complete();
    }
  }, [engine.elapsedMs, config.timeLimitMs, isCompleted, isTimeUp, foundCount, targetCount, engine]);

  const handleCellPress = useCallback((index: number) => {
    if (engine.session.state !== 'running' || isCompleted) return;

    setGrid(prev => {
      const newGrid = [...prev];
      const cell = newGrid[index];

      if (cell.isFound) return prev; // Already found

      if (cell.isTarget) {
        cell.isFound = true;
        const currentReactionTime = engine.elapsedMs - lastCorrectTime;
        setReactionTimes(r => [...r, currentReactionTime]);
        setLastCorrectTime(engine.elapsedMs);
        
        const newFoundCount = foundCount + 1;
        setFoundCount(newFoundCount);

        if (newFoundCount >= targetCount) {
          setIsCompleted(true);
          engine.updateMetrics({ completionRate: 1 });
          engine.complete();
        }
      } else {
        setErrors(e => e + 1);
      }
      return newGrid;
    });
  }, [engine, isCompleted, foundCount, targetCount, lastCorrectTime]);

  const reset = useCallback(() => {
    engine.reset();
    setGrid(generateScanningGrid(config.gridSize, targetCount, targetSymbol, distractorSymbol, config.rng));
    setFoundCount(0);
    setErrors(0);
    setIsCompleted(false);
    setIsTimeUp(false);
    setLastCorrectTime(0);
    setReactionTimes([]);
  }, [engine, config.gridSize, targetCount, targetSymbol, distractorSymbol, config.rng]);

  return {
    ...engine,
    reset,
    grid,
    foundCount,
    targetCount,
    errors,
    isCompleted,
    isTimeUp,
    handleCellPress,
  };
}
