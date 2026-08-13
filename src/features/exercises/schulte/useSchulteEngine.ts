import { useState, useCallback, useEffect, useRef } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { schulteDefinition } from '.';
import { ExerciseConfig, ExerciseMetrics, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";

export interface SchulteConfig extends Partial<ExerciseConfig> {
  gridSize: number;
  timeLimitMs: number;
  rng?: () => number; // Deterministic tests için random generator
}

// Saf (pure) randomizasyon fonksiyonu
export function generateSchulteGrid(size: number, rng: () => number = Math.random): number[] {
  const totalNumbers = size * size;
  const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
  
  // Fisher-Yates shuffle
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
}

export function useSchulteEngine(config: SchulteConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();
  
  const totalNumbers = config.gridSize * config.gridSize;
  const [grid, setGrid] = useState<number[]>([]);
  const [expectedNumber, setExpectedNumber] = useState(1);
  const [errors, setErrors] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [lastCorrectTime, setLastCorrectTime] = useState(0);

  // Reaction time history
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGrid(generateSchulteGrid(config.gridSize, config.rng));
  }, [config.gridSize, config.rng]);

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
        reactionTimeMs: reactionTimes,
        errorCount: errors,
        correctCount: expectedNumber - 1,
      },
      algorithmVersion: CURRENT_ALGORITHM_VERSION,
    }, result).catch(err => {console.error(err)});

    if (onCompleteCallback) {
      onCompleteCallback(result);
    }
  }, [createSession, expectedNumber, errors, reactionTimes, onCompleteCallback]);

  // engine.updateMetrics/complete are read through this ref instead of
  // closed over directly, since handleTick is wired in as the *raw* onTick
  // callback passed to useExerciseEngine below - it can't reference the
  // engine object returned by that same hook call.
  const engineActionsRef = useRef<{
    updateMetrics: (metrics: Partial<ExerciseMetrics>) => void;
    complete: () => void;
  } | null>(null);

  // Time limit check, driven by the engine's raw (unthrottled, ~100ms)
  // tick instead of the React-render-throttled `elapsedMs` (which only
  // updates once/second) - the throttle otherwise leaves up to a second
  // where a just-pressed final correct number races against a stale
  // "time's up" render, occasionally losing.
  const handleTick = useCallback((ms: number) => {
    if (isCompleted || isTimeUp || ms < config.timeLimitMs) return;
    setIsTimeUp(true);
    setIsCompleted(true);
    engineActionsRef.current?.updateMetrics({
      completionRate: (expectedNumber - 1) / totalNumbers,
      correctCount: expectedNumber - 1,
      errorCount: errors,
      reactionTimeMs: reactionTimes,
    });
    engineActionsRef.current?.complete();
  }, [isCompleted, isTimeUp, config.timeLimitMs, expectedNumber, totalNumbers, errors, reactionTimes]);

  const engine = useExerciseEngine(schulteDefinition, config, handleComplete, handleTick);

  useEffect(() => {
    engineActionsRef.current = { updateMetrics: engine.updateMetrics, complete: engine.complete };
  });

  const handleNumberPress = useCallback((num: number) => {
    if (engine.session.state !== 'running' || isCompleted) return;

    if (num === expectedNumber) {
      const currentReactionTime = engine.elapsedMs - lastCorrectTime;
      const newReactionTimes = [...reactionTimes, currentReactionTime];
      setReactionTimes(newReactionTimes);
      setLastCorrectTime(engine.elapsedMs);

      if (num === totalNumbers) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCompleted(true);
        engine.updateMetrics({
          completionRate: 1,
          correctCount: expectedNumber,
          errorCount: errors,
          reactionTimeMs: newReactionTimes,
        });
        engine.complete();
      } else {
        setExpectedNumber(prev => prev + 1);
      }
    } else {
      setErrors(prev => prev + 1);
      // Wrong tap reshuffles the board as a penalty, without losing
      // progress (expectedNumber/errors carry over).
      setGrid(generateSchulteGrid(config.gridSize, config.rng));
    }
  }, [engine, expectedNumber, totalNumbers, isCompleted, lastCorrectTime, errors, reactionTimes, config.gridSize, config.rng]);

  const reset = useCallback(() => {
    engine.reset();
    setGrid(generateSchulteGrid(config.gridSize, config.rng));
    setExpectedNumber(1);
    setErrors(0);
    setIsCompleted(false);
    setIsTimeUp(false);
    setLastCorrectTime(0);
    setReactionTimes([]);
  }, [engine, config.gridSize, config.rng]);

  return {
    ...engine,
    reset,
    grid,
    expectedNumber,
    errors,
    isCompleted,
    isTimeUp,
    handleNumberPress,
  };
}
