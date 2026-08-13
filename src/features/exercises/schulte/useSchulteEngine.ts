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

const MIN_GRID_SIZE = 3;
const MAX_GRID_SIZE = 7;
// Consecutive clean (no wrong taps) tables to level up, or consecutive
// tables with at least one wrong tap to level down - a single lucky or
// unlucky table shouldn't move the difficulty.
const STREAK_THRESHOLD = 2;

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

/**
 * Runs tables back-to-back for the whole `timeLimitMs` window instead of
 * stopping at the first solved grid - only the time limit ends the session.
 * Grid size adapts between tables based on streaks (see STREAK_THRESHOLD),
 * not a single correct/incorrect table, so the difficulty curve stays
 * stable rather than jumping on every table.
 */
export function useSchulteEngine(config: SchulteConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();

  const [level, setLevel] = useState(config.gridSize);
  const totalNumbers = level * level;
  const [grid, setGrid] = useState<number[]>([]);
  const [expectedNumber, setExpectedNumber] = useState(1);
  const [errors, setErrors] = useState(0);
  const [roundErrors, setRoundErrors] = useState(0);
  const [cleanStreak, setCleanStreak] = useState(0);
  const [errorStreak, setErrorStreak] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  // Bumped whenever the grid is regenerated (solve or wrong tap) so the
  // screen can force fresh button instances - reusing the same keyed
  // buttons across a mass disabled-state flip leaves some native
  // touchables stuck unresponsive.
  const [tableVersion, setTableVersion] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastCorrectTime, setLastCorrectTime] = useState(0);

  // Reaction time history
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGrid(generateSchulteGrid(level, config.rng));
    // Mount-only: subsequent grids are generated directly by handleNumberPress
    // (new table on solve, reshuffle on wrong tap).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        correctCount: totalCorrect,
      },
      algorithmVersion: CURRENT_ALGORITHM_VERSION,
    }, result).catch(err => {console.error(err)});

    if (onCompleteCallback) {
      onCompleteCallback(result);
    }
  }, [createSession, totalCorrect, errors, reactionTimes, onCompleteCallback]);

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
    if (isCompleted || ms < config.timeLimitMs) return;
    setIsCompleted(true);
    engineActionsRef.current?.updateMetrics({
      completionRate: 1,
      correctCount: totalCorrect,
      errorCount: errors,
      reactionTimeMs: reactionTimes,
    });
    engineActionsRef.current?.complete();
  }, [isCompleted, config.timeLimitMs, totalCorrect, errors, reactionTimes]);

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
      setTotalCorrect(prev => prev + 1);

      if (num === totalNumbers) {
        // Table solved - adapt the level from streaks, then start the next
        // table immediately. Only the time limit (handleTick) ends the
        // session.
        const tableWasClean = roundErrors === 0;
        let nextCleanStreak = tableWasClean ? cleanStreak + 1 : 0;
        let nextErrorStreak = tableWasClean ? 0 : errorStreak + 1;
        let nextLevel = level;

        if (nextCleanStreak >= STREAK_THRESHOLD) {
          nextLevel = Math.min(MAX_GRID_SIZE, level + 1);
          nextCleanStreak = 0;
        } else if (nextErrorStreak >= STREAK_THRESHOLD) {
          nextLevel = Math.max(MIN_GRID_SIZE, level - 1);
          nextErrorStreak = 0;
        }

        setCleanStreak(nextCleanStreak);
        setErrorStreak(nextErrorStreak);
        setLevel(nextLevel);
        setRoundsCompleted(prev => prev + 1);
        setRoundErrors(0);
        setExpectedNumber(1);
        setGrid(generateSchulteGrid(nextLevel, config.rng));
        setTableVersion(v => v + 1);
        setLastCorrectTime(engine.elapsedMs);
      } else {
        setExpectedNumber(prev => prev + 1);
      }
    } else {
      setErrors(prev => prev + 1);
      setRoundErrors(prev => prev + 1);
      // Wrong tap restarts the current table from 1 on a reshuffled board -
      // a real penalty, instead of silently carrying progress over onto a
      // board the player hasn't seen yet.
      setExpectedNumber(1);
      setGrid(generateSchulteGrid(level, config.rng));
      setTableVersion(v => v + 1);
    }
  }, [engine, expectedNumber, totalNumbers, isCompleted, lastCorrectTime, reactionTimes, level, roundErrors, cleanStreak, errorStreak, config.rng]);

  const reset = useCallback(() => {
    engine.reset();
    setLevel(config.gridSize);
    setGrid(generateSchulteGrid(config.gridSize, config.rng));
    setExpectedNumber(1);
    setErrors(0);
    setRoundErrors(0);
    setCleanStreak(0);
    setErrorStreak(0);
    setRoundsCompleted(0);
    setTotalCorrect(0);
    setTableVersion(0);
    setIsCompleted(false);
    setLastCorrectTime(0);
    setReactionTimes([]);
  }, [engine, config.gridSize, config.rng]);

  return {
    ...engine,
    reset,
    grid,
    gridSize: level,
    expectedNumber,
    errors,
    roundsCompleted,
    totalCorrect,
    tableVersion,
    isCompleted,
    handleNumberPress,
  };
}
