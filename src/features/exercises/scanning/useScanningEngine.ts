import { useState, useCallback, useEffect, useRef } from 'react';
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

  // Guard against duplicate execution for rapid touches or StrictMode
  const foundCellIds = useRef<Set<number>>(new Set());
  const isCompletedRef = useRef(false);

  // We keep refs of current values to use in onTick without stale closures
  const stateRefs = useRef({
    foundCount: 0,
    errors: 0,
    reactionTimes: [] as number[],
  });
  
  // Sync state to refs for onTick
  useEffect(() => {
    stateRefs.current = { foundCount, errors, reactionTimes };
  }, [foundCount, errors, reactionTimes]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGrid(generateScanningGrid(config.gridSize, targetCount, targetSymbol, distractorSymbol, config.rng));
  }, [config.gridSize, targetCount, targetSymbol, distractorSymbol, config.rng]);

  const handleComplete = useCallback((result: ExerciseResult) => {
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
        reactionTimeMs: stateRefs.current.reactionTimes,
        errorCount: stateRefs.current.errors,
        correctCount: stateRefs.current.foundCount,
      },
      algorithmVersion: CURRENT_ALGORITHM_VERSION,
    }, result).catch(err => {console.error(err);});

    if (onCompleteCallback) {
      onCompleteCallback(result);
    }
  }, [createSession, onCompleteCallback]);

  const engine = useExerciseEngine(scanningDefinition, config, handleComplete);

  // Use an effect to watch the elapsed time for time limits. 
  // The isCompletedRef guarantees this only fires once, even in StrictMode.
  useEffect(() => {
    if (!isCompletedRef.current && engine.elapsedMs >= config.timeLimitMs) {
      isCompletedRef.current = true;
      setIsTimeUp(true);
      setIsCompleted(true);
      engine.updateMetrics({
        completionRate: stateRefs.current.foundCount / targetCount,
        correctCount: stateRefs.current.foundCount,
        errorCount: stateRefs.current.errors,
        reactionTimeMs: stateRefs.current.reactionTimes,
      });
      engine.complete();
    }
  }, [engine, engine.elapsedMs, config.timeLimitMs, targetCount]);

  const handleCellPress = useCallback((index: number) => {
    if (engine.session.state !== 'running' || isCompletedRef.current) return;

    const cell = grid[index];
    if (!cell) return;

    if (cell.isTarget) {
      if (foundCellIds.current.has(index)) return; // Prevent duplicate updates for same cell
      foundCellIds.current.add(index);
      const newFoundCount = foundCellIds.current.size;

      // Update grid purely
      setGrid(prev => {
        const newGrid = [...prev];
        newGrid[index] = { ...newGrid[index], isFound: true };
        return newGrid;
      });

      // Calculate and update metrics purely
      const currentReactionTime = engine.elapsedMs - lastCorrectTime;
      const newReactionTimes = [...reactionTimes, currentReactionTime];
      
      setReactionTimes(newReactionTimes);
      setLastCorrectTime(engine.elapsedMs);
      setFoundCount(newFoundCount);

      // Side Effect: Trigger completion if done
      if (newFoundCount >= targetCount && targetCount > 0 && !isCompletedRef.current) {
        isCompletedRef.current = true;
        setIsCompleted(true);
        engine.updateMetrics({
          completionRate: 1,
          correctCount: newFoundCount,
          errorCount: errors,
          reactionTimeMs: newReactionTimes,
        });
        engine.complete();
      }
    } else {
      setErrors(e => e + 1);
    }
  }, [engine, grid, lastCorrectTime, reactionTimes, errors, targetCount]);

  const reset = useCallback(() => {
    engine.reset();
    setGrid(generateScanningGrid(config.gridSize, targetCount, targetSymbol, distractorSymbol, config.rng));
    setFoundCount(0);
    setErrors(0);
    setIsCompleted(false);
    setIsTimeUp(false);
    setLastCorrectTime(0);
    setReactionTimes([]);
    foundCellIds.current.clear();
    isCompletedRef.current = false;
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

